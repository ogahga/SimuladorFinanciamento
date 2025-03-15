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
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  // Set amortization months range when target term changes
  useEffect(() => {
    if (targetTerm && !isNaN(parseInt(targetTerm)) && parseInt(targetTerm) > 0) {
      setTargetAmortMonths(`1-${targetTerm}`);
    }
  }, [targetTerm]);

  // Validate inputs when they change
  useEffect(() => {
    let isValid = true;
    
    // Clear previous error
    setError('');
    
    // Validate target term
    const targetTermNum = parseInt(targetTerm);
    if (isNaN(targetTermNum) || targetTermNum <= 0) {
      setError('O prazo alvo deve ser um número positivo.');
      isValid = false;
    } else if (targetTermNum >= term) {
      setError('O prazo alvo deve ser menor que o prazo atual.');
      isValid = false;
    }
    
    // Validate amortization months
    if (!targetAmortMonths.trim()) {
      setError('Os meses de amortização são obrigatórios.');
      isValid = false;
    }
    
    try {
      // Check if the input is a valid range or list
      if (targetAmortMonths.includes('-')) {
        const [start, end] = targetAmortMonths.split('-').map(Number);
        if (isNaN(start) || isNaN(end) || start <= 0 || end <= 0 || start > end) {
          setError('O intervalo de meses deve ser válido (início-fim).');
          isValid = false;
        } else if (start > term) {
          setError('O mês inicial deve ser menor ou igual ao prazo atual.');
          isValid = false;
        }
      } else if (targetAmortMonths.includes(',')) {
        const months = targetAmortMonths.split(',').map(m => parseInt(m.trim()));
        if (months.some(isNaN) || months.some(m => m <= 0)) {
          setError('Todos os meses devem ser números positivos.');
          isValid = false;
        } else if (months.some(m => m > term)) {
          setError('Todos os meses devem ser menores ou iguais ao prazo atual.');
          isValid = false;
        }
      } else {
        const month = parseInt(targetAmortMonths);
        if (isNaN(month) || month <= 0) {
          setError('O mês deve ser um número positivo.');
          isValid = false;
        } else if (month > term) {
          setError('O mês deve ser menor ou igual ao prazo atual.');
          isValid = false;
        }
      }
    } catch (e) {
      setError('Formato de meses inválido.');
      isValid = false;
    }
    
    return () => {
      // Cleanup if needed
    };
  }, [targetTerm, targetAmortMonths, term]);

  return (
    <div className="p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="space-y-3">
            <div>
              <label htmlFor="currentTerm" className="block text-sm font-medium text-gray-700">
                Prazo Atual (meses)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="currentTerm"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={term}
                  disabled
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Este é o prazo total do seu financiamento.
              </p>
            </div>
            
            <div>
              <label htmlFor="targetTerm" className="block text-sm font-medium text-gray-700">
                Prazo Alvo (meses)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="targetTerm"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    error && error.includes('prazo alvo') ? 'border-red-300' : ''
                  }`}
                  value={targetTerm}
                  onChange={(e) => {
                    // Guarda o valor original do input
                    const inputEl = e.target;
                    const cursorPosition = inputEl.selectionStart;
                    const value = e.target.value;
                    
                    // Apenas permite dígitos
                    if (/^\d*$/.test(value)) {
                      // Atualiza o valor no estado
                      setTargetTerm(value);
                    }
                    
                    // Restaura o foco e a posição do cursor após a atualização do estado
                    setTimeout(() => {
                      inputEl.focus();
                      inputEl.setSelectionRange(cursorPosition, cursorPosition);
                    }, 0);
                  }}
                  onFocus={() => setFocusedField('targetTerm')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Qual prazo em meses você gostaria de atingir?
              </p>
            </div>
            
            <div>
              <label htmlFor="amortMonths" className="block text-sm font-medium text-gray-700">
                Meses para Amortização
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="amortMonths"
                  className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
                    error && (error.includes('meses') || error.includes('mês')) ? 'border-red-300' : ''
                  }`}
                  value={targetAmortMonths}
                  onChange={(e) => setTargetAmortMonths(e.target.value)}
                  onFocus={() => setFocusedField('amortMonths')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="ex: 1-12 ou 1,13,25"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Em quais meses você fará as amortizações extras? Use um intervalo (início-fim) ou lista (1,2,3).
              </p>
            </div>

            
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-4">
              <button
                type="button"
                className="w-full inline-flex justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
                onClick={runTargetTermSimulation}
                disabled={!!error}
              >
                Calcular Amortização Necessária
              </button>
            </div>
          </div>
        </div>
        
        <div>
          {targetResults ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-3 sm:px-5 bg-gradient-to-r from-green-50 to-emerald-50">
                <h3 className="text-base leading-6 font-medium text-green-800">Resultado da Simulação</h3>
                <p className="max-w-2xl text-xs text-green-600">
                  Redução de prazo de {term} para {targetResults.achievedTerm} meses 
                  ({((term - targetResults.achievedTerm) / 12).toFixed(1)} anos)
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-4 sm:p-5">
                <dl className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Valor de Amortização Calculado</dt>
                    <dd className="mt-1 text-lg font-semibold text-green-600">
                      {formatCurrency(targetResults.amortValue)}
                    </dd>
                    <dd className="text-xs text-gray-500">
                      {targetResults.amortMonths.length > 1 
                        ? `a ser aplicado em ${targetResults.amortMonths.length} meses` 
                        : 'a ser aplicado no mês especificado'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Amortização Adicional Total</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">
                      {formatCurrency(targetResults.amortValue * targetResults.amortMonths.length)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Prazo Solicitado</dt>
                    <dd className="mt-1 text-base font-semibold text-gray-700">
                      {targetTerm} meses ({(targetTerm / 12).toFixed(1)} anos)
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-gray-500">Prazo Atingido</dt>
                    <dd className="mt-1 text-base font-semibold text-green-700">
                      {targetResults.achievedTerm} meses ({(targetResults.achievedTerm / 12).toFixed(1)} anos)
                    </dd>
                  </div>
                  
                  {targetResults.savings && (
                    <>
                      <div className="sm:col-span-2">
                        <dt className="text-xs font-medium text-gray-500">Economia Total Estimada</dt>
                        <dd className="mt-1 text-lg font-semibold text-green-600">
                          {formatCurrency(targetResults.savings.total)}
                        </dd>
                        <dd className="mt-1 text-xs text-gray-600">
                          Juros: {formatCurrency(targetResults.savings.juros)} | 
                          Seguros: {formatCurrency(targetResults.savings.seguros)} | 
                          Correção: {formatCurrency(targetResults.savings.correcao)}
                        </dd>
                      </div>
                    </>
                  )}
                </dl>
                
                <div className="mt-4">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-green-500"
                    onClick={applyTargetAmortizationsToSimulator}
                  >
                    Aplicar no Simulador
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <h3 className="text-base font-medium text-gray-700 mb-2">Como funciona?</h3>
              <ol className="text-xs text-gray-500 list-decimal pl-5 space-y-1">
                <li>Defina um prazo alvo menor que o prazo atual</li>
                <li>Especifique em quais meses você fará amortizações extras</li>
                <li>Escolha se quer reduzir prazo ou parcela</li>
                <li>Clique em "Calcular" para descobrir o valor ideal para cada amortização</li>
              </ol>
              <p className="mt-3 text-xs text-gray-400">
                O simulador irá calcular qual o valor constante de amortização em cada mês especificado
                que permitirá atingir o prazo alvo desejado.
              </p>
            </div>
          )}
        </div>
      </div>
      

    </div>
  );
};

export default TargetTermSimulator;