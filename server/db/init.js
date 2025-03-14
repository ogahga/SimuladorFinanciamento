const { pool } = require('./db');

/**
 * Script para criar as tabelas necessárias no banco de dados
 */
const initializeDatabase = async () => {
  try {
    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de simulações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS simulations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        principal NUMERIC(15, 2) NOT NULL,
        term INTEGER NOT NULL,
        annual_interest NUMERIC(6, 4) NOT NULL,
        annual_correction NUMERIC(6, 4) NOT NULL,
        insurance NUMERIC(10, 2) NOT NULL,
        system VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);

    // Criar tabela de amortizações extras
    await pool.query(`
      CREATE TABLE IF NOT EXISTS extra_amortizations (
        id SERIAL PRIMARY KEY,
        simulation_id INTEGER REFERENCES simulations(id) ON DELETE CASCADE,
        month VARCHAR(50) NOT NULL,
        value NUMERIC(15, 2) NOT NULL,
        type VARCHAR(20) NOT NULL
      )
    `);

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabelas:', error);
  } finally {
    // Não fechar o pool aqui para permitir que o servidor continue usando
  }
};

// Execute o script se for chamado diretamente
if (require.main === module) {
  initializeDatabase().then(() => {
    console.log('Inicialização concluída');
    pool.end(); // Fechar a conexão após a execução direta
  });
}

module.exports = { initializeDatabase };