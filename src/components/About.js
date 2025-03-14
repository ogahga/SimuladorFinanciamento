import React from 'react';

const About = () => {
  return (
    <div className="prose max-w-none p-4">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Sobre o Simulador de Financiamento</h2>
      
      <p className="text-gray-700 mb-4">
        Esta ferramenta foi desenvolvida para ajudar na simulação e planejamento 
        de financiamentos imobiliários, permitindo a comparação entre diferentes 
        sistemas de amortização e a análise do impacto de amortizações extras no prazo e custo total.
      </p>
      
      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Sistemas de Amortização</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h4 className="font-semibold text-blue-800">Sistema SAC (Sistema de Amortização Constante)</h4>
        <p className="text-blue-700 mt-2">
          No sistema SAC, o valor da amortização é fixo durante todo o prazo. As parcelas são decrescentes, 
          já que a parte referente aos juros diminui a cada mês. É geralmente mais econômico que o PRICE 
          no longo prazo, mas tem parcelas iniciais mais altas.
        </p>
      </div>
      
      <div className="bg-indigo-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-indigo-800">Sistema PRICE (Sistema Francês de Amortização)</h4>
        <p className="text-indigo-700 mt-2">
          No sistema PRICE, as parcelas são fixas durante todo o prazo. Inicialmente, 
          a maior parte da parcela é composta por juros, e ao longo do tempo, a proporção vai 
          se invertendo em favor da amortização. Tem parcelas iniciais menores que o SAC, mas o custo 
          total é maior.
        </p>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Amortizações Extras</h3>
      
      <p className="text-gray-700 mb-4">
        Ao realizar amortizações extras, você pode optar por:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800">Redução de Prazo</h4>
          <p className="text-green-700 mt-2">
            Mantém o valor da parcela e diminui o tempo total do financiamento. 
            Esta opção geralmente resulta na maior economia de juros no longo prazo.
          </p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <h4 className="font-semibold text-amber-800">Redução de Parcela</h4>
          <p className="text-amber-700 mt-2">
            Mantém o prazo original e reduz o valor das parcelas restantes. 
            Esta opção é útil para aliviar o orçamento mensal.
          </p>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Funcionalidades Especiais</h3>
      
      <ul className="list-disc pl-5 space-y-2 text-gray-700">
        <li>
          <strong>Simulador de Prazo Alvo:</strong> Calcula o valor de amortização necessário 
          para atingir um prazo específico.
        </li>
        <li>
          <strong>Comparação de Sistemas:</strong> Analisa as diferenças entre os sistemas SAC e PRICE 
          para o mesmo financiamento.
        </li>
        <li>
          <strong>Gráficos Comparativos:</strong> Visualize a evolução do saldo devedor, parcelas, 
          e a composição de cada pagamento.
        </li>
        <li>
          <strong>Tabela Completa:</strong> Detalha mês a mês toda a evolução do financiamento.
        </li>
        <li>
          <strong>Salvar e Carregar:</strong> Armazene suas simulações para referência futura.
        </li>
      </ul>
      
      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Considerações Importantes</h3>
      
      <div className="bg-yellow-50 p-4 rounded-lg mb-6">
        <p className="text-yellow-700">
          <strong>Nota:</strong> Este simulador considera a aplicação de correção monetária sobre o saldo 
          devedor, o que é comum em financiamentos de longo prazo no Brasil. Os resultados são aproximações 
          e podem variar conforme as condições específicas de cada contrato de financiamento.
        </p>
      </div>
      
      <p className="text-gray-500 text-sm mt-8">
        Versão 2.5.0 • Desenvolvido por CascadeProjects
      </p>
    </div>
  );
};

export default About;