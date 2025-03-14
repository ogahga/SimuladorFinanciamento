import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Componente que protege rotas que exigem autenticação
const PrivateRoute = () => {
  const { currentUser, loading } = useAuth();

  // Se ainda estiver carregando os dados do usuário, pode exibir um loader
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;