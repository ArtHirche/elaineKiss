import { NextRequest, NextResponse } from 'next/server';
import { productDb } from '@/lib/products';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    const product = await productDb.getProductById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      );
    }

    if (!product.isActive) {
      return NextResponse.json(
        { error: 'Produto não está disponível' },
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
