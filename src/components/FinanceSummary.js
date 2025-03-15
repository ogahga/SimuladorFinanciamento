import React from 'react';

const FinanceSummary = ({ 
  basicResults, 
  amortizationResults, 
  principal, 
  formatCurrency, 
  annualInterest, 
  system,
  formatLastPaymentDate,
  cardType = 'both' // 'basic', 'amortization', ou 'both'
}) => {
  if (!basicResults) return null;
  
  // Componente para uma linha do resumo
  const SummaryRow = ({ label, value, isHighlighted = false, tooltip = null }) => (
    <div className={`flex justify-between py-2 border-b ${isHighlighted ? 'font-semibold' : ''}`}>
      <div className="flex items-center">
        <span className="text-gray-700">{label}</span>
        {tooltip && (
          <div className="relative group ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-10">
              {tooltip}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800"></div>
            </div>
          </div>
        )}
      </div>
      <span className={`text-right ${isHighlighted ? 'text-primary-700' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
  
  // Ícones para os cards de resumo
  const FinanceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
    </svg>
  );
  
  const AmortizationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
    </svg>
  );
  
  // Renderizar apenas o card básico
  if (cardType === 'basic') {
    return (
      <div className="card hover-shadow transition-all duration-300 h-full flex flex-col mt-auto">
        <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <FinanceIcon />
            <h3 className="text-lg font-semibold text-primary-700 ml-2">Financiamento Padrão</h3>
          </div>
        </div>
        
        <div className="card-body">
          <SummaryRow
            label="Valor financiado"
            value={formatCurrency(principal)}
            isHighlighted={true}
          />
          
          <SummaryRow
            label="Total a ser pago"
            value={formatCurrency(basicResults.totalPaid)}
            isHighlighted={true}
            tooltip="Soma de todas as parcelas ao longo do financiamento"
          />
          
          <SummaryRow
            label="Total amortizado extra"
            value="--"
            isHighlighted={true}
            tooltip="Total de amortizações extras aplicadas ao financiamento"
          />
          
          <SummaryRow
            label="Total de juros"
            value={formatCurrency(basicResults.totalInterest)}
            tooltip="Valor total pago em juros durante todo o financiamento"
          />
          
          <SummaryRow
            label="Total de taxas/seguros"
            value={formatCurrency(basicResults.totalInsurance)}
          />
          
          <SummaryRow
            label="Correção monetária"
            value={formatCurrency(basicResults.totalCorrection)}
            tooltip="Valor total de correção monetária aplicada ao saldo devedor"
          />
          
          <SummaryRow
            label="Taxa de juros"
            value={`${(annualInterest * 100).toFixed(2)}% a.a.`}
          />
          
          <SummaryRow
            label="Quantidade de parcelas"
            value={basicResults.totalPayments}
          />
          
          <SummaryRow
            label="Valor da primeira parcela"
            value={formatCurrency(basicResults.firstInstallment)}
          />
          
          <SummaryRow
            label="Valor da última parcela"
            value={formatCurrency(basicResults.lastInstallment)}
          />
          
          <SummaryRow
            label="Data da última parcela"
            value={formatLastPaymentDate(basicResults.totalPayments)}
          />
          
          <SummaryRow
            label="Sistema de amortização"
            value={system.toUpperCase()}
            tooltip={system.toUpperCase() === 'SAC' ? 
              'Sistema de Amortização Constante: parcelas decrescentes ao longo do tempo' : 
              'Sistema Price: parcelas constantes (exceto por correção monetária)'
            }
          />
        </div>
      </div>
    );
  }
  
  // Renderizar apenas o card de amortização
  if (cardType === 'amortization') {
    return (
      <div className="card hover-shadow transition-all duration-300 h-full flex flex-col mt-auto">
        <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center">
            <AmortizationIcon />
            <h3 className="text-lg font-semibold text-green-700 ml-2">Com Amortização</h3>
          </div>
        </div>
        
        {amortizationResults ? (
          <div className="card-body">
            <SummaryRow
              label="Valor financiado"
              value={formatCurrency(principal)}
              isHighlighted={true}
            />
            
            <SummaryRow
              label="Total a ser pago"
              value={formatCurrency(amortizationResults.totalPaid)}
              isHighlighted={true}
              tooltip="Soma de todas as parcelas mais amortizações extras"
            />
            
            <SummaryRow
              label="Total amortizado extra"
              value={formatCurrency(amortizationResults.totalExtraAmort)}
              isHighlighted={true}
              tooltip="Total de amortizações extras aplicadas ao financiamento"
            />
            
            <SummaryRow
              label="Total de juros"
              value={formatCurrency(amortizationResults.totalInterest)}
              tooltip="Valor total pago em juros durante todo o financiamento"
            />
            
            <SummaryRow
              label="Total de taxas/seguros"
              value={formatCurrency(amortizationResults.totalInsurance)}
            />
            
            <SummaryRow
              label="Correção monetária"
              value={formatCurrency(amortizationResults.totalCorrection)}
              tooltip="Valor total de correção monetária aplicada ao saldo devedor"
            />
            
            <SummaryRow
              label="Taxa de juros"
              value={`${(annualInterest * 100).toFixed(2)}% a.a.`}
            />
            
            <SummaryRow
              label="Quantidade de parcelas"
              value={amortizationResults.totalPayments}
            />
            
            <SummaryRow
              label="Valor da primeira parcela"
              value={formatCurrency(amortizationResults.firstInstallment)}
            />
            
            <SummaryRow
              label="Valor da última parcela"
              value={formatCurrency(amortizationResults.lastInstallment)}
            />
            
            <SummaryRow
              label="Data da última parcela"
              value={formatLastPaymentDate(amortizationResults.totalPayments)}
            />
            
            <SummaryRow
              label="Sistema de amortização"
              value={amortizationResults.system.toUpperCase()}
            />
          </div>
        ) : (
          <div className="card-body">
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 mb-1">Configure amortizações extras na seção ao lado para ver o resumo comparativo.</p>
              <p className="text-gray-500 text-sm">As amortizações extras ajudam a reduzir o tempo ou valor das parcelas do financiamento.</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  // Renderizar ambos os cards (comportamento padrão)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 animate-fade-in">
      <div className="card hover-shadow transition-all duration-300">
        <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center">
            <FinanceIcon />
            <h3 className="text-lg font-semibold text-primary-700 ml-2">Financiamento Padrão</h3>
          </div>
        </div>
        
        <div className="card-body">
          <SummaryRow
            label="Valor financiado"
            value={formatCurrency(principal)}
            isHighlighted={true}
          />
          
          <SummaryRow
            label="Total a ser pago"
            value={formatCurrency(basicResults.totalPaid)}
            isHighlighted={true}
            tooltip="Soma de todas as parcelas ao longo do financiamento"
          />
          
          <SummaryRow
            label="Total de juros"
            value={formatCurrency(basicResults.totalInterest)}
            tooltip="Valor total pago em juros durante todo o financiamento"
          />
          
          <SummaryRow
            label="Total de taxas/seguros"
            value={formatCurrency(basicResults.totalInsurance)}
          />
          
          <SummaryRow
            label="Correção monetária"
            value={formatCurrency(basicResults.totalCorrection)}
            tooltip="Valor total de correção monetária aplicada ao saldo devedor"
          />
          
          <SummaryRow
            label="Taxa de juros"
            value={`${(annualInterest * 100).toFixed(2)}% a.a.`}
          />
          
          <SummaryRow
            label="Quantidade de parcelas"
            value={basicResults.totalPayments}
          />
          
          <SummaryRow
            label="Valor da primeira parcela"
            value={formatCurrency(basicResults.firstInstallment)}
          />
          
          <SummaryRow
            label="Valor da última parcela"
            value={formatCurrency(basicResults.lastInstallment)}
          />
          
          <SummaryRow
            label="Data da última parcela"
            value={formatLastPaymentDate(basicResults.totalPayments)}
          />
          
          <SummaryRow
            label="Sistema de amortização"
            value={system.toUpperCase()}
            tooltip={system.toUpperCase() === 'SAC' ? 
              'Sistema de Amortização Constante: parcelas decrescentes ao longo do tempo' : 
              'Sistema Price: parcelas constantes (exceto por correção monetária)'
            }
          />
        </div>
      </div>
      
      <div className="card hover-shadow transition-all duration-300">
        <div className="card-header bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center">
            <AmortizationIcon />
            <h3 className="text-lg font-semibold text-green-700 ml-2">Com Amortização</h3>
          </div>
        </div>
        
        {amortizationResults ? (
          <div className="card-body">
            <SummaryRow
              label="Valor financiado"
              value={formatCurrency(principal)}
              isHighlighted={true}
            />
            
            <SummaryRow
              label="Total a ser pago"
              value={formatCurrency(amortizationResults.totalPaid)}
              isHighlighted={true}
              tooltip="Soma de todas as parcelas mais amortizações extras"
            />
            
            <SummaryRow
              label="Total amortizado extra"
              value={formatCurrency(amortizationResults.totalExtraAmort)}
              isHighlighted={true}
              tooltip="Total de amortizações extras aplicadas ao financiamento"
            />
            
            <SummaryRow
              label="Total de juros"
              value={formatCurrency(amortizationResults.totalInterest)}
              tooltip="Valor total pago em juros durante todo o financiamento"
            />
            
            <SummaryRow
              label="Total de taxas/seguros"
              value={formatCurrency(amortizationResults.totalInsurance)}
            />
            
            <SummaryRow
              label="Correção monetária"
              value={formatCurrency(amortizationResults.totalCorrection)}
              tooltip="Valor total de correção monetária aplicada ao saldo devedor"
            />
            
            <SummaryRow
              label="Taxa de juros"
              value={`${(annualInterest * 100).toFixed(2)}% a.a.`}
            />
            
            <SummaryRow
              label="Quantidade de parcelas"
              value={amortizationResults.totalPayments}
            />
            
            <SummaryRow
              label="Valor da primeira parcela"
              value={formatCurrency(amortizationResults.firstInstallment)}
            />
            
            <SummaryRow
              label="Valor da última parcela"
              value={formatCurrency(amortizationResults.lastInstallment)}
            />
            
            <SummaryRow
              label="Data da última parcela"
              value={formatLastPaymentDate(amortizationResults.totalPayments)}
            />
            
            <SummaryRow
              label="Sistema de amortização"
              value={amortizationResults.system.toUpperCase()}
            />
          </div>
        ) : (
          <div className="card-body">
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-gray-600 mb-1">Configure amortizações extras na seção ao lado para ver o resumo comparativo.</p>
              <p className="text-gray-500 text-sm">As amortizações extras ajudam a reduzir o tempo ou valor das parcelas do financiamento.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceSummary;