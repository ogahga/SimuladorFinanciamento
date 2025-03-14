// Simulator service for database operations
const API_URL = 'http://localhost:3001/api';

/**
 * Save a simulation to the database
 * 
 * @param {Object} simulationData - The simulation data to save
 * @returns {Promise} - The response from the API
 */
export const saveSimulation = async (simulationData) => {
  try {
    const response = await fetch(`${API_URL}/simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(simulationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao salvar simulação');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

/**
 * Load simulations from the database
 * 
 * @returns {Promise} - The response from the API
 */
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao carregar simulações');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error loading simulations:', error);
    throw error;
  }
};

/**
 * Load a specific simulation by ID
 * 
 * @param {number} id - The simulation ID
 * @returns {Promise} - The response from the API
 */
export const loadSimulationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao carregar simulação');
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error loading simulation:', error);
    throw error;
  }
};

/**
 * Delete a simulation by ID
 * 
 * @param {number} id - The simulation ID
 * @returns {Promise} - The response from the API
 */
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao excluir simulação');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
};

/**
 * Update a simulation by ID
 * 
 * @param {number} id - The simulation ID
 * @param {Object} simulationData - The updated simulation data
 * @returns {Promise} - The response from the API
 */
export const updateSimulation = async (id, simulationData) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(simulationData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao atualizar simulação');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating simulation:', error);
    throw error;
  }
};