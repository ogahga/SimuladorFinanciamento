/**
 * Serviço para interação com o backend de simulações
 * Responsável por salvar, carregar e excluir simulações no banco de dados
 */

// URL base da API
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Salva uma simulação no banco de dados
 * 
 * @param {Object} simulationData - Dados da simulação a ser salva
 * @returns {Promise<Object>} - A simulação salva
 */
export const saveSimulation = async (simulationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar simulação');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erro ao salvar simulação:', error);
    throw error;
  }
};

/**
 * Carrega todas as simulações do banco de dados
 * 
 * @returns {Promise<Array>} - Lista de simulações
 */
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar simulações');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Erro ao carregar simulações:', error);
    throw error;
  }
};

/**
 * Carrega uma simulação específica pelo ID
 * 
 * @param {number} id - ID da simulação a ser carregada
 * @returns {Promise<Object>} - A simulação carregada
 */
export const loadSimulationById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}`);
    
    if (!response.ok) {
      throw new Error('Erro ao carregar simulação');
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Erro ao carregar simulação ${id}:`, error);
    throw error;
  }
};

/**
 * Exclui uma simulação do banco de dados
 * 
 * @param {number} id - ID da simulação a ser excluída
 * @returns {Promise<Object>} - Resposta da exclusão
 */
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erro ao excluir simulação');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao excluir simulação ${id}:`, error);
    throw error;
  }
};

/**
 * Atualiza uma simulação existente
 * 
 * @param {number} id - ID da simulação a ser atualizada
 * @param {Object} simulationData - Novos dados da simulação
 * @returns {Promise<Object>} - A simulação atualizada
 */
export const updateSimulation = async (id, simulationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar simulação');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erro ao atualizar simulação ${id}:`, error);
    throw error;
  }
};