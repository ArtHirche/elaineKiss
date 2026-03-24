import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, generateRefreshToken, verifyToken } from '@/lib/auth';
import { db } from '@/lib/database';
import { LoginInput, AuthResponse } from '@/types/user';

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Fazer login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email do usuário
 *               password:
 *                 type: string
 *                 description: Senha (obrigatório para login com email)
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciais inválidas
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
 *   put:
 *     summary: Refresh token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Token de refresh
 *     responses:
 *       200:
 *         description: Token atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Refresh token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Refresh token inválido
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
export async function POST(request: NextRequest) {
  try {
    const body: LoginInput = await request.json();
    const { email, password, provider = 'email', providerId, accessToken } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    let user;

    if (provider === 'email') {
      if (!password) {
        return NextResponse.json(
          { error: 'Senha é obrigatória para login com email' },
          { status: 400 }
        );
      }

      user = await db.findUserByEmail(email);
      if (!user || !user.password || user.provider !== 'email') {
        return NextResponse.json(
          { error: 'Credenciais inválidas' },
          { status: 401 }
        );
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Credenciais inválidas' },
          { status: 401 }
        );
      }
    } else if (provider === 'google' && providerId) {
      user = await db.findUserByProvider(provider, providerId);
      if (!user) {
        return NextResponse.json(
          { error: 'Usuário não encontrado com este provedor' },
          { status: 401 }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Provedor de autenticação inválido' },
        { status: 400 }
      );
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
        providerId: user.providerId,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { error: 'Refresh token é obrigatório' },
        { status: 400 }
      );
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Refresh token inválido' },
        { status: 401 }
      );
    }

    const user = await db.findUserById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      );
    }

    const newToken = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        provider: user.provider,
        providerId: user.providerId,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: newToken,
      refreshToken: newRefreshToken,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro no refresh token:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
