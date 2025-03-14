# API do Simulador de Financiamento

Esta pasta contém o código do servidor backend para o Simulador de Financiamento.

## Estrutura

- `index.js` - Ponto de entrada da aplicação
- `controllers/` - Controladores para as rotas da API
- `models/` - Modelos para acesso ao banco de dados
- `routes/` - Definição das rotas da API
- `db/` - Configuração e inicialização do banco de dados

## Endpoints da API

- `GET /api/status` - Verifica o status do servidor
- `GET /api/simulations` - Lista todas as simulações
- `GET /api/simulations/:id` - Busca uma simulação específica
- `POST /api/simulations` - Cria uma nova simulação
- `PUT /api/simulations/:id` - Atualiza uma simulação existente
- `DELETE /api/simulations/:id` - Exclui uma simulação

## Configuração

1. Instale as dependências:
   ```
   npm install
   ```

2. Inicialize o banco de dados:
   ```
   npm run init-db
   ```

3. Inicie o servidor:
   ```
   npm start
   ```

## Banco de Dados

O sistema utiliza PostgreSQL como banco de dados. A conexão é configurada em `db/db.js`.