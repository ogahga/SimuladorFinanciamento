import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

const AIReport = ({ onClose }) => {
  const [reportType, setReportType] = useState('financingAnalysis');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  
  // Generate report on component mount or when report type changes
  useEffect(() => {
    generateReport(reportType);
  }, [reportType]);
  
  // Simulate report generation
  const generateReport = (type) => {
    setIsLoading(true);
    setReport(null);
    
    // Simulate API delay
    setTimeout(() => {
      const reportContent = getReportByType(type);
      setReport(reportContent);
      setIsLoading(false);
    }, 1500);
  };
  
  // Get predefined report content by type
  const getReportByType = (type) => {
    switch (type) {
      case 'financingAnalysis':
        return {
          title: 'Análise de Financiamento Imobiliário',
          summary: 'Este relatório analisa seu financiamento atual e fornece recomendações baseadas nos parâmetros configurados.',
          sections: [
            {
              title: 'Visão Geral do Financiamento',
              content: `
                Seu financiamento está configurado com as seguintes características principais:
                - Sistema de amortização SAC (Sistema de Amortização Constante)
                - Prazo de 300 meses (25 anos)
                - Taxa de juros de 12,68% ao ano
                - Taxa de correção monetária de 1,2% ao ano
                
                O SAC é caracterizado por amortizações constantes e parcelas decrescentes ao longo do tempo, o que resulta em um pagamento mais acelerado do principal nos primeiros anos do financiamento.
              `
            },
            {
              title: 'Análise de Custos',
              content: `
                O custo total do seu financiamento é significativamente impactado pelos juros, que representam aproximadamente 180% do valor financiado no longo prazo.
                
                Considerando um financiamento de R$ 300.000,00:
                - Total de juros: R$ 541.357,00
                - Total de correção monetária: R$ 38.945,00
                - Total de seguros e tarifas: R$ 36.000,00
                - Custo total: R$ 916.302,00
                
                Isso significa que você pagará aproximadamente 3 vezes o valor financiado ao longo do contrato.
              `
            },
            {
              title: 'Oportunidades de Economia',
              content: `
                Com base na nossa análise, identificamos algumas oportunidades de economia:
                
                1. **Amortizações Extras**: Realizando amortizações extras anuais de R$ 10.000,00, você pode reduzir o prazo em até 8 anos e economizar aproximadamente R$ 180.000,00 em juros.
                
                2. **Refinanciamento**: Com as taxas atuais de mercado, você poderia buscar um refinanciamento com taxas a partir de 10% a.a., o que representaria uma economia de aproximadamente R$ 100.000,00 ao longo do contrato.
                
                3. **Mudança de Sistema**: Considerando seu perfil financeiro, o sistema SAC é mais vantajoso do que o PRICE no longo prazo, apesar das parcelas iniciais mais elevadas.
              `
            },
            {
              title: 'Recomendações',
              content: `
                Com base nas simulações realizadas, recomendamos:
                
                1. Manter o sistema SAC, pois ele resultará em menor custo total no longo prazo.
                
                2. Implementar um plano de amortizações extras anuais, preferencialmente no valor de 3-5% do saldo devedor.
                
                3. Monitorar as taxas de mercado para oportunidades de portabilidade ou refinanciamento quando as taxas estiverem pelo menos 2 pontos percentuais abaixo da sua taxa atual.
                
                4. Priorizar a redução de prazo nas amortizações extras, em vez da redução de parcela, para maximizar a economia de juros.
              `
            }
          ]
        };
        
      case 'financialPlanning':
        return {
          title: 'Planejamento Financeiro para seu Financiamento',
          summary: 'Este relatório fornece um plano financeiro personalizado para otimizar o pagamento do seu financiamento.',
          sections: [
            {
              title: 'Estratégia de Pagamento',
              content: `
                Com base no seu perfil financeiro e nos parâmetros do financiamento, sugerimos a seguinte estratégia:
                
                **Fase 1 (Anos 1-5):**
                - Manter pagamentos regulares
                - Acumular uma reserva de emergência equivalente a 6 meses de parcelas
                - Realizar uma amortização anual no valor de R$ 8.000,00 (ou mais se possível)
                
                **Fase 2 (Anos 6-15):**
                - Aumentar as amortizações anuais para R$ 15.000,00
                - Aplicar qualquer bonificação ou 13º salário diretamente no financiamento
                - Considerar a portabilidade se as taxas de mercado forem favoráveis
                
                **Fase 3 (Anos 16+):**
                - Avaliar a possibilidade de quitar o financiamento com recursos de outros investimentos
                - Considerar aumentar as amortizações conforme o crescimento da renda
              `
            },
            {
              title: 'Orçamento Recomendado',
              content: `
                Para viabilizar esta estratégia, recomendamos a seguinte distribuição do orçamento familiar:
                
                - 25-30% da renda líquida para o financiamento (parcela mensal)
                - 5-10% da renda anual para amortizações extras
                - 10-15% para reserva de emergência e outros investimentos
                - 50-60% para despesas gerais e estilo de vida
                
                Esta alocação permite manter um equilíbrio entre o pagamento acelerado do financiamento e a manutenção de uma reserva financeira adequada.
              `
            },
            {
              title: 'Análise de Risco',
              content: `
                É importante considerar os seguintes riscos no longo prazo:
                
                1. **Variação da Taxa de Correção**: Um aumento significativo na taxa de correção monetária pode impactar o saldo devedor. Recomendamos acompanhar esse indicador e, se necessário, aumentar as amortizações em períodos de alta inflação.
                
                2. **Mudanças na Renda**: Em caso de redução temporária da renda, priorize o pagamento da parcela regular e adie as amortizações extras até que a situação se estabilize.
                
                3. **Custo de Oportunidade**: Em cenários de altas taxas de juros no mercado, avalie o custo de oportunidade entre amortizar o financiamento ou investir em renda fixa.
              `
            },
            {
              title: 'Próximos Passos',
              content: `
                Para implementar este plano financeiro, sugerimos:
                
                1. Configurar depósitos automáticos mensais para uma conta separada destinada às amortizações anuais
                
                2. Programar revisões semestrais do plano, especialmente após mudanças significativas nas taxas de juros ou na sua situação financeira
                
                3. Consultar um planejador financeiro para integrá-lo ao seu planejamento financeiro global
                
                4. Utilizar o simulador regularmente para recalcular o impacto das amortizações e ajustar sua estratégia
              `
            }
          ]
        };
        
      case 'marketComparison':
        return {
          title: 'Comparação com o Mercado Imobiliário',
          summary: 'Este relatório compara seu financiamento com as condições atuais do mercado imobiliário.',
          sections: [
            {
              title: 'Panorama do Mercado',
              content: `
                O mercado imobiliário brasileiro apresenta atualmente as seguintes características:
                
                - Taxa média de juros para financiamento imobiliário: 10,5% a 12,5% a.a.
                - Prazo médio dos financiamentos: 30 anos (360 meses)
                - Relação média de financiamento/valor do imóvel (LTV): 70-80%
                - Variação anual média dos preços de imóveis: 5-7%
                
                Seu financiamento com taxa de 12,68% a.a. está ligeiramente acima da média do mercado, mas ainda dentro de um intervalo aceitável considerando o histórico recente.
              `
            },
            {
              title: 'Competitividade do Seu Financiamento',
              content: `
                Em comparação com as ofertas atuais do mercado:
                
                - Sua taxa de juros está 0,5-2,0 pontos percentuais acima das melhores ofertas disponíveis para novos financiamentos
                - O prazo de 300 meses é compatível com a prática atual do mercado
                - A taxa de correção monetária de 1,2% a.a. está dentro dos padrões praticados
                
                **Oportunidades de Portabilidade:**
                
                Com as condições atuais, você poderia economizar aproximadamente R$ 85.000,00 ao longo do contrato realizando a portabilidade para uma instituição que ofereça taxa de 10,5% a.a.
              `
            },
            {
              title: 'Tendências de Mercado',
              content: `
                As projeções para os próximos 2-3 anos indicam:
                
                - Estabilidade nas taxas de juros, com possível tendência de leve queda
                - Aumento gradual dos preços dos imóveis, em linha com a inflação
                - Maior flexibilidade das instituições financeiras em relação à portabilidade
                
                Estas tendências sugerem que pode ser vantajoso aguardar 12-18 meses antes de buscar uma renegociação ou portabilidade, quando as condições poderão estar ainda mais favoráveis.
              `
            },
            {
              title: 'Considerações para Decisões Futuras',
              content: `
                Ao avaliar mudanças em seu financiamento, considere:
                
                1. **Custos de Portabilidade**: Embora não haja custos diretos para portabilidade, existem custos com documentação e avaliação que devem ser considerados
                
                2. **Tempo Restante de Contrato**: Quanto menor o prazo restante, menos impacto terá uma redução na taxa de juros
                
                3. **Perfil de Risco**: Financiamentos com taxas pós-fixadas podem oferecer taxas iniciais menores, mas apresentam maior incerteza no longo prazo
                
                4. **Valor do Imóvel**: A valorização do imóvel pode permitir a negociação de condições mais favoráveis na portabilidade ou refinanciamento
              `
            }
          ]
        };
        
      default:
        return {
          title: 'Relatório de Análise Financeira',
          summary: 'Não foi possível gerar um relatório específico para o tipo selecionado.',
          sections: []
        };
    }
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} size="lg" title="Relatório Inteligente">
      <div className="p-6">
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              reportType === 'financingAnalysis'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setReportType('financingAnalysis')}
          >
            Análise do Financiamento
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              reportType === 'financialPlanning'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setReportType('financialPlanning')}
          >
            Planejamento Financeiro
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              reportType === 'marketComparison'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setReportType('marketComparison')}
          >
            Comparação de Mercado
          </button>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <svg className="animate-spin h-12 w-12 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-500">Gerando relatório personalizado...</p>
          </div>
        ) : report ? (
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{report.title}</h2>
            <p className="text-gray-700 mb-6">{report.summary}</p>
            
            <div className="space-y-6">
              {report.sections.map((section, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.title}</h3>
                  <div className="text-gray-700 whitespace-pre-line">{section.content}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Observação Importante</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Este relatório é baseado nos dados fornecidos e simulações realizadas. As projeções e recomendações são apenas para fins informativos e não constituem aconselhamento financeiro. Consulte um profissional qualificado antes de tomar decisões financeiras importantes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Não foi possível gerar o relatório. Por favor, tente novamente.
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none"
            onClick={onClose}
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AIReport;