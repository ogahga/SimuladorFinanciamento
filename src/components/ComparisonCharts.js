import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar } from 'recharts';

const COLORS = ['#3B82F6', '#F87171', '#FBBF24', '#06B6D4', '#8B5CF6'];
const CHART_TYPES = ['pie', 'bar', 'area'];

const ComparisonCharts = ({ basicResults, amortizationResults, principal, formatCurrency }) => {
  const [chartType, setChartType] = useState('pie');
  const [animatedEntries, setAnimatedEntries] = useState([]);
  
  useEffect(() => {
    // Animação de entrada gradual para os dados dos gráficos
    const data = preparePieChartData(basicResults);
    const timeout = setTimeout(() => {
      setAnimatedEntries(data);
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [basicResults]);
  
  if (!basicResults) return null;
  
  // Prepara os dados para os gráficos de pizza
  const preparePieChartData = (results) => {
    if (!results) return [];
    
    // Calcular os percentuais
    const total = results.totalPaid;
    const financiado = principal / total;
    const juros = results.totalInterest / total;
    const seguros = results.totalInsurance / total;
    const correcao = results.totalCorrection / total;
    
    return [
      { name: 'Financiado', value: principal, percent: financiado, color: COLORS[0] },
      { name: 'Juros', value: results.totalInterest, percent: juros, color: COLORS[1] },
      { name: 'Taxas/Seguros', value: results.totalInsurance, percent: seguros, color: COLORS[2] },
      { name: 'Correção', value: results.totalCorrection, percent: correcao, color: COLORS[3] }
    ];
  };
  
  // Prepara dados para gráfico de barras empilhadas
  const prepareBarData = (basic, amort) => {
    const data = [
      {
        name: 'Sem Amortização',
        Financiado: principal,
        Juros: basic.totalInterest,
        Taxas: basic.totalInsurance,
        Correcao: basic.totalCorrection,
        Total: basic.totalPaid
      }
    ];
    
    if (amort) {
      data.push({
        name: 'Com Amortização',
        Financiado: principal,
        Juros: amort.totalInterest,
        Taxas: amort.totalInsurance,
        Correcao: amort.totalCorrection,
        Total: amort.totalPaid
      });
    }
    
    return data;
  };
  
  // Prepara dados para gráfico de área (evolução do pagamento ao longo do tempo)
  const prepareAreaData = (schedule) => {
    // Filtrar alguns pontos para não sobrecarregar o gráfico
    return schedule.filter((_, index) => index % Math.max(1, Math.floor(schedule.length / 25)) === 0)
      .map(row => ({
        month: row.month,
        parcela: row.parcela,
        juros: row.juros,
        amortizacao: row.amortizacaoMensal,
        seguro: row.seguro
      }));
  };
  
  // Custom tooltip para os gráficos
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-100">
          <p className="font-semibold mb-1 text-gray-800">{payload[0].name}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-gray-600 mr-4">{entry.name}:</span>
              <span className="font-medium text-primary-700">{formatCurrency(entry.value)}</span>
            </div>
          ))}
          {payload[0].payload.percent !== undefined && (
            <p className="mt-1 text-sm text-gray-500">
              {`${(payload[0].payload.percent * 100).toFixed(2)}% do total`}
            </p>
          )}
        </div>
      );
    }
    return null;
  };
  
  // Componente de botão para trocar tipo de gráfico
  const ChartTypeSelector = () => (
    <div className="flex space-x-2 mb-4 justify-center">
      {CHART_TYPES.map(type => (
        <button 
          key={type}
          onClick={() => setChartType(type)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            chartType === type 
              ? 'bg-primary-600 text-white shadow-sm' 
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {type === 'pie' && 'Gráfico Pizza'}
          {type === 'bar' && 'Gráfico Barras'}
          {type === 'area' && 'Evolução Temporal'}
        </button>
      ))}
    </div>
  );
  
  // Componente para mostrar o gráfico de pizza
  const CompositionPieChart = ({ data, title }) => {
    return (
      <div className="card h-full animate-fade-in">
        <div className="card-header">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                animationBegin={200}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Componente para mostrar o gráfico de barras
  const CompositionBarChart = ({ data, title }) => {
    return (
      <div className="card h-full animate-fade-in">
        <div className="card-header">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Financiado" stackId="a" fill={COLORS[0]} />
              <Bar dataKey="Juros" stackId="a" fill={COLORS[1]} />
              <Bar dataKey="Taxas" stackId="a" fill={COLORS[2]} />
              <Bar dataKey="Correcao" stackId="a" fill={COLORS[3]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Componente para mostrar o gráfico de área (evolução temporal)
  const EvolutionAreaChart = ({ data, title }) => {
    return (
      <div className="card h-full animate-fade-in">
        <div className="card-header">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="parcela" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.3} />
              <Area type="monotone" dataKey="juros" stroke={COLORS[1]} fill={COLORS[1]} fillOpacity={0.3} />
              <Area type="monotone" dataKey="amortizacao" stroke={COLORS[2]} fill={COLORS[2]} fillOpacity={0.3} />
              <Area type="monotone" dataKey="seguro" stroke={COLORS[3]} fill={COLORS[3]} fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Componente para mostrar o gráfico de evolução das parcelas
  const InstallmentEvolutionChart = ({ schedule, title }) => {
    // Filtrar alguns pontos para não sobrecarregar o gráfico
    const filteredData = schedule.filter((_, index) => index % Math.max(1, Math.floor(schedule.length / 25)) === 0);
    
    return (
      <div className="card h-full">
        <div className="card-header">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="card-body h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="parcela" 
                stroke={COLORS[0]} 
                name="Parcela" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
              <Line 
                type="monotone" 
                dataKey="amortizacaoMensal" 
                stroke={COLORS[1]} 
                name="Amortização" 
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
  
  // Seção de economia quando houver amortizações
  const SavingsSection = () => {
    if (!amortizationResults || !amortizationResults.savings) return null;
    
    const savings = amortizationResults.savings;
    
    return (
      <div className="card mb-6 animate-slide-up">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-green-700">Economia Gerada com Amortizações</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
              <h4 className="text-sm font-medium text-green-700 mb-1">Economia em Juros</h4>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(savings.juros)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
              <h4 className="text-sm font-medium text-green-700 mb-1">Economia em Seguros</h4>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(savings.seguros)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
              <h4 className="text-sm font-medium text-green-700 mb-1">Economia em Correção</h4>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(savings.correcao)}</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-lg border border-green-200 shadow-sm hover-up hover-shadow">
              <h4 className="text-sm font-medium text-green-800 mb-1">Economia Total</h4>
              <p className="text-2xl font-bold text-green-700">{formatCurrency(savings.total)}</p>
              <p className="text-sm text-green-600 mt-1">
                {savings.tempoMeses} meses economizados
                <span className="inline-block ml-1 mt-1 badge badge-success">
                  {savings.tempoAnos} anos
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Renderização condicional baseada no tipo de gráfico selecionado
  const renderCharts = () => {
    switch (chartType) {
      case 'bar':
        return (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <CompositionBarChart 
              data={prepareBarData(basicResults, amortizationResults)} 
              title="Comparativo de Composição do Financiamento" 
            />
          </div>
        );
        
      case 'area':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <EvolutionAreaChart 
              data={prepareAreaData(basicResults.schedule)} 
              title="Evolução Temporal sem Antecipação" 
            />
            {amortizationResults ? (
              <EvolutionAreaChart 
                data={prepareAreaData(amortizationResults.schedule)} 
                title="Evolução Temporal com Antecipação" 
              />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <p className="text-gray-500 text-center p-6">
                  Adicione amortizações para visualizar a evolução temporal com antecipação.
                </p>
              </div>
            )}
          </div>
        );
        
      case 'pie':
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <CompositionPieChart 
              data={animatedEntries} 
              title="Composição do Financiamento sem Antecipação" 
            />
            {amortizationResults ? (
              <CompositionPieChart 
                data={preparePieChartData(amortizationResults)} 
                title="Composição do Financiamento com Antecipação" 
              />
            ) : (
              <div className="card h-full flex items-center justify-center">
                <p className="text-gray-500 text-center p-6">
                  Adicione amortizações para visualizar a composição do financiamento com antecipação.
                </p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="mt-8">
      {/* A seção SavingsSection foi movida para o componente LoanSimulator */}
      
      <ChartTypeSelector />
      
      {renderCharts()}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <InstallmentEvolutionChart 
          schedule={basicResults.schedule} 
          title="Evolução das Parcelas sem Antecipação" 
        />
        {amortizationResults ? (
          <InstallmentEvolutionChart 
            schedule={amortizationResults.schedule} 
            title="Evolução das Parcelas com Antecipação" 
          />
        ) : (
          <div className="card h-full flex items-center justify-center">
            <p className="text-gray-500 text-center p-6">
              Adicione amortizações para visualizar a evolução das parcelas com antecipação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonCharts;