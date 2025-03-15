import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const AccountDetails = () => {
  const { currentUser, updateProfile, updateContractInfo, updateFinancingParams } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Dados do formulário de perfil
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    cpf: currentUser?.cpf || '',
    address: currentUser?.address || '',
  });
  
  // Dados do formulário de financiamento
  const [financingData, setFinancingData] = useState({
    amount: currentUser?.contractInfo?.financingParams?.amount || '',
    term: currentUser?.contractInfo?.financingParams?.term || '',
    interestRate: currentUser?.contractInfo?.financingParams?.interestRate || '',
    correctionRate: currentUser?.contractInfo?.financingParams?.correctionRate || '',
    system: currentUser?.contractInfo?.financingParams?.system || 'sac',
    monthlyInsurance: currentUser?.contractInfo?.financingParams?.monthlyInsurance || '',
    adminFee: currentUser?.contractInfo?.financingParams?.adminFee || '',
  });

  // Função para formatar valores monetários
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para formatar percentuais
  const formatPercentage = (value) => {
    if (!value && value !== 0) return '';
    return `${value}%`;
  };

  // Função para lidar com mudanças no formulário de perfil
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Função para lidar com mudanças no formulário de financiamento
  const handleFinancingChange = (e) => {
    const { name, value } = e.target;
    setFinancingData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Função para salvar alterações no perfil
  const saveProfileChanges = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    setSuccess('Perfil atualizado com sucesso!');
    setEditing(false);
    
    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  // Função para salvar alterações no financiamento
  const saveFinancingChanges = (e) => {
    e.preventDefault();
    updateFinancingParams(financingData);
    setSuccess('Dados do financiamento atualizados com sucesso!');
    setEditing(false);
    
    // Limpar mensagem de sucesso após 3 segundos
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="card-header bg-gradient-to-r from-purple-50 to-indigo-50">
          <h2 className="text-lg font-semibold text-purple-700">Minha Conta</h2>
        </div>
        <div className="card-body">
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </div>
            </div>
          )}
          
          {/* Abas de navegação */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex -mb-px">
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Dados Pessoais
              </button>
              <button
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === 'financing'
                    ? 'border-b-2 border-primary-500 text-primary-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('financing')}
              >
                Dados do Financiamento
              </button>
            </nav>
          </div>
          
          {/* Conteúdo da aba Dados Pessoais */}
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-700">Informações Pessoais</h3>
                {!editing ? (
                  <button
                    type="button"
                    className="btn btn-outline !py-1 !px-3 text-xs"
                    onClick={() => setEditing(true)}
                  >
                    Editar
                  </button>
                ) : null}
              </div>
              
              {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nome</p>
                    <p className="font-medium">{profileData.name || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telefone</p>
                    <p className="font-medium">{profileData.phone || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CPF</p>
                    <p className="font-medium">{profileData.cpf || 'Não informado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Endereço</p>
                    <p className="font-medium">{profileData.address || 'Não informado'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveProfileChanges}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="input-group !mb-2">
                      <label htmlFor="name" className="input-label">Nome</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="input"
                        value={profileData.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="email" className="input-label">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="input"
                        value={profileData.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="phone" className="input-label">Telefone</label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        className="input"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="cpf" className="input-label">CPF</label>
                      <input
                        id="cpf"
                        name="cpf"
                        type="text"
                        className="input"
                        value={profileData.cpf}
                        onChange={handleProfileChange}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div className="input-group !mb-2 md:col-span-2">
                      <label htmlFor="address" className="input-label">Endereço</label>
                      <input
                        id="address"
                        name="address"
                        type="text"
                        className="input"
                        value={profileData.address}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          
          {/* Conteúdo da aba Dados do Financiamento */}
          {activeTab === 'financing' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-medium text-gray-700">Parâmetros do Financiamento</h3>
                {!editing ? (
                  <button
                    type="button"
                    className="btn btn-outline !py-1 !px-3 text-xs"
                    onClick={() => setEditing(true)}
                  >
                    Editar
                  </button>
                ) : null}
              </div>
              
              {!editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Valor do Financiamento</p>
                    <p className="font-medium">{formatCurrency(financingData.amount) || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prazo (meses)</p>
                    <p className="font-medium">{financingData.term || 'Não informado'} {financingData.term ? 'meses' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxa de Juros</p>
                    <p className="font-medium">{formatPercentage(financingData.interestRate) || 'Não informado'} {financingData.interestRate ? 'a.a.' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxa de Correção</p>
                    <p className="font-medium">{formatPercentage(financingData.correctionRate) || 'Não informado'} {financingData.correctionRate ? 'a.a.' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Sistema de Amortização</p>
                    <p className="font-medium">
                      {financingData.system === 'sac' ? 'SAC (parcelas decrescentes)' : 
                       financingData.system === 'price' ? 'PRICE (parcelas fixas)' : 
                       financingData.system === 'sacre' ? 'SACRE (Sistema de Amortização Crescente)' : 
                       'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxas/seguro mensal</p>
                    <p className="font-medium">{formatCurrency(financingData.monthlyInsurance) || 'Não informado'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Taxa de Administração</p>
                    <p className="font-medium">{formatCurrency(financingData.adminFee) || 'Não informado'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={saveFinancingChanges}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="input-group !mb-2">
                      <label htmlFor="amount" className="input-label">Valor do Financiamento (R$)</label>
                      <div className="input-icon">
                        <span className="input-icon-left">R$</span>
                        <input
                          id="amount"
                          name="amount"
                          type="text"
                          className="input pl-10"
                          value={financingData.amount}
                          onChange={handleFinancingChange}
                        />
                      </div>
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="term" className="input-label">Prazo (meses)</label>
                      <div className="input-icon">
                        <input
                          id="term"
                          name="term"
                          type="number"
                          className="input"
                          value={financingData.term}
                          onChange={handleFinancingChange}
                          min="1"
                          max="480"
                        />
                        <span className="input-icon-right">meses</span>
                      </div>
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="interestRate" className="input-label">Taxa de Juros (% a.a.)</label>
                      <div className="input-icon">
                        <input
                          id="interestRate"
                          name="interestRate"
                          type="text"
                          className="input"
                          value={financingData.interestRate}
                          onChange={handleFinancingChange}
                        />
                        <span className="input-icon-right">% a.a.</span>
                      </div>
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="correctionRate" className="input-label">Taxa de Correção (% a.a.)</label>
                      <div className="input-icon">
                        <input
                          id="correctionRate"
                          name="correctionRate"
                          type="text"
                          className="input"
                          value={financingData.correctionRate}
                          onChange={handleFinancingChange}
                        />
                        <span className="input-icon-right">% a.a.</span>
                      </div>
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="system" className="input-label">Sistema de Amortização</label>
                      <select
                        id="system"
                        name="system"
                        className="input"
                        value={financingData.system}
                        onChange={handleFinancingChange}
                      >
                        <option value="sac">SAC (parcelas decrescentes)</option>
                        <option value="price">PRICE (parcelas fixas)</option>
                        <option value="sacre">SACRE (Sistema de Amortização Crescente)</option>
                      </select>
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="monthlyInsurance" className="input-label">Taxas/seguro mensal (R$)</label>
                      <div className="input-icon">
                        <span className="input-icon-left">R$</span>
                        <input
                          id="monthlyInsurance"
                          name="monthlyInsurance"
                          type="text"
                          className="input pl-10"
                          value={financingData.monthlyInsurance}
                          onChange={handleFinancingChange}
                        />
                      </div>
                    </div>
                    <div className="input-group !mb-2">
                      <label htmlFor="adminFee" className="input-label">Taxa de Administração (R$)</label>
                      <div className="input-icon">
                        <span className="input-icon-left">R$</span>
                        <input
                          id="adminFee"
                          name="adminFee"
                          type="text"
                          className="input pl-10"
                          value={financingData.adminFee}
                          onChange={handleFinancingChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-3 rounded-md border border-blue-100 mt-4 mb-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Componentes importantes do financiamento:</p>
                        <ul className="list-disc list-inside ml-1 space-y-1 text-xs">
                          <li>O valor da amortização é calculado com base no sistema escolhido</li>
                          <li>Os juros são calculados sobre o saldo devedor atual</li>
                          <li>A taxa de seguro e administração são valores fixos mensais</li>
                          <li>A correção monetária é aplicada conforme o índice informado</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
