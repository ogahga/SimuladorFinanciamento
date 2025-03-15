import React, { useState } from 'react';
import ApiService from '../services/api';

const SaveSimulationForm = ({ simulationData, amortizations, onSuccess, onClose }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // Função para salvar a simulação
  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('O nome da simulação é obrigatório');
      return;
    }
    
    try {
      setSaving(true);
      
      // Preparar dados para envio
      const dataToSave = {
        ...simulationData,
        name,
        notes
      };
      
      // Criar um objeto formatado para o backend
      const formattedAmortizations = amortizations.map(amort => ({
        month: amort.month,
        value: amort.value,
        type: amort.type
      }));
      
      const response = await ApiService.saveSimulation(dataToSave, formattedAmortizations);
      
      if (response.success) {
        onSuccess(response.data);
        onClose();
      } else {
        setError(response.message || 'Erro ao salvar simulação');
      }
    } catch (error) {
      setError('Erro ao se comunicar com o servidor');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <form onSubmit={handleSave} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="simulation-name" className="block text-sm font-medium text-gray-700">
          Nome da Simulação *
        </label>
        <input
          type="text"
          id="simulation-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Ex: Apartamento Centro"
          required
        />
      </div>
      
      <div>
        <label htmlFor="simulation-notes" className="block text-sm font-medium text-gray-700">
          Observações
        </label>
        <textarea
          id="simulation-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Informações adicionais sobre esta simulação"
        />
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-gray-900">Detalhes da Simulação</h3>
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div>
            <span className="text-gray-500">Valor: </span>
            <span className="font-medium">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL' 
              }).format(simulationData.principal)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Prazo: </span>
            <span className="font-medium">{simulationData.term} meses</span>
          </div>
          <div>
            <span className="text-gray-500">Taxa: </span>
            <span className="font-medium">{(simulationData.annualInterest * 100).toFixed(2)}% a.a.</span>
          </div>
          <div>
            <span className="text-gray-500">Sistema: </span>
            <span className="font-medium">{simulationData.system.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-500">Amortizações: </span>
            <span className="font-medium">{amortizations.length}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Simulação'}
        </button>
      </div>
    </form>
  );
};

export default SaveSimulationForm;
