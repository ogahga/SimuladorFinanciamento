import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoanSimulator from './LoanSimulator';
import LoginPage from './pages/LoginPage';
import MyAccountPage from './pages/MyAccountPage';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
          <header className="bg-white shadow-md py-4 mb-6">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold text-primary-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <Link to="/" className="hover:text-primary-800">
                  Simulador de Financiamento Imobiliário
                </Link>
              </h1>
              
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link to="/" className="text-primary-600 hover:text-primary-800">
                      Simulador
                    </Link>
                  </li>
                  <li>
                    <Link to="/minha-conta" className="text-primary-600 hover:text-primary-800">
                      Minha Conta
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-primary-600 hover:text-primary-800">
                      Login
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          
          <main className="container mx-auto px-4 pb-10 flex-grow">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<LoanSimulator />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/minha-conta" element={<MyAccountPage />} />
                </Route>
              </Routes>
            </ErrorBoundary>
          </main>
          
          <footer className="bg-secondary-800 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p className="text-sm"> {new Date().getFullYear()} Simulador de Financiamento Imobiliário</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;