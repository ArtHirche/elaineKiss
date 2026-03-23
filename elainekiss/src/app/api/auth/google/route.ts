import { NextRequest, NextResponse } from 'next/server';
import { generateToken, generateRefreshToken } from '@/lib/auth';
import { db } from '@/lib/database';
import { AuthResponse } from '@/types/user';

interface GoogleUserInfo {
  id: string;
  email: string;
  name: string;
  picture?: string;
  verified_email?: boolean;
}

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login com Google
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accessToken
 *             properties:
 *               accessToken:
 *                 type: string
 *                 description: Token de acesso do Google
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Token não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token do Google inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email já cadastrado com outro método
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
    const body = await request.json();
    const { accessToken } = body;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Token de acesso do Google é obrigatório' },
        { status: 400 }
      );
    }

    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );

    if (!googleResponse.ok) {
      return NextResponse.json(
        { error: 'Token do Google inválido' },
        { status: 401 }
      );
    }

    const googleUser: GoogleUserInfo = await googleResponse.json();

    let user = await db.findUserByProvider('google', googleUser.id);

    if (!user) {
      const existingUser = await db.findUserByEmail(googleUser.email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email já cadastrado com outro método' },
          { status: 409 }
        );
      }

      user = await db.createUser({
        email: googleUser.email,
        name: googleUser.name,
        provider: 'google',
        providerId: googleUser.id,
      });
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
        emailVerified: googleUser.verified_email || false,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token,
      refreshToken,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro na autenticação com Google:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
