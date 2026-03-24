import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, generateRefreshToken } from '@/lib/auth';
import { db } from '@/lib/database';
import { CreateUserInput, AuthResponse } from '@/types/user';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar novo usuário
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
 *                 description: Senha (obrigatório para registro com email)
 *               name:
 *                 type: string
 *                 description: Nome do usuário
 *               provider:
 *                 type: string
 *                 enum: [email, google]
 *                 description: Provedor de autenticação
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
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
 *       409:
 *         description: Email já cadastrado
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
    const body: CreateUserInput = await request.json();
    const { email, password, name, provider = 'email' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    if (provider === 'email' && !password) {
      return NextResponse.json(
        { error: 'Senha é obrigatória para registro com email' },
        { status: 400 }
      );
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Usuário já existe com este email' },
        { status: 409 }
      );
    }

    let hashedPassword: string | undefined;
    if (provider === 'email' && password) {
      hashedPassword = await hashPassword(password);
    }

    const user = await db.createUser({
      email,
      name,
      password: hashedPassword,
      provider,
    });

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

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Erro no registro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
