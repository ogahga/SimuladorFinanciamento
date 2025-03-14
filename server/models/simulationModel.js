const { query } = require('../db/db');

/**
 * Modelo para gerenciar as simulações no banco de dados
 */
const SimulationModel = {
  /**
   * Criar uma nova simulação
   * @param {Object} simulationData - Dados da simulação
   * @param {Array} amortizations - Lista de amortizações extras
   * @returns {Object} A simulação criada
   */
  async create(simulationData, amortizations = []) {
    const client = await query('BEGIN');
    
    try {
      // Inserir dados básicos da simulação
      const simulationResult = await query(
        `INSERT INTO simulations 
         (user_id, name, principal, term, annual_interest, annual_correction, 
          insurance, system, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          simulationData.userId || null,
          simulationData.name,
          simulationData.principal,
          simulationData.term,
          simulationData.annualInterest,
          simulationData.annualCorrection,
          simulationData.insurance,
          simulationData.system,
          simulationData.notes || ''
        ]
      );

      const simulationId = simulationResult.rows[0].id;

      // Inserir amortizações extras (se houver)
      if (amortizations && amortizations.length > 0) {
        for (const amort of amortizations) {
          await query(
            `INSERT INTO extra_amortizations (simulation_id, month, value, type)
             VALUES ($1, $2, $3, $4)`,
            [simulationId, amort.month, amort.value, amort.type]
          );
        }
      }

      await query('COMMIT');
      
      // Retornar a simulação criada com suas amortizações
      return await this.getById(simulationId);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  /**
   * Buscar uma simulação pelo ID
   * @param {number} id - ID da simulação
   * @returns {Object} A simulação encontrada com suas amortizações
   */
  async getById(id) {
    // Buscar a simulação
    const simulationResult = await query(
      'SELECT * FROM simulations WHERE id = $1',
      [id]
    );

    if (simulationResult.rows.length === 0) {
      return null;
    }

    const simulation = simulationResult.rows[0];

    // Buscar as amortizações extras
    const amortizationsResult = await query(
      'SELECT id, month, value, type FROM extra_amortizations WHERE simulation_id = $1',
      [id]
    );

    // Combinar em um único objeto
    return {
      ...simulation,
      amortizations: amortizationsResult.rows || []
    };
  },

  /**
   * Listar todas as simulações de um usuário
   * @param {number} userId - ID do usuário (opcional)
   * @returns {Array} Lista de simulações
   */
  async list(userId = null) {
    let result;
    
    if (userId) {
      result = await query(
        'SELECT * FROM simulations WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
    } else {
      result = await query(
        'SELECT * FROM simulations ORDER BY created_at DESC'
      );
    }

    return result.rows;
  },

  /**
   * Atualizar uma simulação existente
   * @param {number} id - ID da simulação
   * @param {Object} simulationData - Dados atualizados
   * @param {Array} amortizations - Lista atualizada de amortizações
   * @returns {Object} A simulação atualizada
   */
  async update(id, simulationData, amortizations = []) {
    const client = await query('BEGIN');
    
    try {
      // Atualizar dados básicos da simulação
      await query(
        `UPDATE simulations 
         SET name = $1, principal = $2, term = $3, annual_interest = $4,
             annual_correction = $5, insurance = $6, system = $7, notes = $8
         WHERE id = $9`,
        [
          simulationData.name,
          simulationData.principal,
          simulationData.term,
          simulationData.annualInterest,
          simulationData.annualCorrection,
          simulationData.insurance,
          simulationData.system,
          simulationData.notes || '',
          id
        ]
      );

      // Remover amortizações antigas
      await query(
        'DELETE FROM extra_amortizations WHERE simulation_id = $1',
        [id]
      );

      // Inserir novas amortizações
      if (amortizations && amortizations.length > 0) {
        for (const amort of amortizations) {
          await query(
            `INSERT INTO extra_amortizations (simulation_id, month, value, type)
             VALUES ($1, $2, $3, $4)`,
            [id, amort.month, amort.value, amort.type]
          );
        }
      }

      await query('COMMIT');
      
      // Retornar a simulação atualizada
      return await this.getById(id);
    } catch (error) {
      await query('ROLLBACK');
      throw error;
    }
  },

  /**
   * Excluir uma simulação
   * @param {number} id - ID da simulação
   * @returns {boolean} Indica se a operação foi bem-sucedida
   */
  async delete(id) {
    try {
      // As amortizações serão excluídas automaticamente pela constraint ON DELETE CASCADE
      const result = await query(
        'DELETE FROM simulations WHERE id = $1 RETURNING id',
        [id]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = SimulationModel;