// Serviço para comunicação com a API do backend

const API_URL = 'http://localhost:3001/api';

// Fallback para caso a API não esteja disponível
const handleApiError = (error) => {
  console.error('Erro na comunicação com API:', error);
  return { success: false, message: 'Erro na comunicação com o servidor' };
};

/**
 * Classe para gerenciar as chamadas à API
 */
export default class ApiService {
  /**
   * Salvar uma simulação no banco de dados
   * @param {Object} simulationData - Dados básicos da simulação
   * @param {Array} amortizations - Lista de amortizações extras
   * @returns {Promise} Resposta da API
   */
  static async saveSimulation(simulationData, amortizations) {
    try {
      console.log('Enviando dados para API:', { simulationData, amortizations });
      
      const response = await fetch(`${API_URL}/simulations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ simulationData, amortizations }),
      });
      
      if (!response.ok) {
        console.error('Erro HTTP:', response.status, response.statusText);
        return { 
          success: false, 
          message: `Erro ao salvar simulação: ${response.status} ${response.statusText}` 
        };
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  }

  /**
   * Listar todas as simulações
   * @param {number} userId - ID do usuário (opcional)
   * @returns {Promise} Lista de simulações
   */
  static async listSimulations(userId = null) {
    try {
      const url = userId 
        ? `${API_URL}/simulations?userId=${userId}`
        : `${API_URL}/simulations`;
        
      const response = await fetch(url);
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao listar simulações:', error);
      throw error;
    }
  }

  /**
   * Buscar uma simulação pelo ID
   * @param {number} id - ID da simulação
   * @returns {Promise} Dados da simulação
   */
  static async getSimulation(id) {
    try {
      const response = await fetch(`${API_URL}/simulations/${id}`);
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar simulação:', error);
      throw error;
    }
  }

  /**
   * Atualizar uma simulação existente
   * @param {number} id - ID da simulação
   * @param {Object} simulationData - Dados atualizados
   * @param {Array} amortizations - Lista atualizada de amortizações
   * @returns {Promise} Resposta da API
   */
  static async updateSimulation(id, simulationData, amortizations) {
    try {
      const response = await fetch(`${API_URL}/simulations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ simulationData, amortizations }),
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar simulação:', error);
      throw error;
    }
  }

  /**
   * Excluir uma simulação
   * @param {number} id - ID da simulação
   * @returns {Promise} Resposta da API
   */
  static async deleteSimulation(id) {
    try {
      const response = await fetch(`${API_URL}/simulations/${id}`, {
        method: 'DELETE',
      });
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao excluir simulação:', error);
      throw error;
    }
  }

  /**
   * Verificar status da API
   * @returns {Promise} Status da API
   */
  static async checkStatus() {
    try {
      const response = await fetch(`${API_URL}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Para o status, vamos retornar 'offline' mesmo que a resposta não seja bem-sucedida
      if (!response.ok) {
        return { status: 'offline' };
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      return { status: 'offline', error: error.message };
    }
  }
}
