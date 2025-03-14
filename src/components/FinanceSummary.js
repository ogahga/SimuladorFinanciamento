import React from 'react';

const FinanceSummary = ({ 
  basicResults, 
  amortizationResults, 
  principal, 
  formatCurrency, 
  annualInterest, 
  system,
  formatLastPaymentDate,
  cardType
}) => {
  // Determine which results to display based on cardType
  const displayResults = cardType === 'basic' ? basicResults : amortizationResults;
  
  // If the requested results don't exist, return appropriate UI
  if (cardType === 'amortization' && !amortizationResults) {
    return (
      <div className="card h-full animate-fade-in">
        <div className="card-header bg-gradient-to-r from-gray-100 to-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Com Amortizações Extras</h3>
        </div>
        <div className="card-body flex flex-col items-center justify-center p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 mb-4">Adicione amortizações extras para visualizar os impactos no financiamento.</p>
          <p className="text-sm text-gray-400">
            As amortizações extras permitem reduzir o prazo ou o valor das parcelas do financiamento.
          </p>
        </div>
      </div>
    );
  }
  
  // If we don't have any results yet
  if (!displayResults) {
    return (
      <div className="card h-full animate-pulse">
        <div className="card-header">
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Calculate the percentage of interest over principal
  const interestRatio = displayResults.totalInterest / principal * 100;
  
  // Variables for card styling based on type
  const headerClass = cardType === 'basic' 
    ? 'bg-gradient-to-r from-blue-50 to-indigo-50'
    : 'bg-gradient-to-r from-green-50 to-emerald-50';
  
  const titleClass = cardType === 'basic'
    ? 'text-blue-800'
    : 'text-green-800';
  
  return (
    <div className={`card h-full animate-fade-in ${cardType === 'amortization' ? 'animate-slide-up' : ''}`}>
      <div className={`card-header ${headerClass}`}>
        <h3 className={`text-lg font-semibold ${titleClass}`}>
          {cardType === 'basic' ? 'Financiamento Padrão' : 'Com Amortizações Extras'}
        </h3>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coluna Esquerda */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Sistema de Amortização</h4>
              <p className="text-lg font-medium">
                {displayResults.system === 'sac' ? 'SAC' : 'PRICE'} 
                <span className="ml-2 text-sm text-gray-500">
                  ({displayResults.system === 'sac' ? 'parcelas decrescentes' : 'parcelas fixas'})
                </span>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Prazo Total</h4>
              <p className="text-lg font-medium">
                {displayResults.totalPayments} meses 
                <span className="text-sm text-gray-500 ml-2">
                  ({(displayResults.totalPayments / 12).toFixed(1)} anos)
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Última parcela em {formatLastPaymentDate(displayResults.totalPayments)}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Valor da Primeira Parcela</h4>
              <p className="text-lg font-medium">{formatCurrency(displayResults.firstInstallment)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Valor da Última Parcela</h4>
              <p className="text-lg font-medium">{formatCurrency(displayResults.lastInstallment)}</p>
            </div>
          </div>
          
          {/* Coluna Direita */}
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Total de Juros</h4>
              <p className="text-lg font-medium">
                {formatCurrency(displayResults.totalInterest)}
                <span className="text-sm text-gray-500 ml-2">
                  ({interestRatio.toFixed(1)}% do valor financiado)
                </span>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Total de Correção Monetária</h4>
              <p className="text-lg font-medium">{formatCurrency(displayResults.totalCorrection)}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-1">Total de Seguros</h4>
              <p className="text-lg font-medium">{formatCurrency(displayResults.totalInsurance)}</p>
            </div>
            
            <div className="pt-3">
              <h4 className="text-base font-semibold text-gray-700 mb-1">Total Pago no Financiamento</h4>
              <p className="text-xl font-bold">
                {formatCurrency(displayResults.totalPaid)}
                {cardType === 'amortization' && (
                  <span className="text-sm text-green-600 ml-2 font-normal">
                    {displayResults.totalExtraAmort > 0 && `incluindo ${formatCurrency(displayResults.totalExtraAmort)} em amortizações extras`}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceSummary;