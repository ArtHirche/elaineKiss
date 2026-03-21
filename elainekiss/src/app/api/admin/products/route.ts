import { NextRequest, NextResponse } from 'next/server';
import { productDb } from '@/lib/products';
import { isAdminMiddleware } from '@/lib/admin';
import { CreateProductInput } from '@/types/product';

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Criar produto (admin)
 *     tags: [Admin - Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do produto
 *               description:
 *                 type: string
 *                 description: Descrição do produto
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Preço do produto
 *               category:
 *                 type: string
 *                 description: ID da categoria
 *               image:
 *                 type: string
 *                 description: URL da imagem principal
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de URLs de imagens
 *               stock:
 *                 type: integer
 *                 description: Quantidade em estoque
 *               isActive:
 *                 type: boolean
 *                 description: Produto ativo
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   get:
 *     summary: Listar todos os produtos (admin)
 *     tags: [Admin - Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoria
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *           default: true
 *         description: Mostrar apenas produtos ativos
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Não autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Acesso negado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const POST = isAdminMiddleware(async (request: NextRequest, { userId }) => {
  try {
    const body: CreateProductInput = await request.json();
    const { name, description, price, category, image, images, stock, isActive } = body;

    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Nome, descrição, preço e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    if (price < 0) {
      return NextResponse.json(
        { error: 'Preço não pode ser negativo' },
        { status: 400 }
      );
    }

    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        { error: 'Estoque não pode ser negativo' },
        { status: 400 }
      );
    }

    const product = await productDb.createProduct(body, userId);

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
});

export const GET = isAdminMiddleware(async (request: NextRequest, { userId }) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const activeOnly = searchParams.get('activeOnly') !== 'false';

    const products = await productDb.getProducts(category || undefined, activeOnly);

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
});
