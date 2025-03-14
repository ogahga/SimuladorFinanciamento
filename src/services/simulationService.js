// API service for simulation operations
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Format and save a simulation
export const saveSimulation = async (simulationData) => {
  try {
    // Extract amortizations to save separately 
    const { amortizations, ...mainData } = simulationData;
    
    // Clean the data for saving
    const sanitizedData = {
      name: mainData.name,
      principal: parseFloat(mainData.principal),
      term: parseInt(mainData.term),
      annualInterest: parseFloat(mainData.annualInterest),
      annualCorrection: parseFloat(mainData.annualCorrection),
      insurance: parseFloat(mainData.insurance),
      system: mainData.system
    };
    
    // Format amortizations
    const formattedAmortizations = amortizations.map(amort => ({
      month: amort.month.toString(),
      value: parseFloat(amort.value),
      type: amort.type
    }));
    
    // Make the API call
    const response = await fetch(`${API_URL}/simulations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        simulation: sanitizedData,
        amortizations: formattedAmortizations
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving simulation:', error);
    throw error;
  }
};

// Load all simulations
export const loadSimulations = async () => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/simulations`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error loading simulations:', error);
    throw error;
  }
};

// Load a specific simulation by ID
export const loadSimulationById = async (id) => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/simulations/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error loading simulation #${id}:`, error);
    throw error;
  }
};

// Delete a simulation by ID
export const deleteSimulation = async (id) => {
  try {
    // Make the API call
    const response = await fetch(`${API_URL}/simulations/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting simulation #${id}:`, error);
    throw error;
  }
};