import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

const AIReport = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState({
    overview: '',
    savings: '',
    recommendations: '',
    timing: ''
  });
  
  useEffect(() => {
    // Simulando tempo de carregamento para análise da IA
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Aqui, em um cenário real, faríamos uma chamada para uma API
      // que utilizaria IA para analisar os dados do financiamento
      // e gerar recomendações personalizadas
      setReports({
        overview: generateOverview(),
        savings: generateSavings(),
        recommendations: generateRecommendations(),
        timing: generateTiming()
      });
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Gerar visão geral simulada do financiamento
  const generateOverview = () => {
    return (
      `Baseado nos dados atuais do seu financiamento, observamos que você está utilizando 
      o sistema de amortização ${Math.random() > 0.5 ? 'SAC' : 'PRICE'} com uma taxa de juros 
      que está ${Math.random() > 0.5 ? 'acima' : 'abaixo'} da média de mercado atual.
      
      O prazo total de ${Math.floor(Math.random() * 300) + 100} meses está 
      dentro do esperado para financiamentos imobiliários, mas com algumas estratégias
      de amortização antecipada, você pode reduzir significativamente este prazo e 
      economizar em juros.`
    );
  };
  
  // Gerar análise simulada de economia
  const generateSavings = () => {
    const economyAmount = (Math.random() * 200000 + 50000).toFixed(2);
    const percentage = (Math.random() * 30 + 10).toFixed(1);
    
    return (
      `Com base nas suas configurações de amortização atual, estimamos uma economia 
      total de R$ ${economyAmount}, representando aproximadamente ${percentage}% do 
      valor total que seria pago em juros.
      
      Identificamos oportunidades para aumentar essa economia em até 15% com ajustes 
      no cronograma de amortizações extras.`
    );
  };
  
  // Gerar recomendações simuladas
  const generateRecommendations = () => {
    const options = [
      `Considere amortizações trimestrais nos primeiros 5 anos do financiamento, 
      quando a proporção de juros é maior na composição das parcelas.`,
      
      `Verificamos que amortizações com redução de prazo seriam mais vantajosas 
      que redução de parcela no seu caso específico.`,
      
      `Baseado no seu perfil, recomendamos concentrar as amortizações extras nos meses 
      1, 13, 25 e 37, que maximizariam o impacto na redução do saldo devedor.`,
      
      `Renegociar a taxa de juros após 24 meses poderia trazer uma economia adicional 
      de até 8% no valor total do financiamento.`,
      
      `Sua atual estratégia de amortização está bem otimizada. Sugerimos manter o 
      planejamento atual.`
    ];
    
    // Selecionar 3 recomendações aleatórias
    const shuffled = options.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    return selected.join('\n\n');
  };
  
  // Gerar análise simulada de timing
  const generateTiming = () => {
    const bestMonths = Array.from({length: 3}, () => Math.floor(Math.random() * 48) + 1)
      .sort((a, b) => a - b)
      .join(', ');
    
    return (
      `Nossa análise indica que os melhores momentos para realizar amortizações extras 
      são nos meses ${bestMonths} do financiamento, quando o impacto na redução de juros 
      é maximizado.
      
      Amortizações realizadas no primeiro terço do prazo total geram aproximadamente o 
      dobro de economia em comparação com amortizações de mesmo valor realizadas no 
      último terço.`
    );
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Relatório de Análise IA" size="lg">
      <div className="p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="mb-4">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-500 text-center">
              O assistente de IA está analisando seu financiamento e gerando recomendações personalizadas...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-blue-800">Visão Geral do Financiamento</h3>
              </div>
              <p className="text-blue-700 whitespace-pre-line">{reports.overview}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-green-800">Análise de Economia</h3>
              </div>
              <p className="text-green-700 whitespace-pre-line">{reports.savings}</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <h3 className="text-lg font-medium text-purple-800">Recomendações</h3>
              </div>
              <div className="text-purple-700 whitespace-pre-line">
                {reports.recommendations.split('\n\n').map((rec, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-purple-600 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p>{rec}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-medium text-amber-800">Análise de Timing</h3>
              </div>
              <p className="text-amber-700 whitespace-pre-line">{reports.timing}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-500">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-medium text-gray-700">Observação</h3>
              </div>
              <p>
                Este relatório foi gerado por um assistente de IA com base nos dados do financiamento simulado.
                As recomendações são apenas sugestões e não substituem a orientação de um profissional financeiro.
                Este relatório é uma simulação para fins educativos, usando dados aleatórios para exemplificar a funcionalidade.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIReport;