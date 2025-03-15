import React, { useState, useEffect, useRef } from 'react';

// Para formatar valores monetários com máscara R$ 00,00
const formatCurrencyMask = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
};

// Função para extrair valores numéricos de campos com máscara
const parseCurrencyValue = (formattedValue) => {
  if (!formattedValue) return 0;
  
  // Remove todos os caracteres não numéricos exceto vírgula
  const cleanValue = formattedValue.replace(/[^0-9,]/g, '');
  
  // Substitui vírgula por ponto para conversão em número
  const numericValue = parseFloat(cleanValue.replace(',', '.'));
  
  return isNaN(numericValue) ? 0 : numericValue;
};

const AmortizationForm = ({ 
  onAddAmortization, 
  onClearFields, 
  amortizationError, 
  setAmortizationError,
  editingIndex,
  term,
  formatCurrency
}) => {
  // Estado para input
  const [newAmortMonth, setNewAmortMonth] = useState("");
  const [newAmortValue, setNewAmortValue] = useState("");
  const [newAmortType, setNewAmortType] = useState("prazo");
  const [focused, setFocused] = useState(false);
  const [formattedValue, setFormattedValue] = useState("");
  
  // Referência para o input de valor
  const valueInputRef = useRef(null);
  
  // Efeito para animar o card quando estiver em modo de edição
  useEffect(() => {
    if (editingIndex !== -1) {
      // Focar no campo de valor automaticamente quando entrar no modo de edição
      if (valueInputRef.current) {
        valueInputRef.current.focus();
      }
    }
  }, [editingIndex]);
  
  // Função para formatar moeda
  const handleCurrencyFormat = (value) => {
    if (!value) return 'R$ 0,00';
    
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return 'R$ 0,00';
    
    return formatCurrencyMask(numericValue);
  };
  
  const handleRangeHelp = () => {
    // Explicar para o usuário sobre os formatos de intervalo permitidos
    alert(`Formatos de mês/intervalo permitidos:
    
1) Um mês específico: "12"
2) Um intervalo de meses: "1-12"
3) Múltiplos meses separados por vírgula: "1,5,10"
4) Múltiplos intervalos: "1-5,10-15"

Obs: Não é permitido ter o mesmo mês em mais de um intervalo.`);
  };
  
  const handleValueFocus = () => {
    setFocused(true);
  };
  
  const handleValueBlur = () => {
    setFocused(false);
  };
  
  const handleValueChange = (e) => {
    const value = e.target.value;
    
    if (focused) {
      // No modo de edição, aceitar apenas dígitos e vírgula
      const validInput = value.replace(/[^\d,]/g, '');
      setNewAmortValue(parseCurrencyValue(validInput));
    } else {
      setNewAmortValue(parseCurrencyValue(value));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (newAmortMonth && newAmortValue) {
      onAddAmortization({
        month: newAmortMonth,
        value: parseFloat(newAmortValue),
        type: newAmortType
      });
      
      // Limpar os campos após adicionar
      if (editingIndex === -1) {
        setNewAmortValue("");
        setNewAmortMonth("");
      }
    } else {
      setAmortizationError("Preencha todos os campos para adicionar uma amortização.");
    }
  };
  
  // Sugestões de intervalos comuns
  const commonRanges = [
    { label: "Mensal", value: `1-${Math.min(term, 12)}` },
    { label: "Trimestral", value: `1-${Math.min(term, 360)}:3` },
    { label: "Semestral", value: `1-${Math.min(term, 360)}:6` },
    { label: "Anual", value: `1-${Math.min(term, 360)}:12` }
  ];
  
  // Função para aplicar uma sugestão de intervalo
  const applyRangeSuggestion = (suggestion) => {
    if (suggestion.includes(':')) {
      // Formato com frequência (ex: 1-360:12 significa a cada 12 meses de 1 a 360)
      const [range, frequency] = suggestion.split(':');
      const [start, end] = range.split('-').map(Number);
      
      const months = [];
      for (let i = start; i <= end; i += parseInt(frequency)) {
        months.push(i);
      }
      
      setNewAmortMonth(months.join(','));
    } else {
      // Formato simples (ex: 1-12)
      setNewAmortMonth(suggestion);
    }
    
    // Focar no campo de valor após selecionar um intervalo
    if (valueInputRef.current) {
      valueInputRef.current.focus();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={`${editingIndex !== -1 ? 'highlight-pulse' : ''}`}>
      {amortizationError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 112 0v4a1 1 0 11-2 0V9zm1-5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{amortizationError}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button 
                  type="button"
                  onClick={() => setAmortizationError("")}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div>
      <label htmlFor="amortType" className="input-label">
      Tipo de Amortização
      </label>
      <select
      id="amortType"
      value={newAmortType}
      onChange={(e) => setNewAmortType(e.target.value)}
      className="input w-full"
      >
      <option value="prazo">Redução de Prazo</option>
      <option value="parcela">Redução de Parcela</option>
      </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div className="input-group">
      <div className="flex items-center justify-between">
      <label htmlFor="amortMonth" className="input-label">
        Mês/Intervalo
      </label>
        <button
          type="button"
          onClick={handleRangeHelp}
        className="text-xs text-indigo-600 hover:text-indigo-800"
      >
      Ajuda
      </button>
      </div>
      <input
      id="amortMonth"
      type="text"
      value={newAmortMonth}
      onChange={(e) => setNewAmortMonth(e.target.value)}
        className="input"
          placeholder="ex: 12 ou 1-12"
        />
        
      <div className="flex flex-wrap gap-2 mt-2">
      {commonRanges.map((range, index) => (
          <button
            key={index}
          type="button"
          onClick={() => applyRangeSuggestion(range.value)}
        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {range.label}
      </button>
      ))}
      </div>
      </div>
      
      <div className="input-group">
      <label htmlFor="amortValue" className="input-label">
        Valor (R$)
        </label>
          <div className="input-icon">
            <span className="input-icon-left">R$</span>
            <input
            id="amortValue"
          ref={valueInputRef}
            type="text"
            value={focused ? newAmortValue : handleCurrencyFormat(newAmortValue)}
          onChange={handleValueChange}
          onFocus={handleValueFocus}
          onBlur={handleValueBlur}
          className="input"
            placeholder="0,00"
        />
      </div>
      </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        {editingIndex !== -1 && (
          <button
            type="button"
            onClick={onClearFields}
            className="mr-3 btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelar
          </button>
        )}
        
        <button
          type="submit"
          className="btn btn-primary"
        >
          {editingIndex !== -1 ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Atualizar Amortização
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Incluir Amortização
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AmortizationForm;