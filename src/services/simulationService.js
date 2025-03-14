// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Save a simulation to the database
 * @param {Object} simulationData - The simulation data to save
 * @returns {Promise<Object>} - The saved simulation data with ID
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to save simulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

/**
 * Load all simulations from the database
 * @returns {Promise<Array>} - Array of saved simulations
 */
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to load simulations');
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
    const response = await fetch(`${API_BASE_URL}/simulations/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to load simulation');
    }
    
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error('Error loading simulation:', error);
    throw error;
  }
};

/**
 * Delete a simulation from the database
 * @param {number} id - The simulation ID to delete
 * @returns {Promise<Object>} - Success message
 */
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete simulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
};

/**
 * Update an existing simulation
 * @param {number} id - The simulation ID
 * @param {Object} simulationData - The updated simulation data
 * @returns {Promise<Object>} - The updated simulation
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update simulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating simulation:', error);
    throw error;
  }
};

/**
 * Add an amortization to a simulation
 * @param {number} simulationId - The simulation ID
 * @param {Object} amortizationData - The amortization data
 * @returns {Promise<Object>} - The new amortization
 */
export const addAmortization = async (simulationId, amortizationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/simulations/${simulationId}/amortizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(amortizationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add amortization');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error adding amortization:', error);
    throw error;
  }
};

/**
 * Delete an amortization
 * @param {number} amortizationId - The amortization ID
 * @returns {Promise<Object>} - Success message
 */
export const deleteAmortization = async (amortizationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/amortizations/${amortizationId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete amortization');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting amortization:', error);
    throw error;
  }
};