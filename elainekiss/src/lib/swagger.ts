import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API da Elaine Kiss - Backend',
      version: '1.0.0',
      description: 'API completa para autenticação, usuários e gerenciamento de produtos',
      contact: {
        name: 'API Support',
        email: 'support@loja.com',
      },
    },
    servers: [
      {
        url: 'https://elainekiss.com',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do usuário',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
            },
            name: {
              type: 'string',
              description: 'Nome do usuário',
            },
            role: {
              type: 'string',
              enum: ['admin', 'user'],
              description: 'Função do usuário',
            },
            provider: {
              type: 'string',
              enum: ['email', 'google'],
              description: 'Provedor de autenticação',
            },
            emailVerified: {
              type: 'boolean',
              description: 'Email verificado',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único do produto',
            },
            name: {
              type: 'string',
              description: 'Nome do produto',
            },
            description: {
              type: 'string',
              description: 'Descrição do produto',
            },
            price: {
              type: 'number',
              format: 'float',
              description: 'Preço do produto',
            },
            category: {
              type: 'string',
              description: 'ID da categoria',
            },
            image: {
              type: 'string',
              description: 'URL da imagem principal',
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Array de URLs de imagens',
            },
            stock: {
              type: 'integer',
              description: 'Quantidade em estoque',
            },
            isActive: {
              type: 'boolean',
              description: 'Produto ativo',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
            createdBy: {
              type: 'string',
              description: 'ID do usuário que criou',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID único da categoria',
            },
            name: {
              type: 'string',
              description: 'Nome da categoria',
            },
            description: {
              type: 'string',
              description: 'Descrição da categoria',
            },
            isActive: {
              type: 'boolean',
              description: 'Categoria ativa',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Data de atualização',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              description: 'Token JWT',
            },
            refreshToken: {
              type: 'string',
              description: 'Token de refresh',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
    },
  },
  apis: ['./src/app/api/**/*.route.ts'], // Path to the API docs
};

export const specs = swaggerJsdoc(options);
