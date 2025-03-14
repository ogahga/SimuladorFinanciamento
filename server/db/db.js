const { Pool } = require('pg');

// Configuração da conexão com o banco de dados PostgreSQL
const pool = new Pool({
  connectionString: 'postgresql://postgres:8fD@2Lr-s-WiZqb@db.xbgqdyzmxqeebuxdhcxl.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false // Necessário para conexões com Supabase
  }
});

// Função para testar a conexão com o banco de dados
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    client.release();
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  
  // Função helper para executar queries
  query: (text, params) => pool.query(text, params)
};