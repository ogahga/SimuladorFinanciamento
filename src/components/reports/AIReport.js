import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

const AIReport = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  
  // Simulates loading an AI-generated report
  useEffect(() => {
    const timer = setTimeout(() => {
      setReport(generateReport());
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Function to generate a mock AI report
  const generateReport = () => {
    return {
      summary: "Análise de Financiamento Imobiliário",
      sections: [
        {
          title: "Análise Comparativa dos Sistemas",
          content: `
            <p>
              <strong>Sistema SAC</strong>: Apresenta parcelas iniciais mais altas, mas com rápida redução ao longo do tempo.
              Seu custo total é geralmente menor do que o sistema PRICE, tornando-o mais econômico no longo prazo. 
              Para este financiamento específico, o sistema SAC resulta em uma economia de aproximadamente 18% em juros.
            </p>
            <p>
              <strong>Sistema PRICE</strong>: Oferece parcelas fixas e iniciais menores, facilitando o enquadramento 
              na capacidade de pagamento inicial. Contudo, o saldo devedor diminui mais lentamente, resultando em 
              maior desembolso total durante a vida do financiamento.
            </p>
          `
        },
        {
          title: "Estratégias de Amortização",
          content: `
            <p>
              As amortizações extras são extremamente eficientes para reduzir o custo total do financiamento. 
              Com base nos dados analisados, recomendo considerar as seguintes estratégias:
            </p>
            <ol>
              <li>
                <strong>Amortizações frequentes de menor valor</strong>: Por exemplo, aplicar amortizações trimestrais 
                no valor de 2% do saldo devedor proporciona uma redução significativa do prazo total em até 30%.
              </li>
              <li>
                <strong>Redução de prazo vs. parcela</strong>: Para maximizar a economia de juros, priorize amortizações
                com redução de prazo. Para alívio imediato no orçamento, escolha redução de parcela.
              </li>
              <li>
                <strong>Timing estratégico</strong>: Amortizações realizadas nos primeiros 5 anos do financiamento 
                têm impacto significativamente maior na redução total de juros.
              </li>
            </ol>
          `
        },
        {
          title: "Análise de Custo-Benefício",
          content: `
            <p>
              Considerando a taxa de juros atual de 12.68% a.a. e a correção monetária de 1.2% a.a., o financiamento atual
              presenta um custo efetivo total (CET) relativamente elevado. Algumas alternativas a considerar:
            </p>
            <ul>
              <li>
                <strong>Entrada maior</strong>: Aumentar o valor da entrada em 10% reduziria o custo total em aproximadamente 15%.
              </li>
              <li>
                <strong>Refinanciamento</strong>: Após 36 meses, caso as taxas de mercado estejam mais favoráveis, 
                considerar o refinanciamento pode ser vantajoso.
              </li>
              <li>
                <strong>Portabilidade</strong>: Monitorar ofertas de outras instituições financeiras que possam oferecer 
                taxas mais competitivas para portabilidade do financiamento.
              </li>
            </ul>
          `
        },
        {
          title: "Projeção de Economia com Amortizações",
          content: `
            <p>
              Com base nas simulações realizadas, implementar um plano estruturado de amortizações extras pode resultar em:
            </p>
            <ul>
              <li>Redução de até 40% no prazo total de financiamento</li>
              <li>Economia de juros estimada em até R$ 180.000,00 (para um financiamento de R$ 500.000,00)</li>
              <li>Desoneração do orçamento futuro, permitindo maior disponibilidade financeira</li>
            </ul>
            <p>
              É importante considerar que investimentos com retorno superior à taxa de juros do financiamento
              podem ser mais vantajosos que amortizações extras.
            </p>
          `
        },
        {
          title: "Considerações sobre Seguros e Taxas",
          content: `
            <p>
              O seguro e taxas administrativas representam um componente significativo do custo total do financiamento.
              Algumas considerações:
            </p>
            <ul>
              <li>
                <strong>Comparativo entre seguradoras</strong>: Diferentes instituições oferecem seguros habitacionais com 
                valores distintos. Vale a pena comparar.
              </li>
              <li>
                <strong>Impacto do seguro no longo prazo</strong>: No caso analisado, o seguro corresponde a aproximadamente 
                8% do valor total pago no financiamento.
              </li>
              <li>
                <strong>Redução proporcional</strong>: O seguro habitacional é calculado sobre o saldo devedor, portanto 
                diminui gradualmente ao longo do financiamento.
              </li>
            </ul>
          `
        }
      ]
    };
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Relatório IA - Análise de Financiamento" size="lg">
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-pulse flex space-x-4 mb-6">
              <div className="rounded-full bg-blue-100 h-12 w-12 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-blue-100 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="h-2 bg-blue-100 rounded col-span-2"></div>
                    <div className="h-2 bg-blue-100 rounded col-span-1"></div>
                  </div>
                  <div className="h-2 bg-blue-100 rounded"></div>
                </div>
              </div>
            </div>
            <p className="text-gray-500">A IA está analisando seu financiamento...</p>
          </div>
        ) : (
          <div className="prose max-w-none">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">{report.summary}</h2>
              <p className="text-gray-500 text-sm">Análise gerada automaticamente com base nos parâmetros e simulações do seu financiamento.</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-8">
              <p className="text-blue-800 text-sm italic">
                Este relatório utiliza inteligência artificial para analisar seu financiamento imobiliário e identificar 
                oportunidades de otimização. As recomendações são baseadas em padrões gerais do mercado e nas simulações realizadas.
                Para assessoria financeira personalizada, consulte um especialista.
              </p>
            </div>
            
            {report.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{section.title}</h3>
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }}></div>
              </div>
            ))}
            
            <div className="mt-10 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Conclusão</h3>
              <p className="text-gray-700">
                Este financiamento apresenta boas oportunidades de economia através de estratégias de amortização. 
                Com um planejamento adequado, é possível reduzir significativamente o custo total e o prazo do financiamento.
                Recomendo utilizar o simulador para testar diferentes cenários e encontrar a melhor estratégia para seu caso específico.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIReport;