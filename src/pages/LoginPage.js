import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto text-center mb-8">
          <h1 className="text-2xl font-bold text-primary-700 mb-2">Login</h1>
          <p className="text-gray-600">Acesse sua conta para gerenciar seus dados de financiamento</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
