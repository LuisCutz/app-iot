import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticateUser, isAuthenticated } from '../utils/auth';
import Logo from '../components/Logo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      const success = await authenticateUser(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Credenciales inválidas.');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#202132]">
      <div className="w-full max-w-md p-8 glass-effect rounded-2xl shadow-xl">
        <Logo
          logoSrc="../../logo.svg"
          className='mb-6'
          imgClassName='w-14 h-14'
          textClassName='text-[40px]'
        />

        <h2 className="text-center text-3xl font-bold text-white mb-6">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="ejemplo@correo.com"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#B7BFCD] to-[#939FB4] text-black rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Iniciando sesión...
              </div>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          <p className="text-center text-gray-400 text-sm">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-white hover:text-gray-300 hover:underline underline-offset-2 transition-all duration-300 cursor-pointer"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;