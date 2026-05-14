# Assessoria API

Backend em Node.js + Express com arquitetura modular:

- `src/modules/*`: dominio (controller, service, repository, schema)
- `src/middlewares/*`: auth, validacao, erros
- `src/config/*`: ambiente
- `src/routes/*`: agregacao de rotas

## Executar local

```bash
cd C:\Assesoria Online\Assessoria-API
npm install
npm run dev
```

API local: `http://localhost:3333`

## Variaveis

Use `.env` com base no `.env.example`.

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

## Rotas

- `GET /health`
- `POST /api/auth/login`
- `GET /api/assessments` (Bearer token)
- `GET /api/assessments/:id` (Bearer token)
- `POST /api/assessments` (Bearer token)
- `PUT /api/assessments/:id` (Bearer token)
- `DELETE /api/assessments/:id` (Bearer token)

## Login dev

- email: `admin@exens.com.br`
- senha: `123456`
