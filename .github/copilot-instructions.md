# Instruções do Copilot para Fun With Flags

## Visão geral
- Projeto **Next.js 15 App Router** (React 19) com fetch de dados **no cliente**.
- Usa a **REST Countries API** via `NEXT_PUBLIC_API_URL` (configurado em `.env.local`).
- UI construída com Tailwind, componentes reutilizáveis em `app/components`.
- Lógica de fetch centralizada em `app/services/api.js`, retornando tuplas `[data, error]`.

## Áreas principais
- `app/page.tsx`: página principal com lista de países (search + filtro por região) chama `countriesApi.getAll()`.
- `app/country/[id]/page.tsx`: página de detalhe chama `countriesApi.getCountry(id)`.
- `app/layout.tsx`: layout global + fonte + header/footer.

## Como os dados fluem (padrões comuns)
- As chamadas de API ficam em `app/services/api.js` (exporta `countriesApi`).
- Cada método de API retorna uma tupla `[data, error]`.
- Páginas (componentes cliente) usam `useEffect` para disparar fetch, setar `loading`, `error` e dados.
- Erros são exibidos via `<Error text={error} />` e loading via `<Loading text="..." />`.

## Tipos e estrutura de dados (exemplos reais)
- `Country` (listagem): `{ cca3, flags: { svg }, name: { common }, capital, region, population }`
- `DetaildCountry` (detalhe): `{ ...Country, languages, currencies, tld, borders }`

## Fluxo de trabalho do desenvolvedor
- Instalar dependências: `npm install`
- Rodar em dev: `npm run dev` (Next.js + Turbopack)
- Build de produção: `npm run build`
- Rodar build: `npm run start`
- Lint: `npm run lint`

## Ambiente
- Copie `.env.example` → `.env.local` e configure:
  - `NEXT_PUBLIC_API_URL` (padrão no repositório: `https://restcountries.com/v3.1`).

## Convenções do projeto
- Componentes que usam hooks devem ser **client components** (ver `'use client'` no topo).
- Separe UI e lógica de dados:
  - UI em `app/components/*`
  - Chamadas de API em `app/services/api.js`
  - Helpers em `app/utils/*`
- Roteamento segue **App Router**: pasta = rota, `page.tsx` é o componente da rota.
- Use o helper `countriesApi` para fetches; ele retorna `[data, error]` e trata erros de `fetch`.

## Pontos de integração
- API externa: `https://restcountries.com/v3.1` (via `NEXT_PUBLIC_API_URL`)
- Não há backend ou banco de dados neste repo; é frontend puro consumindo API externa.

## Adicionando novas funcionalidades
- Adicione novas rotas em `app/` (ex: `app/foo/page.tsx`).
- Adicione novas chamadas em `app/services/api.js` mantendo o formato de retorno `[data, error]`.
- Reutilize componentes existentes (`Card`, `Grid`, `Search`, etc.) para manter consistência.

## Modelos de alteração comuns (o que um agente pode fazer)
- **Adicionar rota nova**: criar `app/<rota>/page.tsx` e usar os componentes existentes (`Card`, `Grid`, etc.).
- **Estender API**: adicionar método em `app/services/api.js`, seguir o mesmo contrato `[data, error]`.
- **Filtro/ordenção na UI**: usar `useState` e métodos de array (`filter`, `sort`) na página.

---

> Se algo estiver confuso ou faltar informações específicas do projeto, me avise para que eu possa ajustar as instruções.