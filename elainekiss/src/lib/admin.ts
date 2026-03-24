import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { db } from '@/lib/database';

export async function requireAdmin(request: NextRequest): Promise<{ userId: string; userRole: string } | NextResponse> {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return NextResponse.json(
      { error: 'Token não fornecido' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    );
  }

  const user = await db.findUserById(decoded.userId);
  if (!user) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Acesso negado. Apenas administradores podem acessar este recurso.' },
      { status: 403 }
    );
  }

  return {
    userId: user.id,
    userRole: user.role,
  };
}

export function isAdminMiddleware(handler: (request: NextRequest, context: { userId: string }) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const adminCheck = await requireAdmin(request);
    
    if (adminCheck instanceof NextResponse) {
      return adminCheck;
    }

    return handler(request, { userId: adminCheck.userId });
  };
}
