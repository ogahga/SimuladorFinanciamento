// Importar as funções de simulação
import {
  formatCurrency,
  formatMonth,
  expandAmortizationRanges,
  simulateSac,
  simulatePrice,
  calculateAmortizationForTargetTerm,
  calculateTotalSavings,
  calculateSimulationSummary
} from './simulationUtils';

// Importações do React e componentes
import React, { useState, useEffect } from 'react';
import Modal from './components/Modal';
import InputForms from './components/InputForms';
import AmortizationTable from './components/AmortizationTable';
import FinanceSummary from './components/FinanceSummary';
import ChartTabs from './components/ChartTabs';
import TargetTermSimulator from './components/TargetTermSimulator';
import About from './components/About';
import AIReport from './components/reports/AIReport';
import SystemComparison from './components/SystemComparison';
import DatabaseIntegration from './components/DatabaseIntegration';

const LoanSimulator = () => {
  // State para valores de entrada
  const [principal, setPrincipal] = useState(100000);
  const [term, setTerm] = useState(100);
  const [annualInterest, setAnnualInterest] = useState(0.1268);
  const [annualCorrection, setAnnualCorrection] = useState(0);  // Valor zerado por padrão
  const [insurance, setInsurance] = useState(0);  // Valor zerado por padrão
  const [system, setSystem] = useState("sac");
  
  // State para modais e comparação
  const [targetTermModalOpen, setTargetTermModalOpen] = useState(false);
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [amortizationModalOpen, setAmortizationModalOpen] = useState(false);
  const [aiReportModalOpen, setAiReportModalOpen] = useState(false);
  
  // State para resultados da simulação
  const [basicResults, setBasicResults] = useState(null);
  const [amortizationResults, setAmortizationResults] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [chartData, setChartData] = useState([]);
  
  // State para amortização
  const [amortizations, setAmortizations] = useState([]);
  const [amortizationError, setAmortizationError] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);
  const [tableEditingIndex, setTableEditingIndex] = useState(-1);
  const [editingMonth, setEditingMonth] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [editingType, setEditingType] = useState("prazo");
  const [activeTab, setActiveTab] = useState('sem');
  const [selectedMonth, setSelectedMonth] = useState(null);
  
  // State para prazo alvo
  const [targetTerm, setTargetTerm] = useState(term.toString());
  const [targetAmortMonths, setTargetAmortMonths] = useState(`1-${term}`);
  const [targetAmortType, setTargetAmortType] = useState("prazo");
  const [targetResults, setTargetResults] = useState(null);
  
  // Executar simulação básica quando inputs mudam
  useEffect(() => {
    if (principal > 0 && term > 0 && annualInterest > 0) {
      runBasicSimulation();
    }
  }, [principal, term, annualInterest, annualCorrection, insurance, system]);
  
  // Atualizar targetTerm quando termo muda
  useEffect(() => {
    if (targetTermModalOpen) {
      const termStr = term.toString();
      setTargetTerm(termStr);
      setTargetAmortMonths(`1-${termStr}`);
    }
  }, [targetTermModalOpen, term]);
  
  // Executar comparação de sistemas quando o modal abre
  useEffect(() => {
    if (comparisonModalOpen) {
      runSystemComparison();
    }
  }, [comparisonModalOpen]);

  // Atualizar tab quando os resultados da amortização mudarem
  useEffect(() => {
    if (amortizationResults) {
      setActiveTab('com');
    } else if (amortizations.length === 0) {
      setActiveTab('sem');
    }
  }, [amortizationResults, amortizations]);

  // Reset amortization error when modal is closed
  useEffect(() => {
    if (!amortizationModalOpen) {
      setAmortizationError('');
    }
  }, [amortizationModalOpen]);

  // Formatar data a partir do mês
  const formatMonthDate = (month) => {
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  // Formatar data da última parcela
  const formatLastPaymentDate = (totalMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() + totalMonths - 1);
    
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", 
                   "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    
    return `${months[date.getMonth()]} de ${date.getFullYear()}`;
  };

  // Executar simulação básica
  const runBasicSimulation = () => {
    console.log("Executando simulação básica com sistema:", system, "e prazo:", term);
    const simulateFunc = system === "sac" ? simulateSac : simulatePrice;
    const { schedule, fixedInstallment, totalPayments } = simulateFunc(
      principal, term, annualInterest, annualCorrection, insurance, {}
    );
    
    const summary = calculateSimulationSummary(schedule, fixedInstallment, totalPayments, system);
    
    // Guarda o resultado da simulação básica
    setBasicResults(summary);
    
    // Preparar dados para gráficos
    const chartData = schedule.filter((_, index) => index % 12 === 0 || index === schedule.length - 1)
      .map(row => ({
        month: row.month,
        balance: row.saldoDevedor,
        installment: row.parcela,
        interest: row.juros,
        amortization: row.amortizacaoMensal,
        date: formatMonth(row.month)
      }));
    
    // Se houver amortizações, executar simulação com elas também
    // Importante: isso garante que a simulação com amortizações estará 
    // sincronizada com o sistema selecionado atual
    if (amortizations.length > 0) {
      console.log("Executando simulação com amortizações após mudança na simulação básica");
      
      // Filtrar para manter apenas amortizações dentro do novo prazo
      const filteredAmortizations = amortizations.filter(amort => {
        if (amort.month.includes('-')) {
          const [start] = amort.month.split('-').map(Number);
          return start <= term;
        } else if (amort.month.includes(',')) {
          const months = amort.month.split(',').map(m => parseInt(m.trim()));
          return months.some(m => m <= term);
        } else {
          return parseInt(amort.month) <= term;
        }
      });
      
      // Ajustar amortizações para garantir que estão dentro do novo prazo
      const adjustedAmortizations = filteredAmortizations.map(amort => {
        if (amort.month.includes('-')) {
          const [start, end] = amort.month.split('-').map(Number);
          const newEnd = Math.min(end, term);
          return { ...amort, month: `${start}-${newEnd}` };
        } else if (amort.month.includes(',')) {
          const validMonths = amort.month.split(',').map(m => parseInt(m.trim()))
            .filter(m => m <= term)
            .join(',');
          return { ...amort, month: validMonths };
        }
        
        return amort;
      });
      
      if (adjustedAmortizations.length !== amortizations.length) {
        console.log("Algumas amortizações foram removidas por estarem fora do novo prazo");
        console.log("Antes:", amortizations.length, "Depois:", adjustedAmortizations.length);
      }
      
      // Atualizar o estado com as amortizações ajustadas
      if (JSON.stringify(amortizations) !== JSON.stringify(adjustedAmortizations)) {
        setAmortizations(adjustedAmortizations);
      }
      
      // Executar com as amortizações filtradas
      if (adjustedAmortizations.length > 0) {
        runAmortizationSimulationWithConfig(adjustedAmortizations, summary);
      } else {
        // Se todas as amortizações foram filtradas, limpar resultados
        setAmortizationResults(null);
      }
    }
  };
  
  // Executar simulação com amortizações extras
  const runAmortizationSimulation = (configData = null) => {
    // Se for uma chamada direta com configuração (objeto), processar dados
    if (configData && typeof configData === 'object' && !Array.isArray(configData)) {
      console.log("Executando simulação direta com configuração:", configData);
      const { valor, taxa, prazo, sistema, taxa_seguro, taxa_admin, amortizacoes } = configData;
      
      // Converter amortizações para o formato esperado
      const amortizationConfig = {};
      amortizacoes.forEach(amort => {
        amortizationConfig[amort.month] = {
          value: amort.value,
          type: amort.type
        };
      });
      
      // Expandir para meses individuais
      const extraAmortizations = expandAmortizationRanges(amortizationConfig);
      
      // Executar simulação
      const simulateFunc = sistema === "sac" ? simulateSac : simulatePrice;
      const { schedule, fixedInstallment, totalPayments } = simulateFunc(
        valor, prazo, taxa, taxa_admin, taxa_seguro, extraAmortizations
      );
      
      // Retornar resultado com prazoTotal
      return {
        schedule,
        fixedInstallment,
        totalPayments,
        prazoTotal: schedule.length // Definir prazoTotal como o comprimento final da tabela
      };
    }
    
    // Verificar se há amortizações configuradas
    if (amortizations.length === 0) {
      console.log("Não há amortizações configuradas para simular.");
      return null;
    }
    
    // Filtrar amortizações para garantir que estão dentro do prazo atual
    const filteredAmortizations = amortizations.filter(amort => {
      if (amort.month.includes('-')) {
        const [start] = amort.month.split('-').map(Number);
        return start <= term;
      } else if (amort.month.includes(',')) {
        const months = amort.month.split(',').map(m => parseInt(m.trim()));
        return months.some(m => m <= term);
      } else {
        return parseInt(amort.month) <= term;
      }
    });
    
    // Ajustar amortizações para garantir que estão dentro do prazo atual
    const adjustedAmortizations = filteredAmortizations.map(amort => {
      if (amort.month.includes('-')) {
        const [start, end] = amort.month.split('-').map(Number);
        const newEnd = Math.min(end, term);
        return { ...amort, month: `${start}-${newEnd}` };
      } else if (amort.month.includes(',')) {
        const validMonths = amort.month.split(',').map(m => parseInt(m.trim()))
          .filter(m => m <= term)
          .join(',');
        return { ...amort, month: validMonths };
      }
      return amort;
    });
    
    // Atualizar amortizações se necessário
    if (JSON.stringify(adjustedAmortizations) !== JSON.stringify(amortizations)) {
      setAmortizations(adjustedAmortizations);
    }
    
    // Se não houver amortizações válidas após a filtragem, limpar resultados
    if (adjustedAmortizations.length === 0) {
      console.log("Nenhuma amortização válida após filtragem.");
      setAmortizationResults(null);
      return null;
    }
    
    // Executar simulação com as amortizações ajustadas
    // E armazenar o resultado para retornar
    const currentBasicResults = null;
    const baseResultsToUse = currentBasicResults || basicResults;
    
    if (!baseResultsToUse) {
      console.log("Não há simulação básica disponível para comparar.");
      return null;
    }
    
    // Converter amortizações para o formato esperado
    const amortizationConfig = {};
    adjustedAmortizations.forEach(amort => {
      amortizationConfig[amort.month] = {
        value: amort.value,
        type: amort.type
      };
    });
    
    // Expandir para meses individuais
    const extraAmortizations = expandAmortizationRanges(amortizationConfig);
    
    // Executar simulação
    const simulateFunc = system === "sac" ? simulateSac : simulatePrice;
    const { schedule, fixedInstallment, totalPayments } = simulateFunc(
      principal, term, annualInterest, annualCorrection, insurance, extraAmortizations
    );
    
    const summary = calculateSimulationSummary(schedule, fixedInstallment, totalPayments, system);
    
    // Armazenar resultado no estado
    runAmortizationSimulationWithConfig(adjustedAmortizations, currentBasicResults);
    
    // Retornar o resultado com prazoTotal
    return {
      ...summary,
      prazoTotal: schedule.length // Definir prazoTotal como o comprimento final da tabela
    };
  };
  
  // Executar simulação com uma configuração de amortização específica
  const runAmortizationSimulationWithConfig = (amortizationList, currentBasicResults = null) => {
    // Usar o resultado básico fornecido ou o do estado
    const baseResultsToUse = currentBasicResults || basicResults;
    
    // Verificar se temos um resultado básico válido para comparar
    if (!baseResultsToUse) {
      console.log("Não há simulação básica disponível para comparar.");
      return;
    }
    
    console.log("Executando simulação com configuração de amortização, sistema:", system);
    console.log("Usando para comparação basicResults com sistema:", baseResultsToUse.system);
    
    // Converter amortizações para o formato esperado
    const amortizationConfig = {};
    amortizationList.forEach(amort => {
      console.log("Configurando amortização para:", amort.month, "com valor:", amort.value);
      amortizationConfig[amort.month] = {
        value: amort.value,
        type: amort.type
      };
    });
    
    // Expandir para meses individuais
    const extraAmortizations = expandAmortizationRanges(amortizationConfig);
    console.log("Meses expandidos:", Object.keys(extraAmortizations).length, "meses");
    
    // Executar simulação
    const simulateFunc = system === "sac" ? simulateSac : simulatePrice;
    const { schedule, fixedInstallment, totalPayments } = simulateFunc(
      principal, term, annualInterest, annualCorrection, insurance, extraAmortizations
    );
    
    const summary = calculateSimulationSummary(schedule, fixedInstallment, totalPayments, system);
    
    // Calcular economia em comparação com simulação básica
    // Garantir que a comparação é feita entre simulações com o mesmo sistema
    if (baseResultsToUse.system === system) {
      const savings = calculateTotalSavings(baseResultsToUse, summary);
      summary.savings = savings;
      console.log("Economia calculada com sucesso usando o mesmo sistema");
    } else {
      console.log("Sistema básico diferente do sistema atual, recalculando simulação básica");
      // Recalcular simulação básica com o sistema atual
      const simulateFuncBase = system === "sac" ? simulateSac : simulatePrice;
      const baseResults = simulateFuncBase(
        principal, term, annualInterest, annualCorrection, insurance, {}
      );
      const baseSummary = calculateSimulationSummary(
        baseResults.schedule, baseResults.fixedInstallment, baseResults.totalPayments, system
      );
      
      // Atualizar basicResults no estado com o novo resultado
      setBasicResults(baseSummary);
      
      // Calcular economia com a simulação básica recém-calculada
      const savings = calculateTotalSavings(baseSummary, summary);
      summary.savings = savings;
      console.log("Economia recalculada com simulação básica atualizada");
    }
    
    setAmortizationResults(summary);
  };
  
  // Limpar campos de edição
  const handleClearFields = () => {
    setEditingIndex(-1);
  };
  
  // Remover amortização
  const handleRemoveAmortization = (month) => {
    // Encontrar o índice da amortização que contém este mês
    const amortIndex = amortizations.findIndex(amort => {
      if (amort.month.includes('-')) {
        const [start, end] = amort.month.split('-').map(Number);
        return month >= start && month <= end;
      } else if (amort.month.includes(',')) {
        const months = amort.month.split(',').map(m => parseInt(m.trim()));
        return months.includes(month);
      } else {
        return parseInt(amort.month) === month;
      }
    });
    
    if (amortIndex !== -1) {
      const newAmortizations = [...amortizations];
      newAmortizations.splice(amortIndex, 1);
      setAmortizations(newAmortizations);
      
      // Limpar mensagem de erro ao remover amortização
      setAmortizationError("");
      
      // Se ainda houver amortizações, recalcular
      if (newAmortizations.length > 0) {
        runAmortizationSimulationWithConfig(newAmortizations);
      } else {
        // Se não houver amortizações, limpar resultados
        setAmortizationResults(null);
      }
    }
  };
  
  // Editar amortização
  const handleEditAmortization = (month, newValue) => {
    if (newValue) {
      // Edição inline da tabela
      const amortIndex = amortizations.findIndex(amort => {
        if (amort.month.includes('-')) {
          const [start, end] = amort.month.split('-').map(Number);
          return month >= start && month <= end;
        } else if (amort.month.includes(',')) {
          const months = amort.month.split(',').map(m => parseInt(m.trim()));
          return months.includes(month);
        } else {
          return parseInt(amort.month) === month;
        }
      });

      if (amortIndex !== -1) {
        const newAmortizations = [...amortizations];
        newAmortizations[amortIndex] = {
          ...newAmortizations[amortIndex],
          value: newValue
        };
        setAmortizations(newAmortizations);
        runAmortizationSimulationWithConfig(newAmortizations);
      }
    } else {
      // Abrir modal para edição completa
      const amort = amortizations.find(amort => {
        if (amort.month.includes('-')) {
          const [start, end] = amort.month.split('-').map(Number);
          return month >= start && month <= end;
        } else if (amort.month.includes(',')) {
          const months = amort.month.split(',').map(m => parseInt(m.trim()));
          return months.includes(month);
        } else {
          return parseInt(amort.month) === month;
        }
      });

      setSelectedMonth(month);
      if (amort) {
        setEditingValue(amort.value.toString());
        setEditingType(amort.type);
      } else {
        setEditingValue('');
        setEditingType('prazo');
      }
      setAmortizationModalOpen(true);
    }
  };

  // Salvar amortização do modal
  const handleSaveAmortization = (value, type) => {
    if (!selectedMonth || !value) return;

    // Validar se o mês está dentro do prazo do financiamento
    if (selectedMonth > term) {
      setAmortizationError("O mês da amortização não pode exceder o prazo do financiamento.");
      return;
    }

    // Validar se o valor não excede a dívida atual
    const monthEntry = basicResults.schedule[selectedMonth - 1];
    if (!monthEntry) return;

    if (value > monthEntry.saldoDevedor) {
      setAmortizationError("O valor da amortização não pode exceder o saldo devedor do mês.");
      return;
    }

    // Validar regras específicas do sistema
    if (system === 'sac') {
      // No SAC, removida validação de amortização mínima
    } else if (system === 'price') {
      // No Price, removida validação de amortização mínima
    }

    // Se for redução de prazo, simular para obter o novo prazo total
    let monthRange = selectedMonth.toString();
    if (type === 'prazo') {
      const simulatedAmortizations = [...amortizations];
      const existingIndex = simulatedAmortizations.findIndex(amort => 
        amort.month === selectedMonth.toString() || 
        (amort.month.includes('-') && amort.month.startsWith(selectedMonth.toString() + '-'))
      );

      const newAmort = { month: selectedMonth.toString(), value, type };
      if (existingIndex !== -1) {
        simulatedAmortizations[existingIndex] = newAmort;
      } else {
        simulatedAmortizations.push(newAmort);
      }

      // Simular o resultado com a nova amortização
      const simulation = runAmortizationSimulation({
        valor: principal,
        taxa: annualInterest,
        prazo: term,
        sistema: system,
        taxa_seguro: insurance,
        taxa_admin: annualCorrection,
        amortizacoes: simulatedAmortizations
      });

      // Verificar se a simulação foi realizada com sucesso e tem a propriedade prazoTotal
      if (!simulation || typeof simulation.prazoTotal === 'undefined') {
        console.error("Erro na simulação: prazoTotal não foi retornado");
        setAmortizationError("Erro na simulação. Por favor, tente novamente.");
        return;
      }

      if (simulation.prazoTotal < selectedMonth) {
        setAmortizationError("O valor da amortização reduziria o prazo para antes do mês atual.");
        return;
      }

      // Não criar um range, manter apenas o mês selecionado
      // monthRange = `${selectedMonth}-${simulation.prazoTotal}`;
    }

    const newAmortization = {
      month: monthRange,
      value,
      type
    };

    const newAmortizations = [...amortizations];
    const existingIndex = amortizations.findIndex(amort => 
      amort.month === selectedMonth.toString() || 
      (amort.month.includes('-') && amort.month.startsWith(selectedMonth.toString() + '-'))
    );

    if (existingIndex !== -1) {
      newAmortizations[existingIndex] = newAmortization;
    } else {
      newAmortizations.push(newAmortization);
    }

    setAmortizations(newAmortizations);
    setAmortizationModalOpen(false);
    setSelectedMonth(null);
    setEditingValue('');
    setEditingType('prazo');
    setAmortizationError('');
    runAmortizationSimulationWithConfig(newAmortizations);
  };
  
  // Aplicar amortizações do resultado do prazo alvo ao simulador
  const applyTargetAmortizationsToSimulator = () => {
    if (!targetResults || !targetResults.amortValue) return;
    
    // Criar nova amortização a partir do resultado do prazo alvo
    const newAmortization = {
      month: targetResults.amortMonths.join(","),
      value: targetResults.amortValue,
      type: targetResults.amortType
    };
    
    // Substitui todas as amortizações existentes
    setAmortizations([newAmortization]);
    
    // Fecha o modal
    setTargetTermModalOpen(false);
    
    // Executar simulação com a nova configuração
    runAmortizationSimulationWithConfig([newAmortization]);
  };
  
  // Handle para inputs de simulação
  const handleSimulationInputs = (values) => {
    setPrincipal(parseFloat(values.amount) || 0);
    setTerm(parseInt(values.term) || 0);
    setAnnualInterest((parseFloat(values.interestRate) || 0) / 100); // Converter de percentual
    setAnnualCorrection((parseFloat(values.correctionRate) || 0) / 100); // Converter de percentual
    setInsurance(parseFloat(values.insurance) || 0);
    setSystem(values.system);
  };
  
  // Handle para carregar simulação salva
  const handleLoadSimulation = (simulationData, loadedAmortizations) => {
    // Atualizar parâmetros do financiamento
    setPrincipal(parseFloat(simulationData.principal) || 0);
    setTerm(parseInt(simulationData.term) || 0);
    setAnnualInterest(parseFloat(simulationData.annualInterest) || 0);
    setAnnualCorrection(parseFloat(simulationData.annualCorrection) || 0);
    setInsurance(parseFloat(simulationData.insurance) || 0);
    setSystem(simulationData.system || 'sac');
    
    // Atualizar amortizações
    if (loadedAmortizations && loadedAmortizations.length > 0) {
      // Converter formato do banco para o formato do simulador
      const formattedAmortizations = loadedAmortizations.map(amort => ({
        month: amort.month,
        value: parseFloat(amort.value),
        type: amort.type
      }));
      
      setAmortizations(formattedAmortizations);
    } else {
      setAmortizations([]);
    }
    
    // Executar simulação básica que vai também atualizar com as amortizações
    setTimeout(() => {
      runBasicSimulation();
    }, 100);
  };

  // Executar comparação entre sistemas SAC e PRICE
  const runSystemComparison = () => {
    // Simulação SAC
    const { schedule: sacSchedule, fixedInstallment: sacFixedInstallment, totalPayments: sacTotalPayments } = 
      simulateSac(principal, term, annualInterest, annualCorrection, insurance, {});
    
    // Simulação PRICE - Forçar mesmo número de parcelas que o SAC
    const { schedule: priceScheduleTemp, fixedInstallment: priceFixedInstallment } = 
      simulatePrice(principal, term, annualInterest, annualCorrection, insurance, {});
    
    // Ajustar o número de parcelas do PRICE para ser igual ao do SAC
    let priceSchedule = priceScheduleTemp;
    let priceTotalPayments = sacSchedule.length;
    
    // Se o número de parcelas for diferente, ajustar para corresponder ao SAC
    if (priceSchedule.length !== sacSchedule.length) {
      if (priceSchedule.length > sacSchedule.length) {
        // Cortar o excesso de parcelas
        priceSchedule = priceSchedule.slice(0, sacSchedule.length);
        // Ajustar a última parcela se necessário
        if (priceSchedule.length > 0) {
          const lastEntry = priceSchedule[priceSchedule.length - 1];
          lastEntry.novoSaldo = 0; // Forçar saldo final zero
        }
      } else if (priceSchedule.length < sacSchedule.length) {
        // Estender para igualar o número de parcelas do SAC (raro, mas possível)
        const lastEntry = priceSchedule[priceSchedule.length - 1];
        for(let i = priceSchedule.length; i < sacSchedule.length; i++) {
          const copyEntry = {...lastEntry};
          copyEntry.month = i + 1;
          copyEntry.saldoDevedor = 0;
          copyEntry.novoSaldo = 0;
          copyEntry.amortizacaoMensal = 0;
          copyEntry.juros = 0;
          copyEntry.parcela = copyEntry.seguro; // Apenas seguro resta
          priceSchedule.push(copyEntry);
        }
      }
      priceTotalPayments = priceSchedule.length;
    }
    
    // Calcular resumos
    const sacSummary = calculateSimulationSummary(sacSchedule, sacFixedInstallment, sacTotalPayments, "sac");
    const priceSummary = calculateSimulationSummary(priceSchedule, priceFixedInstallment, priceTotalPayments, "price");
    
    // Preparar dados de comparação
    const comparisonData = {
      sac: sacSummary,
      price: priceSummary,
      difference: {
        totalPayments: sacSummary.totalPayments - priceSummary.totalPayments,
        totalInterest: sacSummary.totalInterest - priceSummary.totalInterest,
        totalPaid: sacSummary.totalPaid - priceSummary.totalPaid,
        firstInstallment: sacSummary.firstInstallment - priceSummary.firstInstallment,
        lastInstallment: sacSummary.lastInstallment - priceSummary.lastInstallment
      }
    };
    
    setComparisonResults(comparisonData);
    
    // Preparar dados para gráficos de comparação
    const comparisonChartData = [];
    const maxMonths = Math.max(sacSchedule.length, priceSchedule.length);
    
    for (let i = 0; i < maxMonths; i += 12) {
      const point = {
        month: i + 1,
        date: formatMonth(i + 1)
      };
      
      if (i < sacSchedule.length) {
        point.sacInstallment = sacSchedule[i].parcela;
        point.sacBalance = sacSchedule[i].saldoDevedor;
      }
      
      if (i < priceSchedule.length) {
        point.priceInstallment = priceSchedule[i].parcela;
        point.priceBalance = priceSchedule[i].saldoDevedor;
      }
      
      comparisonChartData.push(point);
    }
    
    // Adicionar último mês de cada se não for incluído
    if (sacSchedule.length - 1 % 12 !== 0) {
      const lastSac = sacSchedule[sacSchedule.length - 1];
      comparisonChartData.push({
        month: lastSac.month,
        date: formatMonth(lastSac.month),
        sacInstallment: lastSac.parcela,
        sacBalance: lastSac.saldoDevedor
      });
    }
    
    if (priceSchedule.length - 1 % 12 !== 0) {
      const lastPrice = priceSchedule[priceSchedule.length - 1];
      comparisonChartData.push({
        month: lastPrice.month,
        date: formatMonth(lastPrice.month),
        priceInstallment: lastPrice.parcela,
        priceBalance: lastPrice.saldoDevedor
      });
    }
    
    setChartData(comparisonChartData);
  };

  // Executar simulação de prazo alvo
  const runTargetTermSimulation = () => {
    // Parse dos meses de amortização
    const amortMonths = targetAmortMonths.split(',').map(range => range.trim());
    
    // Converter targetTerm para número
    const targetTermNumber = parseInt(targetTerm) || 0;
    
    // Calcular amortização necessária
    const { amortValue, finalTerm } = calculateAmortizationForTargetTerm(
      principal, term, targetTermNumber, annualInterest, annualCorrection,
      insurance, amortMonths, system, targetAmortType
    );
    
    if (amortValue > 0) {
      // Configurar amortizações com valor calculado
      const amortizationConfig = {};
      for (const month of amortMonths) {
        amortizationConfig[month] = {
          value: amortValue,
          type: targetAmortType,
          auto_generated: true
        };
      }
      
      // Expandir configuração
      const extraAmortizations = expandAmortizationRanges(amortizationConfig);
      
      // Executar simulação
      const simulateFunc = system === "sac" ? simulateSac : simulatePrice;
      const { schedule, fixedInstallment, totalPayments } = simulateFunc(
        principal, term, annualInterest, annualCorrection, insurance, extraAmortizations
      );
      
      const summary = calculateSimulationSummary(schedule, fixedInstallment, totalPayments, system);
      
      // Adicionar informações adicionais
      summary.targetTerm = targetTerm;
      summary.achievedTerm = totalPayments;
      summary.amortValue = amortValue;
      summary.amortMonths = amortMonths;
      summary.amortType = targetAmortType;
      
      // Calcular economia em comparação com simulação básica
      if (basicResults) {
        const savings = calculateTotalSavings(basicResults, summary);
        summary.savings = savings;
      }
      
      setTargetResults(summary);
    }
  };

  // Adicionar ou atualizar amortização
  const handleAddAmortization = (amortData) => {
    if (amortData.month && amortData.value) {
      // Verificar se o mês já tem uma amortização (ignorando a entrada que está sendo editada)
      let monthsToCheck = [];
      
      // Caso seja um range (ex: "1-3")
      if (amortData.month.includes('-')) {
        const [start, end] = amortData.month.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          monthsToCheck.push(i.toString());
        }
      } else if (amortData.month.includes(',')) {
        // Caso sejam meses separados por vírgula
        monthsToCheck = amortData.month.split(',').map(m => m.trim());
      } else {
        // Caso seja um mês único
        monthsToCheck.push(amortData.month);
      }
      
      // Verificar se algum dos meses já existe nas amortizações configuradas
      const conflictingMonths = [];
      
      amortizations.forEach((amort, index) => {
        // Ignorar a entrada que está sendo editada
        if (editingIndex !== -1 && index === editingIndex) {
          return;
        }
        
        let existingMonths = [];
        if (amort.month.includes('-')) {
          // Se for um range existente
          const [start, end] = amort.month.split('-').map(Number);
          for (let i = start; i <= end; i++) {
            existingMonths.push(i.toString());
          }
        } else if (amort.month.includes(',')) {
          // Se forem meses separados por vírgula
          existingMonths = amort.month.split(',').map(m => m.trim());
        } else {
          // Se for um mês único existente
          existingMonths.push(amort.month);
        }
        
        // Verificar interseção entre os conjuntos de meses
        for (const month of monthsToCheck) {
          if (existingMonths.includes(month)) {
            conflictingMonths.push(parseInt(month));
          }
        }
      });
      
      if (conflictingMonths.length > 0) {
        // Ordenar os meses em conflito
        conflictingMonths.sort((a, b) => a - b);
        setAmortizationError(`Não é possível adicionar mais de uma amortização no mesmo mês. Conflito nos meses: ${conflictingMonths.join(', ')}`);
        return;
      }
      
      // Limpar mensagem de erro caso existisse
      setAmortizationError("");
      
      // Criar uma variável para armazenar o array atualizado de amortizações
      let updatedAmortizations;
      
      if (editingIndex !== -1) {
        // Atualizando uma amortização existente
        updatedAmortizations = [...amortizations];
        updatedAmortizations[editingIndex] = amortData;
        setAmortizations(updatedAmortizations);
        setEditingIndex(-1); // Sai do modo de edição
      } else {
        // Adicionando uma nova amortização
        updatedAmortizations = [...amortizations, amortData];
        setAmortizations(updatedAmortizations);
      }
      
      // Executar simulação com as novas amortizações
      runAmortizationSimulationWithConfig(updatedAmortizations);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho e botões de ação */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Simulador de Financiamento</h2>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setTargetTermModalOpen(true)}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Simular Prazo Alvo
            </button>

            <button
              onClick={() => setComparisonModalOpen(true)}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4a1 1 0 011-1h4a1 1 0 010 2H6a1 1 0 01-1-1zm10 4a1 1 0 01-1 1h-4a1 1 0 010-2h4a1 1 0 011 1zM5 12a1 1 0 011-1h4a1 1 0 010 2H6a1 1 0 01-1-1zm10 4a1 1 0 01-1 1h-4a1 1 0 010-2h4a1 1 0 011 1z" clipRule="evenodd" />
              </svg>
              Comparação SAC vs PRICE
            </button>

            <button
              onClick={() => setAiReportModalOpen(true)}
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd" />
              </svg>
              Relatório IA
            </button>

            <button
              onClick={() => setAboutModalOpen(true)}
              className="btn btn-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              Sobre
            </button>
          </div>
        </div>
      </div>
      
      {/* Grid principal com 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coluna da esquerda - Formulários */}
        <div className="lg:col-span-1 space-y-6">
          {/* Formulário de parâmetros */}
          <div>
            <InputForms
              initialValues={{
                amount: principal,
                term: term,
                interestRate: annualInterest * 100,
                correctionRate: annualCorrection * 100,
                insurance: insurance,
                system: system
              }}
              onSubmit={handleSimulationInputs}
              amortizations={amortizations}
            />
          </div>
        </div>
        
        {/* Coluna da direita - Amortização */}
        <div className="lg:col-span-1 space-y-6">
          {/* Formulário de amortização com lista incorporada */}
          <div className="amortization-form-section space-y-0">
            <div className="card">
              <div className="card-header flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Amortizações Extras</h3>
                <button
                  onClick={() => {
                    // Adicionar nova linha vazia para edição
                    const newIndex = amortizations.length;
                    // Adicionar item temporário vazio
                    setAmortizations([...amortizations, {
                      month: '',
                      value: 0,
                      type: 'prazo'
                    }]);
                    // Iniciar edição na nova linha
                    setTimeout(() => {
                      setTableEditingIndex(newIndex);
                      setEditingMonth('');
                      setEditingValue('');
                      setEditingType('prazo');
                    }, 50);
                  }}
                  className="btn btn-primary flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Incluir Amortização
                </button>
              </div>
              <div className="card-body">
                <div>
                  <table className="min-w-full divide-y divide-gray-200 bg-white border rounded-lg shadow-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{width: "200px"}}>Mês/Range</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">Tipo</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {amortizations.map((amort, index) => {
                      // Modo de edição para esta linha
                      if (tableEditingIndex === index) {
                      return (
                      <tr key={index} className="bg-blue-50">
                      <td className="px-6 py-4" style={{width: "200px", maxWidth: "200px"}}>
                      <input 
                      type="text" 
                      value={editingMonth}
                      onChange={(e) => setEditingMonth(e.target.value)}
                      className="w-full p-1 border border-blue-300 rounded"
                      placeholder="ex: 12 ou 1-12"
                      />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">R$</span>
                      <input 
                      type="text" 
                      value={editingValue}
                      onChange={(e) => {
                      // Permitir apenas números e vírgula
                      const value = e.target.value.replace(/[^0-9,]/g, '');
                      setEditingValue(value);
                      }}
                      className="w-full p-1 pl-8 border border-blue-300 rounded"
                      placeholder="0,00"
                      />
                      </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                      <select
                      value={editingType}
                      onChange={(e) => setEditingType(e.target.value)}
                      className="w-full p-1 border border-blue-300 rounded"
                      >
                      <option value="prazo">Redução de Prazo</option>
                      <option value="parcela">Redução de Parcela</option>
                      </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex space-x-3 justify-center">
                      <button
                      onClick={() => {
                      // Salvar alterações
                      const valueNum = parseFloat(editingValue.replace(',', '.'));
                      if (editingMonth && !isNaN(valueNum)) {
                      console.log("Salvando amortização com mês/range:", editingMonth);
                      const updatedAmortizations = [...amortizations];
                      updatedAmortizations[index] = {
                      month: editingMonth,
                      value: valueNum,
                      type: editingType
                      };
                      setAmortizations(updatedAmortizations);
                      setTableEditingIndex(-1);
                      runAmortizationSimulationWithConfig(updatedAmortizations);
                      }
                      }}
                      className="text-green-600 hover:text-green-800 transition-colors"
                      title="Salvar"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      </button>
                      <button
                      onClick={() => {
                      setTableEditingIndex(-1);
                      // Se estiver editando um item reciém-adicionado sem dados, remova-o
                      if (amort.month === '') {
                      setAmortizations(amortizations.filter((_, i) => i !== index));
                      }
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Cancelar"
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      </button>
                      </div>
                      </td>
                      </tr>
                      );
                      }
                      // Modo de visualização normal
                      
                      // Filtrar meses para mostrar apenas os que estão dentro do prazo atual
                      // Se tivermos resultados de amortização, usar o prazo calculado como limite
                      const currentTerm = amortizationResults ? amortizationResults.totalPayments : term;
                      
                      // Verificar se algum dos meses dessa amortização está dentro do prazo atual
                      let monthsInString = amort.month.split(',');
                      let hasValidMonths = false;
                      
                      for (const monthItem of monthsInString) {
                      // Verificar se é um intervalo ou um mês único
                      if (monthItem.includes('-')) {
                      const [start, end] = monthItem.split('-').map(Number);
                      if (start <= currentTerm) {
                      hasValidMonths = true;
                      break;
                      }
                      } else {
                      // Mês único
                      const monthNum = parseInt(monthItem.trim());
                      if (monthNum <= currentTerm) {
                      hasValidMonths = true;
                      break;
                      }
                      }
                      }
                      
                      // Filtrar intervalos para mostrar apenas meses dentro do prazo
                      let displayMonth = amort.month;
                      if (amortizationResults) {
                      // Se for uma lista de meses separados por vírgula
                      if (amort.month.includes(',')) {
                      const validMonths = amort.month.split(',').map(m => m.trim())
                      .filter(m => {
                      if (m.includes('-')) {
                      const [start] = m.split('-').map(Number);
                      return start <= currentTerm;
                      }
                      return parseInt(m) <= currentTerm;
                      });
                      displayMonth = validMonths.join(',');
                      }
                      // Se não houver meses válidos após o filtro, não mostrar esta amortização
                      if (displayMonth === '') {
                      return null; // Pular esta amortização
                      }
                      }
                      
                        // Se nenhum mês válido, não mostrar esta linha
                            if (amortizationResults && !hasValidMonths) {
                              return null;
                            }
                            
                            return (
                              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-6 py-4 text-sm text-gray-700" style={{width: "200px", maxWidth: "200px", wordBreak: "break-word"}}>{displayMonth}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(amort.value)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {amort.type === 'prazo' ? 'Redução de Prazo' : 'Redução de Parcela'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                  <div className="flex space-x-3 justify-center">
                                    <button
                                      onClick={() => {
                                        // Iniciar edição na tabela
                                        setTableEditingIndex(index);
                                        setEditingMonth(amort.month);
                                        setEditingValue(amort.value.toString().replace('.', ','));
                                        setEditingType(amort.type);
                                      }}
                                      className="text-blue-600 hover:text-blue-800 transition-colors"
                                      title="Editar Amortização"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => {
                                        const newAmortizations = [...amortizations];
                                        newAmortizations.splice(index, 1);
                                        setAmortizations(newAmortizations);
                                        
                                        if (newAmortizations.length > 0) {
                                          runAmortizationSimulationWithConfig(newAmortizations);
                                        } else {
                                          setAmortizationResults(null);
                                        }
                                      }}
                                      className="text-red-600 hover:text-red-800 transition-colors"
                                      title="Remover Amortização"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      {amortizations.length === 0 && (
                        <tr>
                          <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                            Nenhuma amortização extra configurada. Clique no botão "Incluir Amortização" para adicionar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Opções de periodicidade - aparecem apenas durante edição */}
                {tableEditingIndex !== -1 && (
                  <div className="flex flex-wrap gap-2 mt-4 mb-2 justify-center border-t pt-4">
                    <span className="text-sm text-gray-500 mr-2 self-center">Período:</span>
                    <button
                      type="button"
                      onClick={() => {
                        // Gerar lista explícita de meses
                        let months = [];
                        const max = Math.min(term, 12);
                        for (let i = 1; i <= max; i += 1) {
                          months.push(i);
                        }
                        console.log("Meses gerados para mensal:", months);
                        setEditingMonth(months.join(','));
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >Mensal</button>
                    <button
                      type="button"
                      onClick={() => {
                        // Gerar lista explícita de meses
                        let months = [];
                        const max = Math.min(term, 360);
                        for (let i = 1; i <= max; i += 3) {
                          months.push(i);
                        }
                        console.log("Meses gerados para trimestral:", months);
                        setEditingMonth(months.join(','));
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >Trimestral</button>
                    <button
                      type="button"
                      onClick={() => {
                        // Gerar lista explícita de meses
                        let months = [];
                        const max = Math.min(term, 360);
                        for (let i = 1; i <= max; i += 6) {
                          months.push(i);
                        }
                        console.log("Meses gerados para semestral:", months);
                        setEditingMonth(months.join(','));
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >Semestral</button>
                    <button
                      type="button"
                      onClick={() => {
                        // Gerar lista explícita de meses
                        let months = [];
                        const max = Math.min(term, 360);
                        for (let i = 1; i <= max; i += 12) {
                          months.push(i);
                        }
                        console.log("Meses gerados para anual:", months);
                        setEditingMonth(months.join(','));
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                    >Anual</button>
                  </div>
                )}
              </div>
              
              <div className="card-footer bg-gray-50">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 4a1 1 0 011-1h4a1 1 0 010 2H6a1 1 0 01-1-1zm10 4a1 1 0 01-1 1h-4a1 1 0 010-2h4a1 1 0 011 1zM5 12a1 1 0 011-1h4a1 1 0 010 2H6a1 1 0 01-1-1zm10 4a1 1 0 01-1 1h-4a1 1 0 010-2h4a1 1 0 011 1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Atenção:</span> Em amortizações de pequeno valor a margem de erro é maior.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumos financeiros agrupados em uma linha horizontal */}
      {basicResults && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Resumo do Financiamento</h2>
          
          {/* Componente de Economia Gerada com Amortizações */}
          {amortizationResults && amortizationResults.savings && (
            <div className="card mb-6 animate-slide-up">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-green-700">Economia Gerada com Amortizações Extras</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Economia em Juros</h4>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(Math.abs(amortizationResults.savings.juros))}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Economia em Seguros</h4>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(Math.abs(amortizationResults.savings.seguros))}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100 hover-up hover-shadow">
                    <h4 className="text-sm font-medium text-green-700 mb-1">Economia em Correção</h4>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(Math.abs(amortizationResults.savings.correcao))}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-4 rounded-lg border border-green-200 shadow-sm hover-up hover-shadow">
                    <h4 className="text-sm font-medium text-green-800 mb-1">Economia Total</h4>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(Math.abs(amortizationResults.savings.total))}</p>
                    {amortizationResults.savings.tempoMeses > 0 && (
                      <p className="text-sm text-green-600 mt-1">
                        {Math.abs(amortizationResults.savings.tempoMeses)} meses economizados
                        <span className="inline-block ml-1 mt-1 badge badge-success">
                          {Math.abs(amortizationResults.savings.tempoAnos)} anos
                        </span>
                      </p>
                    )}
                    {amortizationResults.schedule.some(item => item.tipoAmortizacao === 'parcela') && !amortizationResults.schedule.some(item => item.tipoAmortizacao === 'prazo') && (
                      <p className="text-sm text-amber-600 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                        </svg>
                        Sem redução de prazo
                      </p>
                    )}
                  </div>
                </div>
                
                
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Financiamento Padrão */}
            <div>
              <FinanceSummary
                basicResults={basicResults}
                amortizationResults={amortizationResults}
                principal={principal}
                formatCurrency={formatCurrency}
                annualInterest={annualInterest}
                system={system}
                formatLastPaymentDate={formatLastPaymentDate}
                cardType="basic"
              />
            </div>
            
            {/* Com Amortização */}
            <div>
              <FinanceSummary
                basicResults={basicResults}
                amortizationResults={amortizationResults}
                principal={principal}
                formatCurrency={formatCurrency}
                annualInterest={annualInterest}
                system={system}
                formatLastPaymentDate={formatLastPaymentDate}
                cardType="amortization"
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Gráficos */}
      {basicResults && amortizationResults && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Gráficos Comparativos</h2>
          <ChartTabs
            basicResults={basicResults}
            amortizationResults={amortizationResults}
            principal={principal}
            formatCurrency={formatCurrency}
          />
        </div>
      )}
      
      {/* Mensagem quando não há amortização para mostrar gráficos */}
      {basicResults && !amortizationResults && (
        <div className="mt-6 mb-6">
          <div className="flex flex-col items-center justify-center py-8 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Gráficos Comparativos</h3>
            <p className="text-gray-500 text-center max-w-md">
              Para visualizar os gráficos comparativos, adicione uma amortização extra utilizando a tabela abaixo.
            </p>
          </div>
        </div>
      )}
      
      {/* Tabela de amortização em largura completa */}
      {basicResults && (
        <div className="mt-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Tabela de Amortização</h2>
            
            <div className="mb-4">
              <div className="tabs">
                <button
                  className={`tab ${activeTab === 'sem' ? 'tab-active' : 'tab-inactive'}`}
                  onClick={() => setActiveTab('sem')}
                  id="tab-sem-antecipacao"
                >
                  Sem amortização extra
                </button>
                <button
                  className={`tab ${activeTab === 'com' ? 'tab-active' : 'tab-inactive'}`}
                  onClick={() => {
                    if (amortizationResults) {
                      setActiveTab('com');
                    } else if (amortizations.length > 0) {
                      runAmortizationSimulation();
                      setActiveTab('com');
                    }
                  }}
                  id="tab-com-antecipacao"
                >
                  Com amortização extra
                </button>
              </div>
              
              <div>
                {activeTab === 'sem' ? (
                  <AmortizationTable
                    schedule={basicResults.schedule}
                    formatCurrency={formatCurrency}
                    formatMonthDate={formatMonthDate}
                    onAddAmort={(month) => {
                      setActiveTab('com');
                      // Validar se o mês está dentro do prazo do financiamento
                      if (month <= term) {
                        setSelectedMonth(month);
                        setEditingValue('');
                        setEditingType('prazo');
                        setAmortizationModalOpen(true);
                      } else {
                        setAmortizationError("O mês da amortização não pode exceder o prazo do financiamento.");
                      }
                    }}
                  />
                ) : (
                  <>
                    {amortizationResults ? (
                      <AmortizationTable
                        schedule={amortizationResults.schedule}
                        showAmortizationColumn={true}
                        formatCurrency={formatCurrency}
                        formatMonthDate={formatMonthDate}
                        onAddAmort={(month) => {
                          // Validar se o mês está dentro do prazo do financiamento
                          if (month <= term) {
                            setSelectedMonth(month);
                            setEditingValue('');
                            setEditingType('prazo');
                            setAmortizationModalOpen(true);
                          } else {
                            setAmortizationError("O mês da amortização não pode exceder o prazo do financiamento.");
                          }
                        }}
                        onEditAmort={handleEditAmortization}
                        onRemoveAmort={handleRemoveAmortization}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-lg bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-600 text-center">Configure amortizações extras na seção acima para ver os resultados com antecipação.</p>
                        <button
                          onClick={() => document.querySelector('.amortization-form-section')?.scrollIntoView({ behavior: 'smooth' })}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Ir para Configuração de Amortização
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal de Prazo Alvo */}
      <Modal
        isOpen={targetTermModalOpen}
        onClose={() => setTargetTermModalOpen(false)}
        title="Simulador de Prazo Alvo"
      >
        <TargetTermSimulator
          term={term}
          targetTerm={targetTerm}
          setTargetTerm={setTargetTerm}
          targetAmortMonths={targetAmortMonths}
          setTargetAmortMonths={setTargetAmortMonths}
          targetAmortType={targetAmortType}
          setTargetAmortType={setTargetAmortType}
          targetResults={targetResults}
          runTargetTermSimulation={runTargetTermSimulation}
          applyTargetAmortizationsToSimulator={applyTargetAmortizationsToSimulator}
          formatCurrency={formatCurrency}
        />
      </Modal>

      {/* Modal para comparação entre sistemas */}
      <Modal
        isOpen={comparisonModalOpen}
        onClose={() => setComparisonModalOpen(false)}
        title="Comparação entre Sistemas SAC e PRICE"
        size="xl"
      >
        <SystemComparison
          comparisonResults={comparisonResults}
          formatCurrency={formatCurrency}
          chartData={chartData}
        />
      </Modal>

      {/* Modal Sobre */}
      <Modal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
        title="Sobre o Simulador"
      >
        <About />
      </Modal>

      {/* Modal Relatório IA */}
      {aiReportModalOpen && (
        <AIReport onClose={() => setAiReportModalOpen(false)} />
      )}

      {/* Modal de Amortização */}
      <Modal
        isOpen={amortizationModalOpen}
        onClose={() => {
          setAmortizationModalOpen(false);
          setSelectedMonth(null);
          setEditingValue('');
          setEditingType('prazo');
          setAmortizationError('');
        }}
        title={`Amortização Extra - Mês ${selectedMonth}`}
      >
        <div className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor da Amortização
            </label>
            <input
              type="number"
              value={editingValue}
              onChange={(e) => {
                const value = e.target.value;
                // Permitir digitação contínua
                setEditingValue(value);
                // Limpar erro se valor for válido
                if (parseFloat(value) > 0) {
                  setAmortizationError('');
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Digite o valor"
            />
            {amortizationError && (
              <p className="mt-2 text-sm text-red-600">{amortizationError}</p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Amortização
            </label>
            <select
              value={editingType}
              onChange={(e) => setEditingType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="prazo">Reduzir Prazo</option>
              <option value="parcela">Reduzir Parcela</option>
            </select>
            <p className="mt-2 text-sm text-gray-500">
              {editingType === 'prazo' ? (
                <>
                  A amortização será aplicada do mês {selectedMonth} até o final do prazo, 
                  reduzindo o tempo total do financiamento.
                </>
              ) : (
                <>
                  A amortização será aplicada apenas no mês {selectedMonth}, 
                  reduzindo o valor das parcelas restantes.
                </>
              )}
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setAmortizationModalOpen(false);
                setSelectedMonth(null);
                setEditingValue('');
                setEditingType('prazo');
                setAmortizationError('');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                const value = parseFloat(editingValue);
                if (!value || value <= 0) {
                  setAmortizationError('O valor da amortização deve ser maior que zero.');
                  return;
                }
                handleSaveAmortization(value, editingType);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              disabled={!editingValue || parseFloat(editingValue) <= 0}
            >
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LoanSimulator;