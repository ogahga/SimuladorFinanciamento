import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const SavedSimulations = ({ onLoadSimulation, onClose }) => {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Carregar simulações ao montar o componente
  useEffect(() => {
    loadSimulations();
  }, []);
  
  // Função para carregar simulações
  const loadSimulations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.listSimulations();
      
      if (response.success) {
        setSimulations(response.data);
      } else {
        setError(response.message || 'Erro ao carregar simulações');
      }
    } catch (error) {
      setError('Erro ao se comunicar com o servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Função para excluir uma simulação
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      try {
        const response = await ApiService.deleteSimulation(id);
        
        if (response.success) {
          // Atualizar a lista de simulações
          setSimulations(simulations.filter(sim => sim.id !== id));
        } else {
          alert(response.message || 'Erro ao excluir simulação');
        }
      } catch (error) {
        alert('Erro ao excluir simulação');
        console.error(error);
      }
    }
  };
  
  // Função para carregar uma simulação
  const handleLoad = async (id) => {
    try {
      setLoading(true);
      const response = await ApiService.getSimulation(id);
      
      if (response.success) {
        // Formatar dados para o formato esperado pelo simulador
        const simulation = response.data;
        
        const simulationData = {
          id: simulation.id,
          name: simulation.name,
          principal: simulation.principal,
          term: simulation.term,
          annualInterest: simulation.annual_interest,
          annualCorrection: simulation.annual_correction,
          insurance: simulation.insurance,
          system: simulation.system,
          notes: simulation.notes
        };
        
        // Passar para o componente pai
        onLoadSimulation(simulationData, simulation.amortizations);
        onClose(); // Fechar modal de simulações salvas
      } else {
        setError(response.message || 'Erro ao carregar simulação');
      }
    } catch (error) {
      setError('Erro ao se comunicar com o servidor');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar indicador de carregamento
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="loader"></div>
        <p className="ml-3">Carregando simulações...</p>
      </div>
    );
  }
  
  // Renderizar mensagem de erro
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
        <p className="font-medium">Erro ao carregar simulações</p>
        <p>{error}</p>
        <button 
          onClick={loadSimulations}
          className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
        >
          Tentar novamente
        </button>
      </div>
    );
  }
  
  // Renderizar lista vazia
  if (simulations.length === 0) {
    return (
      <div className="text-center p-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma simulação salva</h3>
        <p className="mt-1 text-gray-500">
          Salve suas simulações para acessá-las posteriormente.
        </p>
      </div>
    );
  }
  
  // Renderizar lista de simulações
  return (
    <div className="overflow-y-auto max-h-96">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prazo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Taxa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sistema
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {simulations.map((simulation) => (
            <tr key={simulation.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{simulation.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(simulation.created_at).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Intl.NumberFormat('pt-BR', { 
                    style: 'currency', 
                    currency: 'BRL' 
                  }).format(simulation.principal)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{simulation.term} meses</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {(simulation.annual_interest * 100).toFixed(2)}% a.a.
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  simulation.system === 'sac' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {simulation.system.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                <button
                  onClick={() => handleLoad(simulation.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Carregar
                </button>
                <button
                  onClick={() => handleDelete(simulation.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SavedSimulations;
