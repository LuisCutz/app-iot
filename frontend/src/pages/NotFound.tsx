import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold opacity-20 select-none" style={{ fontSize: '32rem', top: '-15%' }}>404</div>
      
      <div className="max-w-lg w-full text-center z-10">
        <h1 className="text-4xl font-bold text-white mb-4">Página no encontrada</h1>
        <p className="text-gray-400 mb-8">
        La página que intentas abrir no existe. Es posible que hayas escrito mal la dirección o que la página se haya movido a otra URL.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-[#B7BFCD] to-[#939FB4] text-black px-6 py-3 rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-[#8D99AE] focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Volver atrás
        </button>
      </div>
    </div>
  );
};

export default NotFound;