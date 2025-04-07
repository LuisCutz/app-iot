import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logout } from '../utils/auth';
import BoxIcon from './BoxIcon';
import Logo from './Logo';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-[#2B2D42] backdrop-blur-lg border-r border-purple-500/20 text-white w-54 min-h-screen py-6 px-4">
      <Logo
        logoSrc="../../logo.svg"
        altText="logo"
        className='mb-8'
      />

      <nav className="space-y-4">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
            isActive('/dashboard')
              ? 'bg-white/20'
              : 'glass-effect hover:bg-white/20'
          }`}
        >
          <BoxIcon type='solid' name='dashboard' color='#fff' size='sm' />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/parcelas"
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
            isActive('/parcelas')
              ? 'bg-white/20'
              : 'glass-effect hover:bg-white/20'
          }`}
        >
          <BoxIcon type='solid' name='map' color='#fff' size='sm' />
          <span>Parcelas</span>
        </Link>
      </nav>

      <div className="absolute bottom-0 left-0 w-54 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-gray-300 hover:bg-red-500/20 rounded-lg transition-all duration-300 cursor-pointer"
        >
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Salir</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;