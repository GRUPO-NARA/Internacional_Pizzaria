# Internacional Pizzaria

Landing page responsiva da Internacional Pizzaria & Trattoria, construída com Next.js App Router e executada por Vinext/Vite sobre Cloudflare Workers.

## Requisitos

- Node.js 22.13 ou superior
- npm

## Desenvolvimento

```powershell
npm run install:ci
npm run dev
```

A aplicação ficará disponível em `http://127.0.0.1:5173/`.

## Verificações

```powershell
npm run lint
npm run build
```

Para testar localmente o Worker gerado pelo build:

```powershell
npm start
```

## Estrutura principal

- `app/page.tsx`: conteúdo e interações da página.
- `app/globals.css`: identidade visual e responsividade.
- `app/layout.tsx`: metadados e layout raiz.
- `public/images`: imagens utilizadas pela interface.
- `build` e `scripts`: integração necessária com Vinext e Cloudflare.

## Estado funcional

A seleção de unidade, escolha de pizza, tamanho, quantidade e sacola são executadas no estado local do navegador. A sacola é demonstrativa e não possui persistência ou checkout.