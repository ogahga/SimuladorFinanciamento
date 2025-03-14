# Documentação da API do Simulador de Financiamento

Esta documentação descreve os endpoints disponíveis na API REST do Simulador de Financiamento.

## Base URL

```
http://localhost:3001/api
```

## Endpoints

### Simulações

#### Listar todas as simulações

```
GET /simulations
```

**Resposta**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Simulação Casa 300mil",
      "principal": 300000,
      "term": 360,
      "annual_interest": 0.08,
      "annual_correction": 0.045,
      "insurance": 150,
      "system": "sac",
      "created_at": "2025-03-10T10:32:45Z",
      "updated_at": "2025-03-10T10:32:45Z"
    },
    {
      "id": 2,
      "name": "Simulação Apartamento 500mil",
      "principal": 500000,
      "term": 300,
      "annual_interest": 0.10,
      "annual_correction": 0.035,
      "insurance": 200,
      "system": "price",
      "created_at": "2025-03-11T14:22:15Z",
      "updated_at": "2025-03-11T14:22:15Z"
    }
  ]
}
```

#### Obter simulação por ID

```
GET /simulations/:id
```

**Resposta**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Simulação Casa 300mil",
    "principal": 300000,
    "term": 360,
    "annual_interest": 0.08,
    "annual_correction": 0.045,
    "insurance": 150,
    "system": "sac",
    "created_at": "2025-03-10T10:32:45Z",
    "updated_at": "2025-03-10T10:32:45Z",
    "amortizations": [
      {
        "id": 1,
        "simulation_id": 1,
        "month": "24",
        "value": 10000,
        "type": "prazo"
      },
      {
        "id": 2,
        "simulation_id": 1,
        "month": "48",
        "value": 15000,
        "type": "parcela"
      }
    ]
  }
}
```

#### Criar nova simulação

```
POST /simulations
```

**Corpo da Requisição**

```json
{
  "name": "Simulação Casa 300mil",
  "principal": 300000,
  "term": 360,
  "annual_interest": 0.08,
  "annual_correction": 0.045,
  "insurance": 150,
  "system": "sac",
  "amortizations": [
    {
      "month": "24",
      "value": 10000,
      "type": "prazo"
    },
    {
      "month": "48",
      "value": 15000,
      "type": "parcela"
    }
  ]
}
```

**Resposta**

```json
{
  "success": true,
  "message": "Simulação criada com sucesso",
  "data": {
    "id": 3,
    "name": "Simulação Casa 300mil",
    "principal": 300000,
    "term": 360,
    "annual_interest": 0.08,
    "annual_correction": 0.045,
    "insurance": 150,
    "system": "sac",
    "created_at": "2025-03-14T20:45:12Z",
    "updated_at": "2025-03-14T20:45:12Z"
  }
}
```

#### Atualizar simulação

```
PUT /simulations/:id
```

**Corpo da Requisição**

```json
{
  "name": "Simulação Casa 320mil",
  "principal": 320000,
  "term": 360,
  "annual_interest": 0.079,
  "annual_correction": 0.045,
  "insurance": 160,
  "system": "sac"
}
```

**Resposta**

```json
{
  "success": true,
  "message": "Simulação atualizada com sucesso",
  "data": {
    "id": 1,
    "name": "Simulação Casa 320mil",
    "principal": 320000,
    "term": 360,
    "annual_interest": 0.079,
    "annual_correction": 0.045,
    "insurance": 160,
    "system": "sac",
    "created_at": "2025-03-10T10:32:45Z",
    "updated_at": "2025-03-14T21:12:33Z"
  }
}
```

#### Excluir simulação

```
DELETE /simulations/:id
```

**Resposta**

```json
{
  "success": true,
  "message": "Simulação excluída com sucesso"
}
```

### Amortizações

#### Adicionar amortização a uma simulação

```
POST /simulations/:id/amortizations
```

**Corpo da Requisição**

```json
{
  "month": "120",
  "value": 25000,
  "type": "prazo"
}
```

**Resposta**

```json
{
  "success": true,
  "message": "Amortização adicionada com sucesso",
  "data": {
    "id": 5,
    "simulation_id": 1,
    "month": "120",
    "value": 25000,
    "type": "prazo",
    "created_at": "2025-03-14T21:15:22Z",
    "updated_at": "2025-03-14T21:15:22Z"
  }
}
```

#### Remover amortização

```
DELETE /amortizations/:id
```

**Resposta**

```json
{
  "success": true,
  "message": "Amortização removida com sucesso"
}
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Erro na requisição
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

## Tratamento de Erros

Em caso de erro, a API retorna uma resposta no seguinte formato:

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "details": {
    "campo": ["Mensagem de erro específica para o campo"]
  }
}
```

## Autenticação

A API atualmente não requer autenticação, mas essa funcionalidade será implementada em versões futuras.