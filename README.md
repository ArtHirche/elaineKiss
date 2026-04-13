# elaineKiss

Este repositório contém a aplicação Next.js usada para a loja **elaineKiss**.

Este README explica como preparar o ambiente, instalar dependências e executar o projeto em desenvolvimento e produção, com exemplos de comandos para Windows PowerShell.

## Requisitos

- Node.js 18.x ou 20.x (recomendado). Verifique com:

```powershell
node -v
```

- Um gerenciador de pacotes: npm (vem com Node), pnpm ou yarn.

Observação: o projeto usa Next.js 16 e TypeScript; algumas dependências de desenvolvimento podem exigir Node >= 18.

## Estrutura relevante

O código principal fica na pasta `elainekiss` deste repositório. Os scripts definidos no `package.json` são:

- `dev` — inicia o servidor de desenvolvimento (Next.js)
- `build` — gera a build de produção
- `start` — inicia a aplicação a partir da build
- `lint` — roda o ESLint

Esses scripts podem ser executados a partir da pasta `elainekiss`.

## Instalação (passo a passo)

1. Abra um terminal PowerShell e navegue até a pasta do repositório (ou clone primeiro):

```powershell
# Se ainda não clonou o repo (substitua <repo-url> pelo URL real)
git clone https://github.com/ArtHirche/elaineKiss.git

# Entre na pasta do projeto
cd elainekiss
```

2. Instale as dependências (escolha um dos comandos abaixo):

```powershell
# Usando npm
npm install

# Ou usando pnpm (se preferir pnpm)
pnpm install

# Ou usando yarn
yarn install
```

3. Iniciar em modo desenvolvimento:

```powershell
npm run dev
# ou `pnpm dev` / `yarn dev`
```

O servidor de desenvolvimento normalmente ficará disponível em http://localhost:3000.

## Fluxo de trabalho com Git (Git Flow)

Este projeto segue um fluxo de Git estruturado para manter a qualidade do código:

### Regras de branches

- **`main`**: Branch de produção. Recebe PRs apenas da branch `develop`. Qualquer commit aqui deve estar pronto para produção.
- **`develop`**: Branch de desenvolvimento. Recebe PRs das branches de feature. Periodicamente faz PR para `main`.
- **`feature/*`**: Branches para novas features ou correções. Devem ser criadas a partir de `develop` e fazer PR de volta para `develop` quando prontas.

### Processo de desenvolvimento

1. **Criar uma nova branch para sua feature:**

```powershell
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-sua-feature
```

2. **Fazer commits na sua branch:**

```powershell
git add .
git commit -m "Descrição clara da mudança"
git push origin feature/nome-da-sua-feature
```

3. **Abrir um Pull Request (PR):**
   - No GitHub, abra um PR da sua branch `feature/nome-da-sua-feature` para `develop`.
   - Descreva claramente o que foi implementado.
   - Aguarde revisão antes de fazer merge.

4. **Após aprovação:**
   - Faça merge do PR para `develop`.
   - Delete a branch da feature:

```powershell
git branch -d feature/nome-da-sua-feature
git push origin --delete feature/nome-da-sua-feature
```

5. **Release para produção:**
   - Quando `develop` estiver estável, faça um PR de `develop` para `main`.
   - Após merge em `main`, a aplicação estará pronta para deploy em produção.

### Convenção de nomes para branches

Use nomes descritivos e em inglês:
- `feature/add-user-authentication`
- `feature/fix-checkout-bug`
- `feature/update-homepage-design`

## Build e execução em produção

1. Gerar a build de produção:

```powershell
npm run build
# ou `pnpm build` / `yarn build`
```

2. Iniciar a aplicação a partir da build:

```powershell
npm run start
# ou `pnpm start` / `yarn start`
```

## Lint

Para executar o linter do projeto:

```powershell
npm run lint
# ou `pnpm lint` / `yarn lint`
```

## Variáveis de ambiente

Se o projeto precisar de variáveis de ambiente, crie um arquivo `.env.local` na pasta `elainekiss` e adicione as chaves necessárias. Este repositório atualmente não inclui um `.env.example`, então verifique o código para saber quais variáveis são esperadas.

## Resolução de problemas comuns

- Erro de versão do Node: verifique `node -v`. Use nvm / nvm-windows para alternar versões se necessário.
- Dependências conflitantes: remova `node_modules` e o lockfile (`package-lock.json`/`pnpm-lock.yaml`/`yarn.lock`) e reinstale:

```powershell
rm -Recurse -Force node_modules; rm package-lock.json -ErrorAction SilentlyContinue; npm install
```

- Se o build falhar, verifique as mensagens do console; muitas vezes faltam variáveis de ambiente ou há incompatibilidade de versões.

## Observações

- Tecnologias principais: Next.js 16, React 19, Tailwind CSS (v4), TypeScript.
- Se for colaborar, abra issues ou pull requests com descrições claras do problema/feature.

---

Desenvolvido por:
- Arthur Hirche;
- Erik David.
