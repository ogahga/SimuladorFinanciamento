const express = require('express');
const cors = require('cors');
const { testConnection } = require('./db/db');
const { initializeDatabase } = require('./db/init');
const simulationRoutes = require('./routes/simulationRoutes');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parsear JSON

// Rotas
app.use('/api', simulationRoutes);

// Rota de status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    message: 'API do Simulador de Financiamento está funcionando!',
    timestamp: new Date()
  });
});

// Inicializar o banco de dados e iniciar o servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco de dados
    const connectionSuccess = await testConnection();
    
    if (!connectionSuccess) {
      console.error('Falha ao conectar com o banco de dados. O servidor não será iniciado.');
      process.exit(1);
    }
    
    // Inicializar as tabelas do banco de dados
    await initializeDatabase();
    
    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`API disponível em http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
