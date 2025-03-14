import React, { useState, useEffect } from 'react';
import Modal from '../Modal';

// Formatação de moeda
const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const AIReport = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Simular carregamento da análise IA
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Componente de carregamento
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-4">
        <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="text-lg text-gray-600">Analisando o financiamento...</p>
      <p className="text-sm text-gray-500 mt-2">Estamos processando os dados para gerar o relatório.</p>
    </div>
  );
  
  // Conteúdo simulado de análise
  const reportContent = {
    overview: (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800 mb-2">Resumo da Análise</h3>
          <p className="text-blue-700">
            Financiamentos imobiliários são compromissos de longo prazo que impactam significativamente seu orçamento.
            Nossa análise indica que sua configuração atual do financiamento tem um bom equilíbrio entre prazo e custo total,
            mas há oportunidades para otimização através de amortizações extras estratégicas.
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Principais Insights</h3>
          <ul className="space-y-3">
            <li className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>Custo Total:</strong> O custo total do financiamento representa aproximadamente 
                  <strong className="text-red-600"> 238%</strong> do valor financiado, sendo que os juros correspondem 
                  a <strong>129%</strong> do valor principal.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>Sistema SAC vs PRICE:</strong> Você optou pelo sistema 
                  <strong className="text-blue-600"> SAC</strong>, o que tende a resultar em um 
                  custo total menor a longo prazo quando comparado ao PRICE, embora as parcelas iniciais sejam mais altas.
                </p>
              </div>
            </li>
            <li className="flex">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  <strong>Potencial de economia:</strong> Amortizações extras regulares, mesmo que pequenas, 
                  poderiam reduzir significativamente o prazo e o custo total do financiamento. 
                  Cada R$ 10.000 amortizados no primeiro ano pode economizar até 
                  <strong className="text-green-600"> R$ 22.500</strong> em juros ao longo do financiamento.
                </p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Recomendações</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3 text-sm text-gray-700">
                Considere fazer <strong>amortizações extras anuais</strong>, priorizando a redução de prazo 
                em vez da redução de parcela para maximizar a economia de juros.
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3 text-sm text-gray-700">
                Concentre suas amortizações extras nos <strong>primeiros anos</strong> do financiamento, 
                quando a proporção de juros nas parcelas é maior.
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="ml-3 text-sm text-gray-700">
                Utilize a ferramenta de <strong>Simulação de Prazo Alvo</strong> para planejar amortizações estratégicas
                que permitam atingir um prazo específico de financiamento.
              </div>
            </li>
          </ul>
        </div>
      </div>
    ),
    costAnalysis: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-4">Análise de Custo Detalhada</h3>
          
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Componente</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% do Principal</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Valor Principal</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">{formatCurrency(300000)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700">100%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total de Juros</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">{formatCurrency(387124.45)}</td>
                  <td className="px-4 py-3 text-sm text-right text-red-600">129.0%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total de Correção Monetária</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">{formatCurrency(72436.28)}</td>
                  <td className="px-4 py-3 text-sm text-right text-orange-600">24.1%</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total de Seguros</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-600">{formatCurrency(25700)}</td>
                  <td className="px-4 py-3 text-sm text-right text-purple-600">8.6%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-800">Custo Total do Financiamento</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-gray-800">{formatCurrency(712560.73)}</td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-gray-800">237.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-700 mb-2">Observações sobre o Custo</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>
                O total de juros representa a maior parte do custo adicional, seguido pela correção monetária.
              </li>
              <li>
                Para cada R$ 1,00 financiado, você pagará aproximadamente R$ 2,38 ao final do financiamento.
              </li>
              <li>
                A inflação projetada ao longo do período tende a diluir o valor real da dívida, tornando o custo efetivo 
                menor do que o nominal apresentado acima.
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Oportunidades de Economia</h3>
          <p className="text-yellow-700 mb-4">
            Identificamos três cenários de amortização que poderiam reduzir significativamente o custo total:
          </p>
          
          <div className="overflow-hidden border border-yellow-200 rounded-lg">
            <table className="min-w-full divide-y divide-yellow-200">
              <thead className="bg-yellow-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-yellow-700 uppercase tracking-wider">Cenário</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-yellow-700 uppercase tracking-wider">Amortização</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-yellow-700 uppercase tracking-wider">Redução de Prazo</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-yellow-700 uppercase tracking-wider">Economia Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-yellow-100">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-700">Amortizações Anuais</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{formatCurrency(10000)} / ano</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">84 meses</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">{formatCurrency(153642)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-700">Amortização Única Grande</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{formatCurrency(50000)} no mês 24</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">32 meses</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">{formatCurrency(74320)}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-700">13º Salário como Amortização</td>
                  <td className="px-4 py-2 text-sm text-right text-gray-700">{formatCurrency(5000)} 2x por ano</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">59 meses</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">{formatCurrency(112785)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    comparisonAnalysis: (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-800 mb-3">Comparação entre SAC e PRICE</h3>
          <p className="text-gray-600 mb-4">
            A escolha entre os sistemas SAC e PRICE impacta significativamente o fluxo financeiro do seu financiamento.
            Abaixo apresentamos uma análise comparativa detalhada:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg h-full">
              <h4 className="text-md font-medium text-blue-800 mb-2">Sistema SAC</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Parcelas decrescentes</strong> ao longo do tempo
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Amortização constante</strong> do principal
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Menor custo total</strong> de juros a longo prazo
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Redução mais rápida</strong> do saldo devedor
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Parcelas iniciais mais altas</strong>, exigindo maior comprometimento da renda no início
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg h-full">
              <h4 className="text-md font-medium text-purple-800 mb-2">Sistema PRICE</h4>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Parcelas fixas</strong> durante todo o financiamento
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Amortização crescente</strong> e juros decrescentes ao longo do tempo
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Parcelas iniciais menores</strong>, facilitando a aprovação do financiamento
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Previsibilidade</strong> no orçamento devido às parcelas constantes
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <strong>Maior custo total</strong> de juros ao longo do financiamento
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-700 mb-2">Análise Quantitativa</h4>
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Métrica</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">SAC</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-purple-600 uppercase tracking-wider">PRICE</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Diferença</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  <tr>
                    <td className="px-4 py-2 text-gray-700">Primeira Parcela</td>
                    <td className="px-4 py-2 text-right text-blue-600">{formatCurrency(3575)}</td>
                    <td className="px-4 py-2 text-right text-purple-600">{formatCurrency(3183)}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{formatCurrency(392)} (12.3%)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">Última Parcela</td>
                    <td className="px-4 py-2 text-right text-blue-600">{formatCurrency(1209)}</td>
                    <td className="px-4 py-2 text-right text-purple-600">{formatCurrency(3183)}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{formatCurrency(-1974)} (-62.0%)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">Total de Juros</td>
                    <td className="px-4 py-2 text-right text-blue-600">{formatCurrency(387124)}</td>
                    <td className="px-4 py-2 text-right text-purple-600">{formatCurrency(445328)}</td>
                    <td className="px-4 py-2 text-right text-green-600">{formatCurrency(-58204)} (-13.1%)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">Total Pago</td>
                    <td className="px-4 py-2 text-right text-blue-600">{formatCurrency(712560)}</td>
                    <td className="px-4 py-2 text-right text-purple-600">{formatCurrency(770764)}</td>
                    <td className="px-4 py-2 text-right text-green-600">{formatCurrency(-58204)} (-7.6%)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-800 mb-2">Recomendação Personalizada</h3>
          <p className="text-indigo-700 mb-3">
            Com base no seu perfil financeiro e nos parâmetros do financiamento:
          </p>
          <div className="bg-white p-3 rounded border border-indigo-100">
            <p className="text-gray-700">
              O sistema <strong className="text-blue-600">SAC</strong> parece ser a escolha mais adequada para você, 
              pois, apesar das parcelas iniciais mais altas, sua renda atual comporta esse comprometimento e o 
              benefício a longo prazo é significativo. A diferença de <strong>{formatCurrency(58204)}</strong> no total 
              pago entre os sistemas justifica o maior esforço financeiro inicial.
            </p>
          </div>
        </div>
      </div>
    )
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} title="Relatório IA - Análise do Financiamento" size="xl">
      <div className="p-4">
        {loading ? (
          <LoadingState />
        ) : (
          <div>
            <div className="mb-6 border-b">
              <div className="flex flex-wrap -mb-px">
                <button
                  className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'overview'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('overview')}
                >
                  Visão Geral
                </button>
                <button
                  className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'costAnalysis'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('costAnalysis')}
                >
                  Análise de Custo
                </button>
                <button
                  className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'comparisonAnalysis'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab('comparisonAnalysis')}
                >
                  Comparação de Sistemas
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              {reportContent[activeTab]}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-xs text-gray-500">
                Este relatório é gerado com base em modelos de análise financeira e serve apenas como referência.
                Consulte um especialista financeiro para aconselhamento personalizado.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AIReport;