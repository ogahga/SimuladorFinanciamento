import React, { useState, useEffect } from 'react';
import DatabaseIntegration from './DatabaseIntegration';

// Para formatar valores monetários com máscara R$ 00,00
const formatCurrencyMask = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value || 0);
};

// Função para extrair valores numéricos de campos com máscara
const parseCurrencyValue = (formattedValue) => {
  if (!formattedValue) return 0;
  
  // Remove todos os caracteres não numéricos exceto vírgula
  const cleanValue = formattedValue.replace(/[^0-9,]/g, '');
  
  // Substitui vírgula por ponto para conversão em número
  const numericValue = parseFloat(cleanValue.replace(',', '.'));
  
  return isNaN(numericValue) ? 0 : numericValue;
};

// Função para formatar percentuais com máscara
const formatPercentageMask = (value) => {
  if (!value && value !== 0) return '';
  return `${value}%`;
};

// Função para extrair valores numéricos de campos com máscara de percentual
const parsePercentageValue = (formattedValue) => {
  if (!formattedValue) return 0;
  
  // Remove todos os caracteres não numéricos exceto vírgula
  const cleanValue = formattedValue.replace(/[^0-9,]/g, '');
  
  // Substitui vírgula por ponto para conversão em número
  const numericValue = parseFloat(cleanValue.replace(',', '.'));
  
  return isNaN(numericValue) ? 0 : numericValue;
};

const InputForms = ({ initialValues, onSubmit, amortizations = [] }) => {
    const [financingParams, setFinancingParams] = useState({
        amount: initialValues?.amount || '',
        interestRate: initialValues?.interestRate || '',
        term: initialValues?.term || '',
        insurance: initialValues?.insurance || '',
        correctionRate: initialValues?.correctionRate || '',
        system: initialValues?.system || 'sac',
    });

    const [focused, setFocused] = useState({
        amount: false,
        interestRate: false,
        correctionRate: false,
        insurance: false,
    });

    // Funções para formatação de valores
    const formatCurrency = (value) => {
        if (!value && value !== 0) return '';
        
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    const parseCurrency = (value) => {
        if (!value) return '';
        return value.replace(/[^\d,]/g, '').replace(',', '.');
    };

    const formatPercentage = (value) => {
        if (!value && value !== 0) return '';
        return `${value}%`;
    };

    const parsePercentage = (value) => {
        if (!value) return '';
        return value.replace(/[^\d,]/g, '').replace(',', '.');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Processar campos formatados
        if (name === 'amount' || name === 'insurance') {
            if (focused[name]) {
                setFinancingParams({ ...financingParams, [name]: value });
            } else {
                setFinancingParams({ ...financingParams, [name]: parseCurrencyValue(value) });
            }
        } else if (name === 'interestRate' || name === 'correctionRate') {
            if (focused[name]) {
                setFinancingParams({ ...financingParams, [name]: value });
            } else {
                setFinancingParams({ ...financingParams, [name]: parsePercentageValue(value) });
            }
        } else {
            setFinancingParams({ ...financingParams, [name]: value });
        }
    };

    const handleFocus = (field) => {
        setFocused({ ...focused, [field]: true });
    };

    const handleBlur = (field) => {
        setFocused({ ...focused, [field]: false });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(financingParams);
    };

    return (
        <form onSubmit={handleSubmit} className="card animate-fade-in">
            <div className="card-header flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Parâmetros do Financiamento</h2>
                <DatabaseIntegration 
                    simulationData={{
                        principal: financingParams.amount,
                        term: financingParams.term,
                        annualInterest: financingParams.interestRate / 100,
                        annualCorrection: financingParams.correctionRate / 100,
                        insurance: financingParams.insurance,
                        system: financingParams.system
                    }}
                    amortizations={amortizations}
                />
            </div>
            
            <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="input-group !mb-2">
                        <label htmlFor="amount" className="input-label">
                            Valor do Financiamento (R$)
                        </label>
                        <div className="input-icon">
                            <span className="input-icon-left">R$</span>
                            <input
                                id="amount"
                                type="text"
                                name="amount"
                                value={focused.amount ? financingParams.amount : formatCurrencyMask(financingParams.amount)}
                                onChange={handleChange}
                                onFocus={() => handleFocus('amount')}
                                onBlur={() => handleBlur('amount')}
                                className="input"
                                placeholder="0,00"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="input-group !mb-2">
                        <label htmlFor="term" className="input-label">
                            Prazo (meses)
                        </label>
                        <div className="input-icon">
                            <input
                                id="term"
                                type="number"
                                name="term"
                                value={financingParams.term}
                                onChange={handleChange}
                                className="input"
                                placeholder="120"
                                min="1"
                                required
                            />
                            <span className="input-icon-right">meses</span>
                        </div>
                    </div>
                    
                    <div className="input-group !mb-2">
                        <label htmlFor="interestRate" className="input-label">
                            Taxa de Juros (% a.a.)
                        </label>
                        <div className="input-icon">
                            <input
                                id="interestRate"
                                type="text"
                                name="interestRate"
                                value={focused.interestRate ? financingParams.interestRate : formatPercentageMask(financingParams.interestRate)}
                                onChange={handleChange}
                                onFocus={() => handleFocus('interestRate')}
                                onBlur={() => handleBlur('interestRate')}
                                className="input"
                                placeholder="0,00%"
                                required
                            />
                            <span className="input-icon-right">% a.a.</span>
                        </div>
                    </div>
                    
                    <div className="input-group !mb-2">
                        <label htmlFor="correctionRate" className="input-label">
                            Taxa de Correção (% a.a.)
                        </label>
                        <div className="input-icon">
                            <input
                                id="correctionRate"
                                type="text"
                                name="correctionRate"
                                value={focused.correctionRate ? financingParams.correctionRate : formatPercentageMask(financingParams.correctionRate)}
                                onChange={handleChange}
                                onFocus={() => handleFocus('correctionRate')}
                                onBlur={() => handleBlur('correctionRate')}
                                className="input"
                                placeholder="0,00%"
                                required
                            />
                            <span className="input-icon-right">% a.a.</span>
                        </div>
                    </div>
                    
                    <div className="input-group !mb-2">
                        <label htmlFor="insurance" className="input-label">
                            Taxas/seguro mensal (R$)
                        </label>
                        <div className="input-icon">
                            <span className="input-icon-left">R$</span>
                            <input
                                id="insurance"
                                type="text"
                                name="insurance"
                                value={focused.insurance ? financingParams.insurance : formatCurrencyMask(financingParams.insurance)}
                                onChange={handleChange}
                                onFocus={() => handleFocus('insurance')}
                                onBlur={() => handleBlur('insurance')}
                                className="input"
                                placeholder="0,00"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="input-group !mb-2">
                        <label htmlFor="system" className="input-label">
                            Sistema de Amortização
                        </label>
                        <select
                            id="system"
                            name="system"
                            value={financingParams.system}
                            onChange={handleChange}
                            className="input"
                        >
                            <option value="sac">SAC (parcelas decrescentes)</option>
                            <option value="price">PRICE (parcelas fixas)</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div className="card-footer">
                <button type="submit" className="btn btn-primary w-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Calcular Financiamento
                </button>
            </div>
        </form>
    );
};

export default InputForms;