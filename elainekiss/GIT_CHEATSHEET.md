# Git Cheat Sheet

Guia rápido dos comandos que vamos usar no projeto.
**Regra de Ouro:** NUNCA commite direto na `main`.

---

## 1. Começando o dia (Atualizar tudo)
Antes de começar a codar, garanta que seu projeto está igual ao do GitHub.
```bash
# Voltar para a main
git checkout main

# Baixar as novidades da nuvem
git pull origin main
```

## 2. Criando uma nova tarefa (Branch)
Vai criar o Header? Crie uma branch só pra isso.

```Bash
# Cria e já entra na branch nova
git checkout -b feature/nome-da-tarefa

# Exemplo:
git checkout -b feature/criar-header
```

## 3. Salvando o trabalho (Commit)
Fez uma alteração que funcionou? Salve.

```Bash
# Adiciona todos os arquivos alterados
git add .

# Salva com uma mensagem explicando o que fez
git commit -m "Criação do componente Header"
```

## 4. Enviando para o GitHub (Push)
Mandou o código para a nuvem para eu ver.

```Bash
# Envia a branch atual para o repositório
git push origin feature/nome-da-tarefa
```
Depois disso, vá lá no site do GitHub e clique em "Compare & pull request".

## 5. Socorro!
Comandos de emergência.

Ver o que eu alterei mas não salvei ainda:
```Bash
git status
```
Desfazer alterações num arquivo (antes do commit):
```Bash
git checkout -- nome-do-arquivo
```
Mudar de branch (se travar dizendo que tem arquivos não salvos):
```Bash
# Guarda suas alterações numa "caixa temporária"
git stash

# Muda de branch
git checkout main

# Quando voltar pra sua branch, recupera a caixa
git stash pop
```

---