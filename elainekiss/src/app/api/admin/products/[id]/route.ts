import { NextRequest, NextResponse } from 'next/server';
import { productDb } from '@/lib/products';
import { UpdateProductInput } from '@/types/product';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const { verifyToken } = await import('@/lib/auth');
    const { db } = await import('@/lib/database');
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await db.findUserById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }
    
    const { id } = context.params;
    
    const product = await productDb.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erro ao obter produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const { verifyToken } = await import('@/lib/auth');
    const { db } = await import('@/lib/database');
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await db.findUserById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = context.params;
    const body: UpdateProductInput = await request.json();

    if (body.price !== undefined && body.price < 0) {
      return NextResponse.json(
        { error: 'Preço não pode ser negativo' },
        { status: 400 }
      );
    }

    if (body.stock !== undefined && body.stock < 0) {
      return NextResponse.json(
        { error: 'Estoque não pode ser negativo' },
        { status: 400 }
      );
    }

    const product = await productDb.updateProduct(id, body);
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Token não fornecido' }, { status: 401 });
    }

    const { verifyToken } = await import('@/lib/auth');
    const { db } = await import('@/lib/database');
    
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
    }

    const user = await db.findUserById(decoded.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const { id } = context.params;

    const success = await productDb.deleteProduct(id);
    if (!success) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Produto removido com sucesso' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erro ao remover produto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
