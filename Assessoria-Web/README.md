# Assessoria Web

Sistema web para digitalizar fichas de assessoria técnica, implantação e visitas ao cliente.

## Stack

- Bun
- JavaScript
- React
- Vite
- Tailwind CSS

## Como rodar

Instale as dependências:

```bash
bun install
```

Inicie o ambiente de desenvolvimento:

```bash
bun run dev
```

Gere a versão de produção:

```bash
bun run build
```

Visualize o build localmente:

```bash
bun run preview
```

## Estrutura

- `src/components`: componentes reutilizáveis
- `src/pages`: telas da aplicação
- `src/layouts`: estrutura visual com sidebar e header
- `src/routes`: rotas da aplicação
- `src/hooks`: hooks de acesso aos dados
- `src/services`: camada de persistência local, pronta para troca por API
- `src/utils`: formatação, filtros, cálculo de horas e PDF
- `src/data`: opções e dados mockados
- `src/assets`: imagens e identidade visual

## Persistência

Os registros são salvos no `localStorage` pela camada `assessmentRepository`.
Para integrar com backend/API no futuro, substitua a implementação em:

```text
src/services/assessmentRepository.js
```

## Login inicial

A aplicação abre primeiro na tela de login. A sessão também fica salva no
`localStorage`, pela camada:

```text
src/services/authService.js
```

Usuários mockados para demonstração:

| Usuário | Senha | Perfil |
| --- | --- | --- |
| `rafael` | `123456` | Técnico |
| `marina` | `123456` | Técnica |
| `diego` | `123456` | Técnico |
| `admin` | `admin123` | Administrador |

## Funcionalidades

- Login local com usuários mockados
- Dashboard com resumo e filtros
- Cadastro e edição de assessorias
- Cálculo automático de horas
- Assinatura do técnico e do cliente com mouse ou toque
- Histórico com busca, filtros, paginação e ordenação por data
- Visualização completa do registro
- Duplicação de assessoria
- Exclusão com confirmação
- Impressão A4 com via da empresa e via do cliente
- Exportação em PDF
