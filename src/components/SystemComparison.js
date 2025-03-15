import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const SystemComparison = ({ comparisonResults, formatCurrency, chartData, term }) => {
  const [activeChart, setActiveChart] = useState('installments');
  
  if (!comparisonResults) return null;
  
  const { sac, price, difference } = comparisonResults;
  
  // Prepare data for pie charts
  const preparePieData = (systemData, systemName) => {
    return [
      { name: 'Juros', value: systemData.totalInterest, fill: '#3B82F6', system: systemName },
      { name: 'Amortização', value: systemData.totalPaid - systemData.totalInterest - systemData.totalInsurance, fill: '#F87171', system: systemName },
      { name: 'Taxas/Seguros', value: systemData.totalInsurance, fill: '#FBBF24', system: systemName }
    ];
  };
  
  // Prepare data for bar comparison chart
  const prepareBarData = () => {
    return [
      { name: 'Total de Juros', SAC: sac.totalInterest, PRICE: price.totalInterest, diff: Math.abs(difference.totalInterest) },
      { name: 'Total de Seguros', SAC: sac.totalInsurance, PRICE: price.totalInsurance, diff: Math.abs(difference.totalInterest) },
      { name: 'Total Pago', SAC: sac.totalPaid, PRICE: price.totalPaid, diff: Math.abs(difference.totalPaid) },
      { name: 'Primeira Parcela', SAC: sac.firstInstallment, PRICE: price.firstInstallment, diff: Math.abs(difference.firstInstallment) },
      { name: 'Última Parcela', SAC: sac.lastInstallment, PRICE: price.lastInstallment, diff: Math.abs(difference.lastInstallment) }
    ];
  };
  
  // Prepare data for radar chart
  const prepareRadarData = () => {
    // Normalize values to percentages for better radar visualization
    const maxPaid = Math.max(sac.totalPaid, price.totalPaid);
    const maxInterest = Math.max(sac.totalInterest, price.totalInterest);
    const maxFirstInstallment = Math.max(sac.firstInstallment, price.firstInstallment);
    const maxLastInstallment = Math.max(sac.lastInstallment, price.lastInstallment);
    
    return [
      {
        system: 'SAC',
        'Total Pago': (sac.totalPaid / maxPaid) * 100,
        'Total de Juros': (sac.totalInterest / maxInterest) * 100,
        'Primeira Parcela': (sac.firstInstallment / maxFirstInstallment) * 100,
        'Última Parcela': (sac.lastInstallment / maxLastInstallment) * 100,
      },
      {
        system: 'PRICE',
        'Total Pago': (price.totalPaid / maxPaid) * 100,
        'Total de Juros': (price.totalInterest / maxInterest) * 100,
        'Primeira Parcela': (price.firstInstallment / maxFirstInstallment) * 100,
        'Última Parcela': (price.lastInstallment / maxLastInstallment) * 100,
      }
    ];
  };
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-lg border border-gray-100 p-3">
          <p className="text-gray-900 font-medium">{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between mt-1">
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-600 text-sm">{entry.name}:</span>
              </div>
              <span className="text-gray-900 font-medium ml-4 text-sm">
                {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Toggle buttons for different chart views
  const ChartToggle = () => (
    <div className="flex justify-center flex-wrap gap-2 mb-6">
      <button
        onClick={() => setActiveChart('installments')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          activeChart === 'installments' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Evolução das Parcelas
      </button>
      <button
        onClick={() => setActiveChart('balance')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          activeChart === 'balance' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Saldo Devedor
      </button>
      <button
        onClick={() => setActiveChart('composition')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          activeChart === 'composition' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Composição
      </button>
      <button
        onClick={() => setActiveChart('comparison')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          activeChart === 'comparison' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Comparativo
      </button>
      <button
        onClick={() => setActiveChart('radar')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
          activeChart === 'radar' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
        }`}
      >
        Radar
      </button>
    </div>
  );
  
  // Render different chart based on active selection
  const renderChart = () => {
    switch (activeChart) {
      case 'balance':
        return (
          <div className="card p-4 h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Evolução do Saldo Devedor</h3>
            <ResponsiveContainer width="100%" height="90%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="sacBalance" 
                  name="Saldo SAC" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3} 
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
                <Area 
                  type="monotone" 
                  dataKey="priceBalance" 
                  name="Saldo PRICE" 
                  stroke="#F87171" 
                  fill="#F87171" 
                  fillOpacity={0.3} 
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'composition':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-4 h-80">
              <h3 className="text-lg font-semibold mb-4 text-center">Composição SAC</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={preparePieData(sac, 'SAC')}
                    nameKey="name"
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    animationDuration={1500}
                  >
                    {preparePieData(sac, 'SAC').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="card p-4 h-80">
              <h3 className="text-lg font-semibold mb-4 text-center">Composição PRICE</h3>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={preparePieData(price, 'PRICE')}
                    nameKey="name"
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    animationDuration={1500}
                  >
                    {preparePieData(price, 'PRICE').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
        
      case 'comparison':
        return (
          <div className="card p-4 h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Comparativo SAC vs PRICE</h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={prepareBarData()}
                margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="SAC" name="SAC" fill="#3B82F6" animationDuration={1500} />
                <Bar dataKey="PRICE" name="PRICE" fill="#F87171" animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'radar':
        return (
          <div className="card p-4 h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Radar Comparativo (valores em %)</h3>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart outerRadius={90} data={prepareRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="system" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="SAC" dataKey="SAC" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Radar name="PRICE" dataKey="PRICE" stroke="#F87171" fill="#F87171" fillOpacity={0.3} />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        );
        
      case 'installments':
      default:
        return (
          <div className="card p-4 h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Evolução das Parcelas</h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sacInstallment" 
                  name="Parcela SAC" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="priceInstallment" 
                  name="Parcela PRICE" 
                  stroke="#F87171" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card hover-shadow transition-all duration-300">
          <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="text-lg font-semibold text-blue-700">Sistema SAC</h3>
          </div>
          <div className="card-body">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Parcelas:</span>
                <span className="font-medium text-gray-900">{sac.totalPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primeira Parcela:</span>
                <span className="font-medium text-gray-900">{formatCurrency(sac.firstInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última Parcela:</span>
                <span className="font-medium text-gray-900">{formatCurrency(sac.lastInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Juros Total:</span>
                <span className="font-medium text-gray-900">{formatCurrency(sac.totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-semibold text-gray-800">Total Pago:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(sac.totalPaid)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card hover-shadow transition-all duration-300">
          <div className="card-header bg-gradient-to-r from-red-50 to-orange-50">
            <h3 className="text-lg font-semibold text-red-700">Sistema PRICE</h3>
          </div>
          <div className="card-body">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Parcelas:</span>
                <span className="font-medium text-gray-900">{price.totalPayments}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Primeira Parcela:</span>
                <span className="font-medium text-gray-900">{formatCurrency(price.firstInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última Parcela:</span>
                <span className="font-medium text-gray-900">{formatCurrency(price.lastInstallment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Juros Total:</span>
                <span className="font-medium text-gray-900">{formatCurrency(price.totalInterest)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                <span className="font-semibold text-gray-800">Total Pago:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(price.totalPaid)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mb-6 hover-shadow">
        <div className="card-header bg-gradient-to-r from-purple-50 to-indigo-50">
          <h3 className="text-lg font-semibold text-purple-700">Comparativo entre SAC e PRICE</h3>
        </div>
        <div className="card-body">
          <div className="bg-indigo-50 p-3 rounded-md mb-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-indigo-700">
                <p className="font-medium mb-1">Principais diferenças entre os sistemas:</p>
                <ul className="list-disc list-inside ml-1 space-y-1">
                  <li><span className="font-medium">SAC:</span> Amortização constante, parcelas decrescentes, maior impacto inicial no orçamento</li>
                  <li><span className="font-medium">PRICE:</span> Parcelas fixas, amortização crescente, mais juros pagos no total</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-gray-200 mb-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Característica</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-blue-600 uppercase tracking-wider">Sistema SAC</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-purple-600 uppercase tracking-wider">Sistema PRICE</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Diferença</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Total Pago */}
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Total Pago</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800 font-medium">{formatCurrency(sac.totalPaid)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800 font-medium">{formatCurrency(price.totalPaid)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${difference.totalPaid < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(difference.totalPaid)}
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {difference.totalPaid < 0 ? '(Economia com SAC)' : '(Economia com PRICE)'}
                      </span>
                    </span>
                  </td>
                </tr>
                
                {/* Total de Juros */}
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Total de Juros</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{formatCurrency(sac.totalInterest)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{formatCurrency(price.totalInterest)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${difference.totalInterest < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(difference.totalInterest)}
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {difference.totalInterest < 0 ? '(Favor do SAC)' : '(Favor do PRICE)'}
                      </span>
                    </span>
                  </td>
                </tr>
                
                {/* Total de Correção */}
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Total de Correção</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{formatCurrency(sac.totalCorrection || 0)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{formatCurrency(price.totalCorrection || 0)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${(sac.totalCorrection || 0) - (price.totalCorrection || 0) < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency((sac.totalCorrection || 0) - (price.totalCorrection || 0))}
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {(sac.totalCorrection || 0) - (price.totalCorrection || 0) < 0 ? '(Favor do SAC)' : '(Favor do PRICE)'}
                      </span>
                    </span>
                  </td>
                </tr>
                
                {/* Total de Seguros */}
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">Total de Seguros</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{formatCurrency(sac.totalInsurance)}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-800">{formatCurrency(price.totalInsurance)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <span className={`font-medium ${sac.totalInsurance - price.totalInsurance < 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(sac.totalInsurance - price.totalInsurance)}
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {sac.totalInsurance - price.totalInsurance < 0 ? '(Favor do SAC)' : '(Favor do PRICE)'}
                      </span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <ChartToggle />
        {renderChart()}
      </div>
      
      <div className="card p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
        <h3 className="text-lg font-semibold mb-3 text-indigo-700">Entendendo os Sistemas de Amortização</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Sistema SAC</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Amortização constante ao longo do tempo</li>
              <li>Parcelas decrescentes</li>
              <li>Primeira parcela mais alta</li>
              <li>Última parcela mais baixa</li>
              <li>Redução mais rápida do saldo devedor</li>
              <li>Normalmente resulta em menor total de juros</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-red-700 mb-2">Sistema PRICE</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Parcelas constantes (exceto por correção monetária)</li>
              <li>Primeira parcela mais baixa</li>
              <li>Redução mais lenta do saldo devedor no início</li>
              <li>Amortização crescente ao longo do tempo</li>
              <li>Juros decrescentes ao longo do tempo</li>
              <li>Facilita o planejamento financeiro por ter parcelas estáveis</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-indigo-100">
          <p className="text-sm text-gray-700">
            A escolha entre SAC e PRICE depende do seu perfil financeiro. Se você pode pagar uma parcela inicial mais alta e quer economizar no total de juros, o <span className="font-medium text-blue-700">SAC</span> pode ser melhor. Se precisa de uma parcela inicial menor e prefere parcelas fixas, o <span className="font-medium text-red-700">PRICE</span> pode ser mais adequado.
          </p>
        </div>
      </div>
      
      <div className="card p-6 bg-gradient-to-r from-yellow-50 to-orange-50">
        <h3 className="text-lg font-semibold mb-3 text-yellow-700">Comparativo de Parcelas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Primeira Parcela</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">SAC</p>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(sac.firstInstallment)}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">PRICE</p>
                <p className="text-lg font-semibold text-purple-600">{formatCurrency(price.firstInstallment)}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diferença:</span>
                <span className={`text-sm font-medium ${difference.firstInstallment > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(difference.firstInstallment)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 italic">
                {difference.firstInstallment > 0 
                  ? 'No sistema SAC, as primeiras parcelas são mais altas devido à amortização constante desde o início.' 
                  : 'No sistema PRICE, as parcelas são fixas durante todo o financiamento.'}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Última Parcela</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 bg-blue-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">SAC</p>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(sac.lastInstallment)}</p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg text-center">
                <p className="text-xs text-gray-500 mb-1">PRICE</p>
                <p className="text-lg font-semibold text-purple-600">{formatCurrency(price.lastInstallment)}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Diferença:</span>
                <span className={`text-sm font-medium ${difference.lastInstallment < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(difference.lastInstallment)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1 italic">
                {difference.lastInstallment < 0 
                  ? 'No sistema SAC, as últimas parcelas são significativamente menores que as iniciais.' 
                  : 'No sistema PRICE, o valor da parcela permanece o mesmo do início ao fim.'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-3 rounded-md mt-4 border border-yellow-100">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Como escolher o melhor sistema?</p>
              <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
                <li><span className="font-medium">Escolha o SAC</span> se puder arcar com parcelas maiores no início e busca pagar menos juros no total</li>
                <li><span className="font-medium">Escolha o PRICE</span> se precisa de previsibilidade orçamentária e prefere parcelas fixas</li>
                <li>Ambos os sistemas resultam no mesmo saldo devedor zero ao final do financiamento</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemComparison;