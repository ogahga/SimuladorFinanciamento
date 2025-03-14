import React, { useState, useEffect } from 'react';

// Componente de relatório de IA que fornece insights sobre o financiamento
const AIReport = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  
  // Simular um carregamento inicial de dados
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-lg font-medium text-indigo-800" id="modal-headline">
            Relatório de Análise Inteligente
          </h3>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={onClose}
          >
            <span className="sr-only">Fechar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Analisando dados do financiamento...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">Assistente Virtual de Financiamento</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este relatório foi gerado automaticamente com base nos dados da sua simulação.
                    Utilize estas informações para tomar decisões mais informadas sobre seu financiamento.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-blue-800 mb-2">Resumo Executivo</h4>
                <p className="text-sm text-blue-700">
                  Você está simulando um financiamento no sistema <span className="font-medium">SAC (Sistema de Amortização Constante)</span>, 
                  que é caracterizado por parcelas decrescentes ao longo do tempo. 
                  Este sistema geralmente resulta em um custo total menor de juros comparado ao sistema PRICE, 
                  porém com parcelas iniciais mais altas.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-green-800 mb-2">Pontos Positivos</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-green-700">
                    <li>Menor custo total de juros no longo prazo</li>
                    <li>Rápida redução do saldo devedor</li>
                    <li>Parcelas que diminuem com o tempo, aliviando o orçamento futuro</li>
                    <li>Mais vantajoso para amortizações extras</li>
                    <li>Menor comprometimento da renda no longo prazo</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-amber-800 mb-2">Pontos de Atenção</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-amber-700">
                    <li>Parcelas iniciais mais altas que no sistema PRICE</li>
                    <li>Maior comprometimento da renda no início do financiamento</li>
                    <li>Pode dificultar a aprovação do crédito se a capacidade de pagamento for limitada</li>
                    <li>Exige disciplina financeira para lidar com as parcelas maiores no início</li>
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-medium text-gray-800 mb-3">Recomendações Personalizadas</h4>
                
                <div className="space-y-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-gray-900">Amortizações Estratégicas</h5>
                        <p className="mt-1 text-sm text-gray-500">
                          Considere fazer amortizações extras nos primeiros anos do financiamento para 
                          maximizar a economia de juros. Cada R$ 1.000 amortizado no início pode 
                          gerar uma economia significativa ao longo do prazo.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-gray-900">Planejamento Financeiro</h5>
                        <p className="mt-1 text-sm text-gray-500">
                          Reserve uma reserva financeira de pelo menos 6 meses de parcelas para emergências. 
                          Como suas parcelas são decrescentes, considere manter o pagamento no valor da 
                          primeira parcela e usar a diferença para amortizações extras.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h5 className="text-sm font-medium text-gray-900">Revisão Periódica</h5>
                        <p className="mt-1 text-sm text-gray-500">
                          Recomendamos revisar seu financiamento anualmente. Avalie se as taxas de mercado 
                          estão mais favoráveis para uma possível portabilidade, e considere aumentar 
                          o valor ou frequência das amortizações extras conforme sua situação financeira melhorar.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-800 mb-2">Próximos Passos Sugeridos</h4>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">
                  <li>Compare esta simulação com o sistema PRICE para avaliar qual se adequa melhor ao seu orçamento</li>
                  <li>Utilize o Simulador de Prazo Alvo para planejar amortizações estratégicas</li>
                  <li>Salve esta simulação para referência futura</li>
                  <li>Consulte um especialista financeiro para validar sua estratégia</li>
                </ol>
              </div>
              
              <div className="text-xs text-gray-500 mt-4">
                <p>
                  <strong>Nota:</strong> Este relatório é gerado automaticamente com base nos dados 
                  fornecidos e serve apenas como uma referência. As condições reais de financiamento 
                  podem variar conforme a instituição financeira e sua situação particular.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
            onClick={onClose}
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIReport;