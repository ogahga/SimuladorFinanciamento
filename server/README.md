# Backend do Simulador de Financiamento Imobiliário

Este é o servidor backend do Simulador de Financiamento Imobiliário, que permite salvar e carregar simulações a partir de um banco de dados PostgreSQL.

## Requisitos

- Node.js (v14 ou superior)
- npm ou yarn
- Conexão com o banco de dados PostgreSQL (já configurada)

## Instalação

1. Instale as dependências:
   ```
   npm install
   ```
   ou
   ```
   yarn install
   ```

2. Inicialize o banco de dados (isso criará as tabelas necessárias):
   ```
   npm run init-db
   ```
   ou
   ```
   yarn init-db
   ```

3. Inicie o servidor:
   ```
   npm start
   ```
   ou
   ```
   yarn start
   ```

4. Para desenvolvimento com recarregamento automático:
   ```
   npm run dev
   ```
   ou
   ```
   yarn dev
   ```

## Endpoints da API

A API estará disponível em `http://localhost:3001/api`.

### Simulações

- `GET /api/simulations` - Listar todas as simulações
- `GET /api/simulations/:id` - Buscar uma simulação específica
- `POST /api/simulations` - Criar uma nova simulação
- `PUT /api/simulations/:id` - Atualizar uma simulação existente
- `DELETE /api/simulations/:id` - Excluir uma simulação

### Status

- `GET /api/status` - Verificar status da API

## Estrutura do Banco de Dados

O banco de dados consiste em três tabelas principais:

1. **users** - Informações de usuários (para implementação futura de autenticação)
   - id: Identificador único
   - name: Nome do usuário
   - email: Email do usuário (único)
   - created_at: Data de criação

2. **simulations** - Simulações de financiamento
   - id: Identificador único
   - user_id: Referência para o usuário (opcional)
   - name: Nome da simulação
   - principal: Valor do financiamento
   - term: Prazo em meses
   - annual_interest: Taxa de juros anual (decimal)
   - annual_correction: Taxa de correção anual (decimal)
   - insurance: Valor do seguro mensal
   - system: Sistema de amortização ('sac' ou 'price')
   - created_at: Data de criação
   - notes: Observações sobre a simulação

3. **extra_amortizations** - Amortizações extras adicionadas às simulações
   - id: Identificador único
   - simulation_id: Referência para a simulação
   - month: Mês da amortização (pode ser um mês específico, um intervalo ou lista de meses)
   - value: Valor da amortização
   - type: Tipo de amortização ('prazo' ou 'parcela')

## Conexão com o Frontend

O frontend está configurado para se comunicar com a API através do arquivo `src/services/api.js`. Se for necessário alterar a URL da API ou adicionar autenticação, as modificações devem ser feitas nesse arquivo.
