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
  AreaChart,
  Area
} from 'recharts';

const SystemComparison = ({ comparisonResults, formatCurrency, chartData }) => {
  const [activeChart, setActiveChart] = useState('balance');
  
  if (!comparisonResults) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <p>Calculando comparação...</p>
      </div>
    );
  }
  
  // Extract data
  const { sac, price, difference } = comparisonResults;
  
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comparison Table */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Comparação de Resultados</h3>
          <div className="overflow-hidden border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">SAC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">PRICE</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Diferença</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total Pago</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600 font-medium">{formatCurrency(sac.totalPaid)}</td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-600 font-medium">{formatCurrency(price.totalPaid)}</td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${difference.totalPaid < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(difference.totalPaid))}
                    <span className="text-xs ml-1">
                      {difference.totalPaid < 0 ? '(PRICE é mais caro)' : '(SAC é mais caro)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Total de Juros</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(sac.totalInterest)}</td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-600">{formatCurrency(price.totalInterest)}</td>
                  <td className={`px-4 py-3 text-sm text-right ${difference.totalInterest < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(difference.totalInterest))}
                    <span className="text-xs ml-1">
                      {difference.totalInterest < 0 ? '(PRICE paga mais)' : '(SAC paga mais)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Parcela Inicial</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(sac.firstInstallment)}</td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-600">{formatCurrency(price.firstInstallment)}</td>
                  <td className={`px-4 py-3 text-sm text-right ${difference.firstInstallment < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(difference.firstInstallment))}
                    <span className="text-xs ml-1">
                      {difference.firstInstallment < 0 ? '(PRICE é menor)' : '(SAC é menor)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Parcela Final</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">{formatCurrency(sac.lastInstallment)}</td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-600">{formatCurrency(price.lastInstallment)}</td>
                  <td className={`px-4 py-3 text-sm text-right ${difference.lastInstallment < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(Math.abs(difference.lastInstallment))}
                    <span className="text-xs ml-1">
                      {difference.lastInstallment < 0 ? '(PRICE é menor)' : '(SAC é menor)'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Prazo Total</td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600">{sac.totalPayments} meses</td>
                  <td className="px-4 py-3 text-sm text-right text-indigo-600">{price.totalPayments} meses</td>
                  <td className={`px-4 py-3 text-sm text-right ${difference.totalPayments < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(difference.totalPayments)} meses
                    <span className="text-xs ml-1">
                      {difference.totalPayments < 0 ? '(PRICE é mais longo)' : '(SAC é mais longo)'}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-gray-700 mb-2">Principais diferenças:</h4>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
              <li>
                O SAC tem parcelas <strong>decrescentes</strong>, começando mais altas e diminuindo ao longo do tempo.
              </li>
              <li>
                O PRICE tem parcelas <strong>fixas</strong> durante todo o financiamento.
              </li>
              <li>
                No longo prazo, o SAC geralmente resulta em <strong>menor custo total</strong> devido a juros menores.
              </li>
              <li>
                O PRICE tem <strong>parcelas iniciais menores</strong>, facilitando a aprovação do financiamento.
              </li>
              <li>
                No SAC, o saldo devedor diminui mais rapidamente no início, o que pode ser vantajoso para amortizações extras.
              </li>
            </ul>
          </div>
        </div>
        
        {/* Charts Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Gráficos Comparativos</h3>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  activeChart === 'balance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveChart('balance')}
              >
                Saldo Devedor
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${
                  activeChart === 'installment'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveChart('installment')}
              >
                Parcelas
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                {activeChart === 'balance' ? (
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Mês', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      label={{ value: 'Saldo (R$)', angle: -90, position: 'insideLeft', offset: 0 }}
                      tickFormatter={(value) => formatCurrency(value).substring(0, 4) + '...'}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), '']}
                      labelFormatter={(label) => `Mês ${label}`}
                    />
                    <Legend />
                    <Line 
                      name="SAC - Saldo Devedor" 
                      type="monotone" 
                      dataKey="sacBalance" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      name="PRICE - Saldo Devedor" 
                      type="monotone" 
                      dataKey="priceBalance" 
                      stroke="#8b5cf6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                ) : (
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      label={{ value: 'Mês', position: 'insideBottomRight', offset: -10 }} 
                    />
                    <YAxis 
                      label={{ value: 'Parcela (R$)', angle: -90, position: 'insideLeft', offset: 0 }}
                      tickFormatter={(value) => formatCurrency(value).substring(0, 4) + '...'}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), '']}
                      labelFormatter={(label) => `Mês ${label}`}
                    />
                    <Legend />
                    <Line 
                      name="SAC - Parcela" 
                      type="monotone" 
                      dataKey="sacInstallment" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                    <Line 
                      name="PRICE - Parcela" 
                      type="monotone" 
                      dataKey="priceInstallment" 
                      stroke="#8b5cf6" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
            <h4 className="text-md font-medium text-indigo-800 mb-2">Qual sistema escolher?</h4>
            <p className="text-sm text-indigo-700 mb-2">
              A escolha ideal depende da sua situação financeira atual e dos seus objetivos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white bg-opacity-70 p-3 rounded-md shadow-sm">
                <h5 className="font-medium text-blue-700 mb-1">Considere o SAC se:</h5>
                <ul className="list-disc pl-4 text-blue-600 space-y-1">
                  <li>Você pode arcar com parcelas iniciais maiores</li>
                  <li>Quer minimizar o custo total do financiamento</li>
                  <li>Planeja fazer amortizações extras</li>
                  <li>Prefere ver a parcela diminuir ao longo do tempo</li>
                </ul>
              </div>
              <div className="bg-white bg-opacity-70 p-3 rounded-md shadow-sm">
                <h5 className="font-medium text-indigo-700 mb-1">Considere o PRICE se:</h5>
                <ul className="list-disc pl-4 text-indigo-600 space-y-1">
                  <li>Seu orçamento é limitado no início</li>
                  <li>Você prefere parcelas previsíveis</li>
                  <li>Terá uma renda estável durante o financiamento</li>
                  <li>Precisa maximizar o valor financiado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemComparison;