import React, { useState, useEffect } from 'react';

const AIReport = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  
  useEffect(() => {
    // Simulação de carregamento do relatório
    const timer = setTimeout(() => {
      setLoading(false);
      setReport(generateSampleReport());
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExport = () => {
    // Criar um elemento de texto para download
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(report, null, 2)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'relatório-financiamento.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center">
        <div className="bg-white w-full max-w-5xl rounded-lg shadow-xl transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Relatório de Análise de Financiamento
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading}
              >
                <span className="sr-only">Imprimir</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
                </svg>
              </button>
              <button
                onClick={handleExport}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                disabled={loading}
              >
                <span className="sr-only">Exportar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Fechar</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-4 max-h-[80vh] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-gray-500">Gerando relatório de análise...</p>
              </div>
            ) : (
              <div className="prose max-w-none" id="report-content">
                {report && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {report.title}
                    </h3>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-blue-800 mb-2">Resumo Executivo</h4>
                      <p className="text-blue-700">{report.summary}</p>
                    </div>
                    
                    {report.sections.map((section, index) => (
                      <div key={index} className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h4>
                        <p className="text-gray-700 mb-4">{section.content}</p>
                        
                        {section.points && (
                          <ul className="list-disc pl-5 space-y-1 text-gray-600">
                            {section.points.map((point, pointIndex) => (
                              <li key={pointIndex}>{point}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                    
                    <div className="bg-green-50 p-4 rounded-lg mb-6">
                      <h4 className="font-medium text-green-800 mb-2">Recomendações</h4>
                      <ul className="list-disc pl-5 space-y-1 text-green-700">
                        {report.recommendations.map((rec, index) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-4 mt-8">
                      <p className="text-gray-500 text-sm italic">
                        Este relatório foi gerado automaticamente com base nos dados de simulação atuais.
                        As recomendações são apenas sugestões e não substituem o aconselhamento financeiro profissional.
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Função para gerar um relatório de exemplo
const generateSampleReport = () => {
  return {
    title: "Análise Financeira de Financiamento Imobiliário",
    summary: "Este relatório apresenta uma análise detalhada do seu cenário de financiamento imobiliário, identificando oportunidades para otimização de custos e redução de prazos através de estratégias de amortização personalizada.",
    sections: [
      {
        title: "Perfil do Financiamento",
        content: "A simulação atual apresenta um financiamento de médio prazo com taxa de juros compatível com o mercado. O sistema de amortização escolhido é adequado para o seu perfil, considerando os objetivos financeiros de longo prazo.",
        points: [
          "Sistema SAC com amortizações progressivas",
          "Taxa de juros dentro da média do mercado",
          "Prazo de financiamento confortável para liquidação da dívida"
        ]
      },
      {
        title: "Análise de Custo Total",
        content: "O custo total do financiamento, incluindo juros, seguros e correção monetária, representa aproximadamente 65% acima do valor financiado. Esta proporção está dentro da faixa esperada para o prazo e sistema escolhidos.",
        points: [
          "Os juros representam a maior parcela do custo adicional (72%)",
          "Seguros e taxas somam aproximadamente 18% do custo adicional",
          "Correção monetária contribui com 10% do custo adicional"
        ]
      },
      {
        title: "Estratégia de Amortizações",
        content: "A simulação com amortizações extras apresenta uma significativa redução no custo total e no prazo do financiamento. Com a atual estratégia de amortizações, a economia projetada é relevante comparada ao financiamento padrão.",
        points: [
          "Economia total estimada em 32% do custo de juros original",
          "Redução de prazo em aproximadamente 42 meses (3,5 anos)",
          "A distribuição das amortizações está bem balanceada ao longo do período"
        ]
      },
      {
        title: "Impacto no Fluxo de Caixa",
        content: "As amortizações extras escolhidas têm um impacto controlado no fluxo de caixa mensal, priorizando a redução de prazo em vez da redução imediata das parcelas. Esta abordagem é mais eficiente para economia total no longo prazo.",
        points: [
          "Compromisso financeiro médio mensal reduzido em 8% após amortizações",
          "Liquidação antecipada melhora o perfil financeiro de longo prazo",
          "Flexibilidade para ajustes futuros na estratégia de pagamento"
        ]
      }
    ],
    recommendations: [
      "Considere aumentar a frequência de amortizações extras nos primeiros 24 meses, quando o saldo devedor está mais alto",
      "Avalie a possibilidade de amortizações trimestrais de menor valor em vez de anuais de maior valor",
      "Para maximizar a economia, priorize a opção de redução de prazo para todas as amortizações",
      "Acompanhe periodicamente as taxas de mercado para avaliar oportunidades de portabilidade",
      "Estabeleça uma reserva financeira específica para as amortizações programadas"
    ]
  };
};

export default AIReport;