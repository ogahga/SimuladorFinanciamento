// Simulation Service - Interface with backend API
// This service handles saving and loading simulations from the database

const API_URL = 'http://localhost:3001/api';

// Save simulation to database
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
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

// Load all simulations from database
export const loadSimulations = async () => {
  try {
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error loading simulations:', error);
    throw error;
  }
};

// Load a specific simulation by ID
export const loadSimulationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error loading simulation with ID ${id}:`, error);
    throw error;
  }
};

// Delete a simulation by ID
export const deleteSimulation = async (id) => {
  try {
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting simulation with ID ${id}:`, error);
    throw error;
  }
};

// Update a simulation by ID
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
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating simulation with ID ${id}:`, error);
    throw error;
  }
};
