import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';

const COLORS = ['#3B82F6', '#F87171', '#FBBF24', '#06B6D4', '#8B5CF6'];

const ChartTabs = ({ basicResults, amortizationResults, principal, formatCurrency }) => {
  const [activeTab, setActiveTab] = useState('comparativo');

  // Se não houver amortização, não renderizar nada
  if (!basicResults || !amortizationResults) return null;

  // Tabs configuration
  const tabs = [
    { id: 'comparativo', name: 'Comparativo' },
    { id: 'saldo', name: 'Saldo Devedor' },
    { id: 'composicao', name: 'Composição' },
    { id: 'parcelas', name: 'Evolução das Parcelas' }
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-semibold mb-1 text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600 mr-4">{entry.name}:</span>
              <span className="font-medium text-primary-700">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render different charts based on active tab
  const renderChart = () => {
    switch (activeTab) {
      case 'parcelas':
        return (
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Evolução das Parcelas</h3>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={basicResults?.schedule?.map((item, index) => ({
                month: item.month,
                semAmortizacao: item.parcela,
                comAmortizacao: amortizationResults?.schedule[index]?.parcela
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="semAmortizacao"
                  name="Sem Amortização"
                  stroke={COLORS[0]}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="comAmortizacao"
                  name="Com Amortização"
                  stroke={COLORS[1]}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case 'saldo':
        return (
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Evolução do Saldo Devedor</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={basicResults?.schedule?.map((item, index) => ({
                month: item.month,
                semAmortizacao: item.saldoDevedor,
                comAmortizacao: amortizationResults?.schedule[index]?.saldoDevedor
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="semAmortizacao"
                  name="Sem Amortização"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="comAmortizacao"
                  name="Com Amortização"
                  stroke={COLORS[1]}
                  fill={COLORS[1]}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        );

      case 'composicao':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80">
              <h3 className="text-lg font-semibold mb-4 text-center">Sem Amortização</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Principal', value: principal },
                      { name: 'Juros', value: basicResults.totalInterest },
                      { name: 'Taxas/Seguros', value: basicResults.totalInsurance }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[COLORS[0], COLORS[1], COLORS[2]].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="h-80">
              <h3 className="text-lg font-semibold mb-4 text-center">Com Amortização</h3>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Principal', value: principal },
                      { name: 'Juros', value: amortizationResults?.totalInterest || 0 },
                      { name: 'Taxas/Seguros', value: amortizationResults?.totalInsurance || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[COLORS[0], COLORS[1], COLORS[2]].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        );

      case 'comparativo':
        const comparisonData = [
          {
            categoria: 'Total de Juros',
            semAmortizacao: basicResults.totalInterest,
            comAmortizacao: amortizationResults?.totalInterest || 0
          },
          {
            categoria: 'Total de Seguros',
            semAmortizacao: basicResults.totalInsurance,
            comAmortizacao: amortizationResults?.totalInsurance || 0
          },
          {
            categoria: 'Total Pago',
            semAmortizacao: basicResults.totalPaid,
            comAmortizacao: amortizationResults?.totalPaid || 0
          },
          {
            categoria: 'Primeira Parcela',
            semAmortizacao: basicResults.firstInstallment,
            comAmortizacao: amortizationResults?.firstInstallment || 0
          },
          {
            categoria: 'Última Parcela',
            semAmortizacao: basicResults.lastInstallment,
            comAmortizacao: amortizationResults?.lastInstallment || 0
          }
        ];

        return (
          <div className="h-80">
            <h3 className="text-lg font-semibold mb-4 text-center">Comparativo Sem vs Com Amortização</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="categoria" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="semAmortizacao" name="Sem Amortização" fill={COLORS[0]} />
                <Bar dataKey="comAmortizacao" name="Com Amortização" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="flex space-x-4 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 px-4 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ease-in-out
              ${activeTab === tab.id
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50 hover:bg-blue-600 hover:shadow-blue-600/50'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Chart content */}
      <div className="mt-6 p-4 bg-white rounded-lg">
        {renderChart()}
      </div>
    </div>
  );
};

export default ChartTabs;
