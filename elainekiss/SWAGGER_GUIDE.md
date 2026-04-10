# Documentação Swagger UI

A API agora possui documentação interativa com Swagger UI!

## Como Acessar

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse a documentação:**
   - Abra no navegador: `https://elainekiss.com/api/docs`
   
3. **Documentação em JSON:**
   - Para obter o JSON do OpenAPI: `https://elainekiss.com/api/docs?format=json`

## Recursos da Documentação

### 📚 Estrutura Completa
- **Autenticação**: Registro, login, Google OAuth, refresh token
- **Produtos**: CRUD completo para administradores
- **Categorias**: Gerenciamento de categorias
- **Segurança**: Documentação de autenticação JWT

### 🔐 Autenticação
- Clique no botão **"Authorize"** no topo da página
- Insira seu token JWT: `Bearer seu_token_aqui`
- Todos os endpoints protegidos estarão acessíveis

### 🧪 Teste Interativo
- **Try it out**: Teste endpoints diretamente na interface
- **Parâmetros**: Preencha campos obrigatórios
- **Respostas**: Veja exemplos de resposta e códigos de status

### 📋 Schemas Documentados
- **User**: Estrutura completa do usuário com roles
- **Product**: Modelo de produto com todos os campos
- **Category**: Modelo de categoria
- **AuthResponse**: Resposta de autenticação
- **Error**: Padronização de erros

### 🛡️ Segurança
- Documentação de autenticação Bearer JWT
- Endpoints protegidos claramente marcados
- Exemplos de erros 401/403

## Exemplos de Uso

### 1. Registrar Usuário
```bash
POST /api/auth/register
{
  "email": "admin@loja.com",
  "password": "senha123",
  "name": "Administrador"
}
```

### 2. Fazer Login
```bash
POST /api/auth/login
{
  "email": "admin@loja.com",
  "password": "senha123"
}
```

### 3. Criar Produto (Admin)
```bash
POST /api/admin/products
Authorization: Bearer token_jwt_aqui
{
  "name": "Produto Exemplo",
  "description": "Descrição do produto",
  "price": 99.90,
  "category": "categoria-id",
  "stock": 10
}
```

## Benefícios

- ✅ **Documentação viva**: Sempre atualizada com o código
- ✅ **Testes interativos**: Teste APIs sem ferramentas externas
- ✅ **Padronização**: Formato OpenAPI 3.0 profissional
- ✅ **Integração**: Fácil integração com outras ferramentas
- ✅ **Clareza**: Especificações detalhadas de cada endpoint

A documentação está pronta para uso e facilitará muito o desenvolvimento e testes da API!
