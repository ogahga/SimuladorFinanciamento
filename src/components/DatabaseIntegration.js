import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { saveSimulation, loadSimulations, deleteSimulation } from '../services/simulationService';

const DatabaseIntegration = ({ simulationData, amortizations, onLoad }) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [loadModalOpen, setLoadModalOpen] = useState(false);
  const [simulationName, setSimulationName] = useState('');
  const [savedSimulations, setSavedSimulations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch saved simulations when load modal opens
  useEffect(() => {
    if (loadModalOpen) {
      fetchSimulations();
    }
  }, [loadModalOpen]);
  
  // Function to fetch saved simulations
  const fetchSimulations = async () => {
    setLoading(true);
    try {
      const data = await loadSimulations();
      setSavedSimulations(data);
    } catch (error) {
      console.error('Error fetching simulations:', error);
      setMessage({ text: 'Erro ao carregar simulações.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle save simulation
  const handleSaveSimulation = async () => {
    if (!simulationName.trim()) {
      setMessage({ text: 'Por favor, insira um nome para a simulação.', type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      // Format data for saving
      const dataToSave = {
        name: simulationName,
        ...simulationData,
        amortizations
      };
      
      await saveSimulation(dataToSave);
      setMessage({ text: 'Simulação salva com sucesso!', type: 'success' });
      setSimulationName('');
      
      // Close modal after a short delay
      setTimeout(() => {
        setSaveModalOpen(false);
        setMessage({ text: '', type: '' });
      }, 1500);
    } catch (error) {
      console.error('Error saving simulation:', error);
      setMessage({ text: 'Erro ao salvar simulação.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Handle load simulation
  const handleLoadSimulation = (simulation) => {
    // Call the onLoad callback from parent component
    if (onLoad) {
      onLoad(simulation, simulation.amortizations || []);
    }
    
    // Close modal
    setLoadModalOpen(false);
    setMessage({ text: '', type: '' });
  };
  
  // Handle delete simulation
  const handleDeleteSimulation = async (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent click
    
    if (!window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      return;
    }
    
    setLoading(true);
    try {
      await deleteSimulation(id);
      // Refresh the list
      fetchSimulations();
      setMessage({ text: 'Simulação excluída com sucesso!', type: 'success' });
    } catch (error) {
      console.error('Error deleting simulation:', error);
      setMessage({ text: 'Erro ao excluir simulação.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  
  // Filter simulations based on search term
  const filteredSimulations = savedSimulations.filter(sim => 
    sim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <>
      <div className="flex space-x-2">
        <button 
          onClick={() => setSaveModalOpen(true)}
          className="btn btn-secondary btn-sm"
          title="Salvar Simulação"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Salvar
        </button>
        <button 
          onClick={() => setLoadModalOpen(true)}
          className="btn btn-secondary btn-sm"
          title="Carregar Simulação"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(180, 10, 10)" />
          </svg>
          Carregar
        </button>
      </div>
      
      {/* Save Modal */}
      <Modal isOpen={saveModalOpen} onClose={() => {
        setSaveModalOpen(false);
        setMessage({ text: '', type: '' });
      }} title="Salvar Simulação">
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Salve esta simulação para acessá-la posteriormente.
          </p>
          
          <div className="mb-4">
            <label htmlFor="simulationName" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Simulação
            </label>
            <input
              type="text"
              id="simulationName"
              className="form-input w-full rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Financiamento Casa 300mil"
              value={simulationName}
              onChange={(e) => setSimulationName(e.target.value)}
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Detalhes da Simulação</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Valor:</span>
                <span className="ml-2">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(simulationData.principal)}</span>
              </div>
              <div>
                <span className="text-gray-500">Prazo:</span>
                <span className="ml-2">{simulationData.term} meses</span>
              </div>
              <div>
                <span className="text-gray-500">Taxa:</span>
                <span className="ml-2">{(simulationData.annualInterest * 100).toFixed(2)}% a.a.</span>
              </div>
              <div>
                <span className="text-gray-500">Sistema:</span>
                <span className="ml-2">{simulationData.system.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-gray-500">Amortizações:</span>
                <span className="ml-2">{amortizations.length}</span>
              </div>
            </div>
          </div>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              {message.text}
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              type="button"
              className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              onClick={() => {
                setSaveModalOpen(false);
                setMessage({ text: '', type: '' });
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
              onClick={handleSaveSimulation}
              disabled={loading || !simulationName.trim()}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </span>
              ) : 'Salvar Simulação'}
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Load Modal */}
      <Modal isOpen={loadModalOpen} onClose={() => {
        setLoadModalOpen(false);
        setMessage({ text: '', type: '' });
        setSearchTerm('');
      }} title="Carregar Simulação">
        <div className="p-6">
          <div className="mb-4">
            <div className="flex mb-4">
              <input
                type="text"
                className="form-input rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 flex-grow"
                placeholder="Buscar simulações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600"
                onClick={() => fetchSimulations()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <>
                {filteredSimulations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma simulação encontrada.
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {filteredSimulations.map((sim) => (
                        <li 
                          key={sim.id} 
                          className="p-4 hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
                          onClick={() => handleLoadSimulation(sim)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{sim.name}</h4>
                              <p className="mt-1 text-xs text-gray-500">
                                Criado em: {new Date(sim.created_at).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                            <button
                              className="text-red-500 hover:text-red-700 p-1"
                              onClick={(e) => handleDeleteSimulation(sim.id, e)}
                              title="Excluir Simulação"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                            <div>
                              <span className="text-gray-500">Valor:</span>
                              <span className="ml-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sim.principal)}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Prazo:</span>
                              <span className="ml-1">{sim.term} meses</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Taxa:</span>
                              <span className="ml-1">{(sim.annualInterest * 100).toFixed(2)}% a.a.</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Sistema:</span>
                              <span className="ml-1">{sim.system.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Amortizações:</span>
                              <span className="ml-1">{sim.amortizations?.length || 0}</span>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
            
            {message.text && (
              <div className={`mt-4 p-3 rounded-md ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DatabaseIntegration;