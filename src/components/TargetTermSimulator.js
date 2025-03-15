import React, { useState, useEffect } from 'react';

const TargetTermSimulator = ({
  term,
  targetTerm,
  setTargetTerm,
  targetAmortMonths,
  setTargetAmortMonths,
  targetAmortType,
  setTargetAmortType,
  targetResults,
  runTargetTermSimulation,
  applyTargetAmortizationsToSimulator,
  formatCurrency
}) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Garantir que o targetAmortType seja sempre 'prazo'
  useEffect(() => {
    if (targetAmortType !== 'prazo') {
      setTargetAmortType('prazo');
    }
  }, [targetAmortType, setTargetAmortType]);

  const handleCalculate = () => {
    setIsCalculating(true);
    // Simular um pequeno atraso para mostrar a animação de carregamento
    setTimeout(() => {
      runTargetTermSimulation();
      setIsCalculating(false);
    }, 800);
  };

  const handleApplyResults = () => {
    setShowConfirm(true);
  };

  const confirmApply = () => {
    applyTargetAmortizationsToSimulator();
    setShowConfirm(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-800">Configurar Prazo Alvo</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="input-group">
              <label htmlFor="targetTerm" className="input-label">
                Prazo Alvo (meses)
              </label>
              <div className="input-icon">
                <input
                  id="targetTerm"
                  type="number"
                  value={targetTerm}
                  onChange={(e) => {
                    // Aceitar apenas dígitos
                    const value = e.target.value.replace(/\D/g, '');
                    setTargetTerm(value);
                    
                    // Atualizar automaticamente o range de meses para amortização
                    if (value) {
                      const termValue = parseInt(value);
                      // Verifica se o valor atual de meses para amortização contém um range
                      if (targetAmortMonths.includes('-')) {
                        const parts = targetAmortMonths.split('-');
                        const start = parseInt(parts[0]) || 1;
                        // Atualiza o segundo valor para não ultrapassar o novo prazo alvo
                        setTargetAmortMonths(`${start}-${termValue}`);
                      } else {
                        // Se não for um range, criar um range de 1 até o valor do prazo alvo
                        setTargetAmortMonths(`1-${termValue}`);
                      }
                    }
                  }}
                  className="input"
                  placeholder="Digite o prazo alvo"
                  min="1"
                />
                <span className="input-icon-right">meses</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Defina um prazo menor que o atual ({term} meses)
              </p>
            </div>
            
            <div className="input-group">
              <div className="flex items-center justify-between">
                <label htmlFor="amortMonths" className="input-label">
                  Meses para Amortização
                </label>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                  onClick={() => {
                    alert(`Formatos aceitos:
                    
1) Um intervalo simples: "1-60"
2) Meses específicos: "1,12,24,36"
3) Múltiplos intervalos: "1-12,24-36"

Os meses indicados são onde serão aplicadas as amortizações extras.`);
                  }}
                >
                  Ajuda?
                </button>
              </div>
              <div className="input-icon">
                <input
                  id="amortMonths"
                  type="text"
                  value={targetAmortMonths}
                  onChange={(e) => {
                    let value = e.target.value;
                    
                    // Verificar se o valor contém um range e ajustar se necessário
                    if (value.includes('-')) {
                      const parts = value.split('-');
                      // Se houver mais de um hífen, pegar apenas o primeiro range
                      const start = parseInt(parts[0]) || 1;
                      let end = parseInt(parts[1]) || parseInt(targetTerm) || term;
                      
                      // Garantir que o fim não ultrapasse o prazo alvo
                      const maxTerm = parseInt(targetTerm) || term;
                      if (end > maxTerm) {
                        end = maxTerm;
                      }
                      
                      value = `${start}-${end}`;
                    } else if (value.match(/^\d+$/)) {
                      // Se for apenas um número, verificar se não ultrapassa o prazo alvo
                      const month = parseInt(value);
                      const maxTerm = parseInt(targetTerm) || term;
                      if (month > maxTerm) {
                        value = maxTerm.toString();
                      }
                    }
                    
                    setTargetAmortMonths(value);
                  }}
                  className="input"
                  placeholder="ex: 1-60,120-180"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Define quais meses receberão amortizações extras
              </p>
            </div>
          </div>
          
          {/* Tipo de amortização fixo como "Redução de Prazo" */}
          <div className="mt-4 p-3 rounded-md bg-indigo-50 border border-indigo-100">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-indigo-700">Tipo de Amortização: <span className="font-semibold">Redução de Prazo</span></span>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className={`btn btn-primary w-full ${isCalculating ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isCalculating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Calculando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Calcular Amortização Necessária
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {targetResults && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
          <div className="card hover-shadow">
            <div className="card-header bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="text-lg font-semibold text-indigo-700">Resultado do Cálculo</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prazo Alvo:</span>
                  <span className="font-medium text-gray-900">{targetResults.targetTerm} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Prazo Atingido:</span>
                  <span className="font-medium text-gray-900">{targetResults.achievedTerm} meses</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor da Amortização:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(targetResults.amortValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Meses de Aplicação:</span>
                  <span className="font-medium text-gray-900">{targetResults.amortMonths.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo de Amortização:</span>
                  <span className="font-medium text-gray-900">
                    {targetResults.amortType === "prazo" ? "Redução de Prazo" : "Redução de Parcela"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de Amortizações:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(targetResults.totalExtraAmort)}</span>
                </div>
                <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                  <span className="font-semibold text-gray-800">Total Pago:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(targetResults.totalPaid)}</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  {showConfirm ? (
                    <div className="space-y-3">
                      <p className="text-sm text-red-600 font-medium">
                        Esta ação substituirá todas as amortizações existentes. Deseja continuar?
                      </p>
                      <div className="flex space-x-3">
                        <button
                          onClick={confirmApply}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          Sim, aplicar
                        </button>
                        <button
                          onClick={() => setShowConfirm(false)}
                          className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleApplyResults}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition-transform hover:-translate-y-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Aplicar ao Simulador
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {targetResults.savings && (
            <div className="card hover-shadow">
              <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="text-lg font-semibold text-green-700">Economia Gerada</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Economia em Juros:</span>
                    <span className="font-medium text-green-600">{formatCurrency(targetResults.savings.juros)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Economia em Correção:</span>
                    <span className="font-medium text-green-600">{formatCurrency(targetResults.savings.correcao)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Economia em Seguros:</span>
                    <span className="font-medium text-green-600">{formatCurrency(targetResults.savings.seguros)}</span>
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t border-gray-200">
                    <span className="font-semibold text-gray-800">Economia Total:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(targetResults.savings.total)}</span>
                  </div>
                  <div className="flex justify-between mt-4">
                    <span className="font-semibold text-gray-800">Tempo Economizado:</span>
                    <div className="text-right">
                      <span className="font-semibold text-green-600">{targetResults.savings.tempoMeses} meses</span>
                      <span className="block text-sm text-green-500">({targetResults.savings.tempoAnos} anos)</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                      <div className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm text-green-700">
                            Considerando um valor de {formatCurrency(targetResults.amortValue)} aplicado em {targetResults.achievedTerm} meses.
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            O investimento total em amortizações extras será de {formatCurrency(targetResults.totalExtraAmort)}.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TargetTermSimulator;