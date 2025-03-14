// Service to interact with the backend API for simulations

const API_URL = 'http://localhost:3001/api';

/**
 * Save a simulation to the database
 * @param {Object} simulationData - Data to save
 * @returns {Promise} - Promise with the saved simulation data
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
      throw new Error(`Error saving simulation: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

/**
 * Load all saved simulations from the database
 * @returns {Promise} - Promise with the array of simulation data
 */
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      throw new Error(`Error loading simulations: ${response.statusText}`);
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
 * @param {number} id - Simulation ID
 * @returns {Promise} - Promise with the simulation data
 */
export const loadSimulationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error loading simulation: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Error loading simulation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a simulation by ID
 * @param {number} id - Simulation ID
 * @returns {Promise} - Promise with the result of the deletion
 */
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting simulation: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting simulation with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Update an existing simulation
 * @param {number} id - Simulation ID
 * @param {Object} simulationData - Updated simulation data
 * @returns {Promise} - Promise with the updated simulation data
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
      throw new Error(`Error updating simulation: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating simulation with ID ${id}:`, error);
    throw error;
  }
};

// Helper function to format date for display
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
};

// Function to validate connection to the backend
export const checkConnection = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, { method: 'GET' });
    return response.ok;
  } catch (error) {
    console.error('Error checking connection:', error);
    return false;
  }
};