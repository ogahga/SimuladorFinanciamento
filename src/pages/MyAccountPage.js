import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import AccountDetails from '../components/account/AccountDetails';
import { useAuth } from '../context/AuthContext';

const MyAccountPage = () => {
  const { currentUser, logout } = useAuth();
  
  // Redirecionar para a página de login se não estiver autenticado
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary-700 mb-1">Minha Conta</h1>
            <p className="text-gray-600">Gerencie seus dados pessoais e do financiamento</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="btn btn-outline">
              Voltar ao Simulador
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">
              Sair
            </button>
          </div>
        </div>
        
        <AccountDetails />
        
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <h3 className="text-amber-800 font-medium text-sm mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Entenda como é calculada a amortização do seu financiamento
            </h3>
            
            <div className="text-sm text-amber-700 space-y-2">
              <p>O cálculo da amortização depende do sistema escolhido no seu contrato:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="bg-white p-3 rounded border border-amber-100">
                  <h4 className="font-medium mb-2">Sistema Price (parcelas fixas)</h4>
                  <p className="text-xs">As parcelas são fixas durante todo o período do financiamento. A amortização é crescente e os juros são decrescentes.</p>
                  <p className="text-xs mt-2">
                    <strong>Fórmula:</strong> 
                    Valor atual do débito × Taxa de juros ÷ (1 − (1 + Taxa de juros) ^ (− Número de parcelas)) = Valor da Parcela
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded border border-amber-100">
                  <h4 className="font-medium mb-2">Sistema SAC (parcelas decrescentes)</h4>
                  <p className="text-xs">A amortização é constante durante todo o período. As parcelas começam maiores e vão diminuindo ao longo do tempo, com a redução dos juros.</p>
                  <p className="text-xs mt-2">
                    <strong>Fórmula:</strong>
                    <br />1. Amortização = Saldo devedor ÷ Prazo restante
                    <br />2. Juros = Saldo devedor × Taxa
                    <br />3. Parcela = Amortização + Juros
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border border-amber-100 mt-2">
                <h4 className="font-medium mb-2">Componentes da parcela do financiamento</h4>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li><strong>Amortização:</strong> Parte da parcela que efetivamente abate o saldo devedor</li>
                  <li><strong>Juros:</strong> Calculados sobre o saldo devedor atual</li>
                  <li><strong>Seguro:</strong> Valor mensal cobrado para proteção do imóvel e do financiamento</li>
                  <li><strong>Taxa de administração:</strong> Valor cobrado pelo banco para gestão do contrato</li>
                </ul>
                <p className="text-xs mt-2">Para calcular apenas o valor da amortização: <strong>Parcela − Juros − Seguro − Taxa = Amortização</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
