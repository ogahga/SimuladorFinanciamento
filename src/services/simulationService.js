// Services for API communication related to simulations

const API_URL = 'http://localhost:3001/api';

/**
 * Save a simulation to the database
 * @param {Object} simulationData - Data of the simulation to save
 * @returns {Promise<Object>} - The saved simulation object
 */
export const saveSimulation = async (simulationData) => {
  try {
    const response = await fetch(`${API_URL}/simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error saving simulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Load all simulations from the database
 * @returns {Promise<Array>} - List of saved simulations
 */
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error loading simulations');
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Delete a simulation from the database
 * @param {number} id - ID of the simulation to delete
 * @returns {Promise<void>}
 */
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error deleting simulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Load a specific simulation from the database
 * @param {number} id - ID of the simulation to load
 * @returns {Promise<Object>} - The simulation object
 */
export const loadSimulation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error loading simulation');
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};