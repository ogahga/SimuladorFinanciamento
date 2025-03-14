import React, { useState } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer, 
  Bar, 
  BarChart,
  AreaChart, 
  Area
} from 'recharts';

const ChartTabs = ({ basicResults, amortizationResults, principal, formatCurrency }) => {
  const [activeChart, setActiveChart] = useState('balance');
  
  // Prepare chart data by filtering every 12 months, plus the final month
  const prepareChartData = (schedule) => {
    return schedule
      .filter((_, index) => index % 12 === 0 || index === schedule.length - 1)
      .map(row => ({
        month: row.month,
        label: `Mês ${row.month}`,
        balance: row.saldoDevedor,
        principal: principal - row.saldoDevedor - row.amortizacaoMensal,
        installment: row.parcela,
        interest: row.juros,
        amortization: row.amortizacaoMensal,
        insurance: row.seguro,
        remainingTerm: row.prazoRemanescente || 0
      }));
  };

  // Prepare comparison data
  const basicChartData = prepareChartData(basicResults.schedule);
  const amortChartData = amortizationResults ? prepareChartData(amortizationResults.schedule) : [];

  // Create a merged dataset for comparison
  const combinedData = basicChartData.map((basicItem) => {
    const matchingAmort = amortChartData.find(amortItem => amortItem.month === basicItem.month);
    
    return {
      month: basicItem.month,
      label: `Mês ${basicItem.month}`,
      basicBalance: basicItem.balance,
      amortBalance: matchingAmort ? matchingAmort.balance : null,
      basicInstallment: basicItem.installment,
      amortInstallment: matchingAmort ? matchingAmort.installment : null,
      basicInterest: basicItem.interest,
      amortInterest: matchingAmort ? matchingAmort.interest : null,
      basicAmortization: basicItem.amortization,
      amortAmortization: matchingAmort ? matchingAmort.amortization : null,
      difference: matchingAmort ? basicItem.balance - matchingAmort.balance : 0,
      installmentDifference: matchingAmort ? basicItem.installment - matchingAmort.installment : 0
    };
  });

  // Create a combined dataset only up to the amortization schedule length
  const combinedDataTrimmed = combinedData.filter(item => {
    const maxAmortMonth = amortChartData.length > 0 ? 
      amortChartData[amortChartData.length - 1].month : 
      Infinity;
    return item.month <= maxAmortMonth;
  });

  // Chart configurations
  const chartConfigs = {
    balance: {
      title: 'Evolução do Saldo Devedor',
      yAxisLabel: 'Saldo Devedor (R$)',
      lines: [
        { key: 'basicBalance', name: 'Padrão', color: '#0284c7' },
        { key: 'amortBalance', name: 'Com Amortizações', color: '#16a34a', dashed: false }
      ],
      tooltip: (value) => formatCurrency(value),
      yDomain: [0, 'auto']
    },
    installment: {
      title: 'Evolução das Parcelas',
      yAxisLabel: 'Valor da Parcela (R$)',
      lines: [
        { key: 'basicInstallment', name: 'Padrão', color: '#0284c7' },
        { key: 'amortInstallment', name: 'Com Amortizações', color: '#16a34a', dashed: false }
      ],
      tooltip: (value) => formatCurrency(value),
      yDomain: [0, 'auto']
    },
    composition: {
      title: 'Composição das Parcelas',
      yAxisLabel: 'Valor (R$)',
      stacks: [
        { key: 'interest', name: 'Juros', color: '#ef4444' },
        { key: 'amortization', name: 'Amortização', color: '#3b82f6' },
        { key: 'insurance', name: 'Seguro', color: '#8b5cf6' }
      ],
      tooltip: (value) => formatCurrency(value)
    },
    savings: {
      title: 'Economia por Antecipação',
      yAxisLabel: 'Valor (R$)',
      bars: [
        { key: 'difference', name: 'Redução do Saldo', color: '#059669' },
        { key: 'installmentDifference', name: 'Redução da Parcela', color: '#0284c7' }
      ],
      tooltip: (value) => formatCurrency(Math.abs(value))
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="mb-4 border-b">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                activeChart === 'balance'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveChart('balance')}
            >
              Saldo Devedor
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                activeChart === 'installment'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveChart('installment')}
            >
              Parcelas
            </button>
            <button
              className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                activeChart === 'composition'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveChart('composition')}
            >
              Composição
            </button>
            {amortizationResults && (
              <button
                className={`mr-2 inline-block py-2 px-4 border-b-2 font-medium text-sm ${
                  activeChart === 'savings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveChart('savings')}
              >
                Economia
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          {chartConfigs[activeChart].title}
        </h3>
        
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'balance' || activeChart === 'installment' ? (
              <LineChart data={combinedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Mês', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ 
                    value: chartConfigs[activeChart].yAxisLabel, 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                  tickFormatter={(value) => formatCurrency(value).substring(0, 4) + '...'}
                  domain={chartConfigs[activeChart].yDomain}
                />
                <Tooltip 
                  formatter={(value) => [chartConfigs[activeChart].tooltip(value), null]}
                  labelFormatter={(label) => `Mês ${label}`}
                />
                <Legend />
                {chartConfigs[activeChart].lines.map((line) => (
                  <Line
                    key={line.key}
                    type="monotone"
                    dataKey={line.key}
                    name={line.name}
                    stroke={line.color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    strokeDasharray={line.dashed ? '5 5' : null}
                    connectNulls
                    activeDot={{ r: 5 }}
                  />
                ))}
              </LineChart>
            ) : activeChart === 'composition' ? (
              <AreaChart data={amortChartData.length > 0 ? amortChartData : basicChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Mês', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ 
                    value: chartConfigs[activeChart].yAxisLabel, 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                  tickFormatter={(value) => formatCurrency(value).substring(0, 4) + '...'}
                />
                <Tooltip 
                  formatter={(value) => [chartConfigs[activeChart].tooltip(value), null]}
                  labelFormatter={(label) => `Mês ${label}`}
                />
                <Legend />
                {chartConfigs[activeChart].stacks.map((stack) => (
                  <Area
                    key={stack.key}
                    type="monotone"
                    dataKey={stack.key}
                    name={stack.name}
                    stackId="1"
                    stroke={stack.color}
                    fill={stack.color}
                  />
                ))}
              </AreaChart>
            ) : (
              <BarChart data={combinedDataTrimmed} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Mês', position: 'insideBottomRight', offset: -10 }} 
                />
                <YAxis 
                  label={{ 
                    value: chartConfigs[activeChart].yAxisLabel, 
                    angle: -90, 
                    position: 'insideLeft' 
                  }}
                  tickFormatter={(value) => formatCurrency(Math.abs(value)).substring(0, 4) + '...'}
                />
                <Tooltip 
                  formatter={(value) => [chartConfigs[activeChart].tooltip(value), null]}
                  labelFormatter={(label) => `Mês ${label}`}
                />
                <Legend />
                {chartConfigs[activeChart].bars.map((bar) => (
                  <Bar
                    key={bar.key}
                    dataKey={bar.key}
                    name={bar.name}
                    fill={bar.color}
                  />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          {activeChart === 'balance' && (
            <p>Este gráfico mostra a evolução do saldo devedor ao longo do financiamento. 
               A curva laranja mostra o impacto das amortizações extras, reduzindo o saldo mais rapidamente.</p>
          )}
          {activeChart === 'installment' && (
            <p>Este gráfico mostra a evolução do valor das parcelas. 
               No sistema SAC as parcelas são naturalmente decrescentes, enquanto no PRICE são fixas.</p>
          )}
          {activeChart === 'composition' && (
            <p>Este gráfico mostra como cada parcela é composta, dividida entre juros, amortização e seguro. 
               No início do financiamento, a maior parte da parcela é composta por juros.</p>
          )}
          {activeChart === 'savings' && (
            <p>Este gráfico mostra a economia gerada pelas amortizações extras, tanto na redução do saldo 
               quanto das parcelas, em comparação com o financiamento padrão.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartTabs;