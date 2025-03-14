// API URL for simulation endpoints
const API_URL = 'http://localhost:3001/api';

/**
 * Save a simulation to the database
 * @param {Object} simulation - The simulation data to save
 * @returns {Promise<Object>} - The saved simulation data with ID
 */
export const saveSimulation = async (simulation) => {
  try {
    // Separate amortizations from simulation data
    const { amortizations, ...simulationData } = simulation;
    
    // First, save simulation data
    const response = await fetch(`${API_URL}/simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulationData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save simulation');
    }
    
    const savedSimulation = await response.json();
    
    // If there are amortizations, save them as well
    if (amortizations && amortizations.length > 0) {
      // Map amortizations to include simulation_id
      const amortizationsWithId = amortizations.map(amort => ({
        ...amort,
        simulation_id: savedSimulation.id
      }));
      
      // Save amortizations
      const amortResponse = await fetch(`${API_URL}/amortizations/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(amortizationsWithId),
      });
      
      if (!amortResponse.ok) {
        const error = await amortResponse.json();
        console.warn('Failed to save amortizations:', error);
        // We don't throw here, as the simulation was saved successfully
      }
      
      // Add amortizations to the returned simulation object
      savedSimulation.amortizations = amortizationsWithId;
    }
    
    return savedSimulation;
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

/**
 * Load all saved simulations from the database
 * @returns {Promise<Array>} - Array of simulation objects
 */
export const loadSimulations = async () => {
  try {
    // Fetch all simulations
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to load simulations');
    }
    
    const simulations = await response.json();
    
    // For each simulation, fetch its amortizations
    const simulationsWithAmortizations = await Promise.all(
      simulations.map(async (sim) => {
        try {
          const amortResponse = await fetch(`${API_URL}/amortizations/simulation/${sim.id}`);
          
          if (!amortResponse.ok) {
            console.warn(`Failed to load amortizations for simulation ${sim.id}`);
            return { ...sim, amortizations: [] };
          }
          
          const amortizations = await amortResponse.json();
          return { ...sim, amortizations };
        } catch (error) {
          console.warn(`Error loading amortizations for simulation ${sim.id}:`, error);
          return { ...sim, amortizations: [] };
        }
      })
    );
    
    return simulationsWithAmortizations;
  } catch (error) {
    console.error('Error loading simulations:', error);
    throw error;
  }
};

/**
 * Delete a simulation from the database
 * @param {string|number} id - The ID of the simulation to delete
 * @returns {Promise<Object>} - Success message
 */
export const deleteSimulation = async (id) => {
  try {
    // Delete simulation (cascade should delete amortizations as well)
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete simulation');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting simulation:', error);
    throw error;
  }
};

/**
 * Get a single simulation by ID
 * @param {string|number} id - The ID of the simulation to retrieve
 * @returns {Promise<Object>} - The simulation object with amortizations
 */
export const getSimulation = async (id) => {
  try {
    // Fetch simulation by ID
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get simulation');
    }
    
    const simulation = await response.json();
    
    // Fetch amortizations for this simulation
    const amortResponse = await fetch(`${API_URL}/amortizations/simulation/${id}`);
    
    if (!amortResponse.ok) {
      console.warn(`Failed to load amortizations for simulation ${id}`);
      return { ...simulation, amortizations: [] };
    }
    
    const amortizations = await amortResponse.json();
    return { ...simulation, amortizations };
  } catch (error) {
    console.error('Error getting simulation:', error);
    throw error;
  }
};