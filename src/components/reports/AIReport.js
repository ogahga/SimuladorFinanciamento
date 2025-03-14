import React, { useState, useEffect } from 'react';

// Mock AI analysis function
const generateAIAnalysis = (simulationData) => {
  // In a real implementation, this would call an API endpoint for AI analysis
  // Here we simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: "Análise de Financiamento Imobiliário",
        recommendations: [
          "Baseado na taxa de juros atual, amortizar nos meses iniciais trará maior economia.",
          "Recomenda-se a redução de prazo ao invés de parcela para maximizar a economia.",
          "Com a taxa atual de juros, o sistema SAC é economicamente mais vantajoso no longo prazo."
        ],
        insights: [
          "Os juros totais representam cerca de 60% do valor financiado.",
          "Reduzir o prazo em 24 meses economizaria aproximadamente 15% em juros.",
          "Aumentar o valor das amortizações extras em 20% pode reduzir o custo total em 8%."
        ],
        costAnalysis: {
          interestRatio: 0.63,
          timeValueMoney: 0.84,
          efficiencyScore: 0.72
        },
        marketComparison: "Este financiamento apresenta condições cerca de 8% melhores que a média do mercado atual.",
        longTermOutlook: "Considerando a inflação projetada, este financiamento terá um custo efetivo decrescente ao longo do tempo."
      });
    }, 1500);
  });
};

const AIReport = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Load simulation data (in a real app, this would come from props or context)
    const simulationData = {
      // This would be actual data from your application
    };
    
    // Generate AI report
    generateAIAnalysis(simulationData)
      .then(analysis => {
        setReport(analysis);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error generating AI report:', err);
        setError('Não foi possível gerar a análise de IA. Por favor, tente novamente mais tarde.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative z-10">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Análise Inteligente do Financiamento
            </h3>
            <button
              className="text-white hover:text-gray-200 focus:outline-none"
              onClick={onClose}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-150px)] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Gerando análise inteligente do seu financiamento...</p>
                <p className="text-sm text-gray-500 mt-2">Este processo pode levar alguns segundos.</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Sumário Executivo</h4>
                  <p className="text-blue-700">{report.summary}</p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-md p-3 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase">Total de Juros / Principal</div>
                      <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-blue-600">
                          {Math.round(report.costAnalysis.interestRatio * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-md p-3 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase">Valor Presente / Futuro</div>
                      <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-indigo-600">
                          {Math.round(report.costAnalysis.timeValueMoney * 100)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-md p-3 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase">Eficiência Financeira</div>
                      <div className="flex items-end mt-1">
                        <span className="text-2xl font-bold text-purple-600">
                          {Math.round(report.costAnalysis.efficiencyScore * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Recomendações</h4>
                    <ul className="space-y-2">
                      {report.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Insights de Dados</h4>
                    <ul className="space-y-2">
                      {report.insights.map((insight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="text-gray-700">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Contexto de Mercado</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-4">{report.marketComparison}</p>
                    <p className="text-gray-700">{report.longTermOutlook}</p>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500 italic">
                    Observação: Esta análise foi gerada automaticamente com base nos parâmetros do financiamento e tendências do mercado. 
                    As recomendações são orientativas e não devem substituir a consultoria financeira profissional.
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReport;