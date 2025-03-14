import React from 'react';

const About = ({ onClose }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-4xl mx-auto p-8 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-primary-700 gradient-text">Sobre o Simulador</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700"
          aria-label="Fechar"
        >
          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-4">
          O <span className="font-semibold text-primary-600">Simulador de Financiamento Imobiliário</span> é uma ferramenta avançada que permite realizar simulações detalhadas de financiamentos, 
          utilizando os sistemas SAC e PRICE, com suporte a amortizações extraordinárias.
        </p>

        <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Principais Funcionalidades</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 hover-up hover-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-blue-700">Simulação Completa</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Cálculos precisos utilizando os sistemas SAC e PRICE com possibilidade de incluir correção monetária
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-green-700">Amortizações Extraordinárias</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Simule pagamentos extras e veja o impacto na redução do prazo ou da parcela
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 hover-up hover-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-purple-700">Visualizações Avançadas</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Gráficos interativos que mostram a evolução do financiamento e composição das parcelas
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 hover-up hover-shadow">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium text-orange-700">Comparativo de Sistemas</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Compare lado a lado os sistemas SAC e PRICE para tomar a melhor decisão
                </p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Sistemas de Amortização</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-blue-700 mb-2">Sistema SAC</h4>
            <p className="text-sm text-gray-700 mb-3">
              Sistema de Amortização Constante, onde o valor da amortização permanece fixo durante todo o financiamento.
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Parcelas decrescentes</li>
              <li>Primeira parcela mais alta</li>
              <li>Redução mais rápida do saldo devedor</li>
              <li>Geralmente resulta em menos juros no total</li>
            </ul>
          </div>
          
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-red-700 mb-2">Sistema PRICE</h4>
            <p className="text-sm text-gray-700 mb-3">
              Sistema Francês de Amortização, onde o valor das parcelas permanece fixo (exceto por correção monetária).
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Parcelas constantes</li>
              <li>Primeira parcela mais baixa</li>
              <li>Amortização crescente ao longo do tempo</li>
              <li>Juros decrescentes ao longo do tempo</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-3">Como Funciona</h3>
        
        <ol className="space-y-4 mb-6">
          <li className="flex">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-3">1</span>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Insira os dados do financiamento</span> - valor, prazo, taxa de juros, correção monetária e seguro
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-3">2</span>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Adicione amortizações extras</span> - escolhendo se deseja reduzir o prazo ou o valor das parcelas
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-3">3</span>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Analise os resultados</span> - através de gráficos, tabelas e resumos comparativos
              </p>
            </div>
          </li>
          <li className="flex">
            <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-3">4</span>
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Compare cenários</span> - entre diferentes sistemas e estratégias de amortização
              </p>
            </div>
          </li>
        </ol>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3">Dicas para Uso Eficiente</h3>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700">
                Use a <span className="font-medium">Simulação para Prazo Alvo</span> quando quiser descobrir qual o valor ideal de amortização para atingir um prazo específico.
              </p>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700">
                Aplique amortizações nos primeiros anos do financiamento para maximizar a economia de juros.
              </p>
            </li>
            <li className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-gray-700">
                Compare os sistemas SAC e PRICE considerando sua capacidade de pagamento no início e ao longo do financiamento.
              </p>
            </li>
          </ul>
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">
            Versão 2.0.0 - Desenvolvido com React.js e Tailwind CSS.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            © {new Date().getFullYear()} Simulador de Financiamento Imobiliário
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;