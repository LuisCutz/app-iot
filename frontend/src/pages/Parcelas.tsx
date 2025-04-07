import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ParcelaCard from '../components/ParcelaCard';
import { useSensorData } from '../hooks/useSensorData';
import BoxIcon from '../components/BoxIcon';

const Parcelas: React.FC = () => {
  const { data, loading, error } = useSensorData();
  const [filter, setFilter] = useState<'todas' | 'activas' | 'inactivas'>('todas');

  const filteredParcelas = data.parcelas.filter(parcela => {
    if (filter === 'todas') return true;
    if (filter === 'activas') return parcela.activo;
    return !parcela.activo;
  });

  const renderEmptyState = () => {
    if (loading) return null;
    if (filteredParcelas.length > 0) return null;

    let message = '';
    let icon = '';
    let color = '';

    switch (filter) {
      case 'activas':
        message = 'No hay parcelas activas en este momento';
        icon = 'check-circle';
        color = '#34D399';
        break;
      case 'inactivas':
        message = 'No hay parcelas inactivas en este momento';
        icon = 'x-circle';
        color = '#F87171';
        break;
      default:
        message = 'No hay parcelas registradas';
        icon = 'grid-alt';
        color = '#9CA3AF';
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-white/10">
        <BoxIcon type="solid" name={icon} color={color} size="lg" className="mb-4" />
        <p className="text-gray-300 text-lg mb-2">{message}</p>
        <p className="text-gray-400 text-sm">Intente más tarde o cambie el filtro de visualización</p>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#0f0f16]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-auto bg-[#2B2D42] px-8 py-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Parcelas</h1>
              <p className="text-[#B7BFCD]">Monitoreo de parcelas</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('todas')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  filter === 'todas' 
                    ? 'bg-white/20 text-white' 
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <BoxIcon type="solid" name="grid-alt" color={filter === 'todas' ? '#fff' : '#9CA3AF'} />
                Todas
              </button>
              <button
                onClick={() => setFilter('activas')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  filter === 'activas' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <BoxIcon type="solid" name="check-circle" color={filter === 'activas' ? '#34D399' : '#9CA3AF'} />
                Activas
              </button>
              <button
                onClick={() => setFilter('inactivas')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  filter === 'inactivas' 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'text-gray-400 hover:bg-white/10'
                }`}
              >
                <BoxIcon type="solid" name="x-circle" color={filter === 'inactivas' ? '#F87171' : '#9CA3AF'} />
                Inactivas
              </button>
            </div>
          </div>

          {error ? (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          ) : loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {renderEmptyState()}
              <div className="flex flex-col gap-4">
                {filteredParcelas.map((parcela) => (
                  <ParcelaCard key={parcela.id} parcela={parcela} />
                ))}
              </div>
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Parcelas;