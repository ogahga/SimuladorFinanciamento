import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    
    try {
      setLoading(true);
      await login(formData);
      navigate('/minha-conta');
    } catch (err) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card hover-shadow">
        <div className="card-header bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-lg font-semibold text-primary-700">Acesso ao Simulador</h2>
        </div>
        
        <div className="card-body">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 text-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group !mb-2">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="seu@email.com"
                required
              />
            </div>
            
            <div className="input-group !mb-4">
              <label htmlFor="password" className="input-label">
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Sua senha"
                required
              />
            </div>
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
            
            <div className="text-center mt-4 text-sm text-gray-600">
              <p>Não tem uma conta? <a href="/cadastro" className="text-primary-600 hover:text-primary-800">Cadastre-se</a></p>
              <p className="mt-2">
                <a href="/esqueci-senha" className="text-secondary-600 hover:text-secondary-800">
                  Esqueci minha senha
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
        <h3 className="text-sm font-medium text-indigo-700 mb-2">Conta de demonstração</h3>
        <p className="text-xs text-indigo-600 mb-2">Use os dados abaixo para testar o sistema:</p>
        <div className="bg-white p-2 rounded border border-indigo-100 text-xs">
          <p><strong>Email:</strong> demo@exemplo.com</p>
          <p><strong>Senha:</strong> demo123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;