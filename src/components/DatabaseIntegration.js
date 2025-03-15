import React, { useState } from 'react';
import Modal from './Modal';
import SaveSimulationForm from './SaveSimulationForm';
import ApiService from '../services/api';

const DatabaseIntegration = ({ 
  simulationData,
  amortizations,
  className = ''
}) => {
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  
  // Verificar status da API ao montar o componente
  React.useEffect(() => {
    checkApiStatus();
    // Verificar status a cada 10 segundos
    const intervalId = setInterval(checkApiStatus, 10000);
    return () => clearInterval(intervalId);
  }, []);
  
  // Função para verificar status da API
  const checkApiStatus = async () => {
    try {
      const status = await ApiService.checkStatus();
      console.log('Status da API:', status);
      setApiStatus(status.status === 'online');
    } catch (error) {
      console.error('Erro ao verificar status da API:', error);
      setApiStatus(false);
    }
  };
  
  // Função para lidar com sucesso ao salvar
  const handleSaveSuccess = (savedSimulation) => {
    setSaveModalOpen(false);
    alert(`Simulação "${savedSimulation.name}" salva com sucesso!`);
  };
  
  return (
    <div className={className}>
      <div className="flex items-center">
        <button
          onClick={() => setSaveModalOpen(true)}
          disabled={!apiStatus}
          className="btn btn-primary flex items-center"
          title={apiStatus ? 'Salvar simulação' : 'Servidor indisponível'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
          </svg>
          Salvar Simulação
        </button>
        <span 
          className={`ml-2 inline-block w-3 h-3 rounded-full ${apiStatus ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}
          title={apiStatus ? 'Servidor online' : 'Servidor offline'}
        ></span>
      </div>
      
      {/* Removido indicador redundante */}
      
      {/* Modal para salvar simulação */}
      <Modal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        title="Salvar Simulação"
      >
        <SaveSimulationForm
          simulationData={simulationData}
          amortizations={amortizations}
          onSuccess={handleSaveSuccess}
          onClose={() => setSaveModalOpen(false)}
        />
      </Modal>
      

    </div>
  );
};

export default DatabaseIntegration;
