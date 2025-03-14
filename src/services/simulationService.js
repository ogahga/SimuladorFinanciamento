// API base URL
const API_URL = 'http://localhost:3001/api';

/**
 * Save a simulation to the database
 * @param {Object} simulationData - The simulation data to save
 * @returns {Promise<Object>} - The saved simulation data
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

/**
 * Load all simulations from the database
 * @returns {Promise<Array>} - Array of simulation objects
 */
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
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
 * @param {number} id - The simulation ID
 * @returns {Promise<Object>} - The simulation data
 */
export const loadSimulationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error loading simulation #${id}:`, error);
    throw error;
  }
};

/**
 * Delete a simulation by ID
 * @param {number} id - The simulation ID to delete
 * @returns {Promise<Object>} - The response data
 */
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting simulation #${id}:`, error);
    throw error;
  }
};

/**
 * Update a simulation by ID
 * @param {number} id - The simulation ID to update
 * @param {Object} simulationData - The updated simulation data
 * @returns {Promise<Object>} - The updated simulation data
 */
export const updateSimulation = async (id, simulationData) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating simulation #${id}:`, error);
    throw error;
  }
};