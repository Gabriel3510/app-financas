# 💰 App Finanças Pessoais

Um aplicativo completo de finanças pessoais construído com React + TypeScript + Vite.

## 📸 Funcionalidades

- **Dashboard**: Resumo financeiro do mês com cards de receitas, despesas, saldo e % economizado
- **Transações**: Adicionar, editar e excluir receitas e despesas com categorias
- **Gráficos**: Pizza (gastos por categoria), Barras (histórico mensal), Linha (evolução do saldo)
- **Orçamento**: Metas de gasto por categoria com barra de progresso e alertas
- **Configurações**: Gerenciar salário, categorias personalizadas, backup e restauração

## 🚀 Como rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:5173 no seu navegador.

## 🛠️ Tecnologias

- **React 18** + **TypeScript** — UI e tipagem
- **Vite** — Bundler ultra-rápido
- **Tailwind CSS** — Estilização utility-first
- **Recharts** — Gráficos interativos
- **date-fns** — Manipulação de datas
- **lucide-react** — Ícones modernos

## 📦 Deploy

```bash
npm run build
```

Os arquivos de produção estarão na pasta `dist/`. Você pode fazer deploy em qualquer plataforma estática como Vercel, Netlify ou GitHub Pages.
