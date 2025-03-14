import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

// Renderiza um relatório de IA com recomendações personalizadas para o financiamento
const AIReport = ({ onClose }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simular tempo de carregamento
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Relatório de Análise Inteligente" size="lg">
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-16 h-16 mb-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-gray-600">Analisando seu financiamento...</p>
            <p className="text-sm text-gray-500 mt-2">
              Nossa IA está avaliando todas as opções de amortização e calculando as melhores estratégias para você.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Sumário Executivo</h3>
              <p className="text-blue-700">
                Baseado na análise do seu financiamento atual, você poderia economizar cerca de <span className="font-semibold">25-30%</span> em 
                juros e reduzir o prazo total em até <span className="font-semibold">40%</span> com uma estratégia otimizada de amortizações extras.
                Abaixo, detalhamos as estratégias mais eficientes para o seu caso.
              </p>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Estratégias Recomendadas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">Estratégia de Prazo Reduzido</h4>
                </div>
                <p className="text-gray-600 mb-3">
                  Aplicando amortizações extras anuais de aproximadamente <span className="font-medium">R$ 10.000,00</span>,
                  é possível reduzir o prazo total em cerca de <span className="font-medium">8 anos</span>, economizando
                  significativamente em juros.
                </p>
                <div className="mt-4 bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-700">
                    <span className="font-semibold">Benefício:</span> Economia total de até <span className="font-semibold">R$ 120.000,00</span> e quitação antecipada
                  </p>
                </div>
              </div>
              
              <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-800">Estratégia de Parcela Reduzida</h4>
                </div>
                <p className="text-gray-600 mb-3">
                  Aplicando uma amortização única de <span className="font-medium">R$ 30.000,00</span> no início do financiamento,
                  você pode reduzir o valor mensal das parcelas em até <span className="font-medium">20%</span>, aliviando o orçamento.
                </p>
                <div className="mt-4 bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">Benefício:</span> Alívio imediato no fluxo de caixa mensal e menor comprometimento de renda
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Análise de Sensibilidade de Taxa</h3>
              <p className="text-gray-600 mb-4">
                Sua taxa atual de <span className="font-medium">12,68% a.a.</span> está acima da média de mercado.
                Uma redução de <span className="font-medium">1-2 pontos percentuais</span> resultaria em uma economia adicional
                significativa. Considere solicitar uma renegociação da taxa após 12 meses de pagamentos pontuais.
              </p>
              <div className="overflow-hidden md:max-w-lg mx-auto">
                <div className="h-4 w-full bg-gray-200 rounded-full">
                  <div
                    className="h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full"
                    style={{ width: '72%' }}
                  >
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Taxa baixa</span>
                  <span>Sua taxa</span>
                  <span>Taxa alta</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-800 mb-2">Potencial de Economia</h4>
                <p className="text-3xl font-bold text-indigo-700 mb-2">R$ 140.000+</p>
                <p className="text-sm text-indigo-600">
                  Economia total estimada com a estratégia ideal de amortizações
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2">Redução de Tempo</h4>
                <p className="text-3xl font-bold text-amber-700 mb-2">-8 Anos</p>
                <p className="text-sm text-amber-600">
                  Redução potencial no prazo total do financiamento
                </p>
              </div>
              
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="font-medium text-emerald-800 mb-2">ROI da Amortização</h4>
                <p className="text-3xl font-bold text-emerald-700 mb-2">18.5%</p>
                <p className="text-sm text-emerald-600">
                  Retorno efetivo ao investir em amortizações extras
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recomendações Adicionais</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">
                    Priorize amortizações extras nos <span className="font-medium">primeiros 5 anos</span> do financiamento, quando a proporção de juros na parcela é maior.
                  </p>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">
                    Considere migrar para o <span className="font-medium">sistema SAC</span> se sua instituição financeira permitir, já que o custo total tende a ser menor no longo prazo.
                  </p>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">
                    Crie uma reserva específica para <span className="font-medium">amortizações anuais</span>, idealmente com rendimento superior à inflação.
                  </p>
                </li>
                <li className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-700">
                    Monitore a <span className="font-medium">taxa SELIC</span> e a inflação para identificar oportunidades de refinanciamento com taxas menores.
                  </p>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center mt-8">
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Fechar Relatório
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIReport;