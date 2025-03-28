# Procrastinotize

Uma aplicação de gerenciamento de tarefas moderna e intuitiva, desenvolvida com React, TypeScript e Firebase.

## Funcionalidades

- ✨ Interface moderna e responsiva
- 🔐 Autenticação de usuários
- 📝 Criação e gerenciamento de tarefas
- 🏷️ Categorização e tags
- 📅 Datas de entrega
- ⭐ Prioridades
- ✅ Subtarefas
- 🔍 Pesquisa e filtros
- 📊 Resumo de progresso

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Firebase
- Tailwind CSS
- Shadcn/ui
- Sonner (notificações)

## Configuração do Projeto

1. Clone o repositório:
```bash
git clone https://github.com/kelsondias0968/oba.git
cd oba
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

4. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

## Deploy

O projeto está configurado para deploy na Vercel. Para fazer o deploy:

1. Faça push do código para o GitHub
2. Conecte o repositório na Vercel
3. Configure as variáveis de ambiente na Vercel
4. Deploy automático será realizado

## Licença

MIT
