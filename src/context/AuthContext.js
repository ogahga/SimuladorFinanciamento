import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto de autenticação
const AuthContext = createContext(null);

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar se há um usuário já logado ao iniciar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem('financingUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Função para fazer login
  const login = (userData) => {
    // Simular uma validação de login
    // Em um ambiente real, isso seria uma chamada a uma API
    const user = {
      id: '1',
      name: userData.name || userData.email.split('@')[0],
      email: userData.email,
      contractInfo: {
        contractDate: new Date().toISOString(),
        financingParams: {
          amount: 0,
          term: 0,
          interestRate: 0,
          system: 'sac',
          monthlyInsurance: 0,
          adminFee: 0
        }
      }
    };
    
    // Salvar usuário no localStorage
    localStorage.setItem('financingUser', JSON.stringify(user));
    
    // Atualizar o estado
    setCurrentUser(user);
    return user;
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('financingUser');
    setCurrentUser(null);
  };

  // Função para atualizar o perfil do usuário
  const updateProfile = (userData) => {
    const updatedUser = {
      ...currentUser,
      ...userData
    };
    
    localStorage.setItem('financingUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  // Função para atualizar informações do contrato
  const updateContractInfo = (contractData) => {
    const updatedUser = {
      ...currentUser,
      contractInfo: {
        ...currentUser.contractInfo,
        ...contractData
      }
    };
    
    localStorage.setItem('financingUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  // Função para atualizar parâmetros de financiamento
  const updateFinancingParams = (params) => {
    const updatedUser = {
      ...currentUser,
      contractInfo: {
        ...currentUser.contractInfo,
        financingParams: {
          ...currentUser.contractInfo.financingParams,
          ...params
        }
      }
    };
    
    localStorage.setItem('financingUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    return updatedUser;
  };

  const value = {
    currentUser,
    login,
    logout,
    updateProfile,
    updateContractInfo,
    updateFinancingParams,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => {
  return useContext(AuthContext);
};