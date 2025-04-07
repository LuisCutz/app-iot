import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Mapbox from '../components/Mapbox';
import WeatherCard from '../components/WeatherCard';
import DashboardCharts from '../components/DashboardCharts';
import { useSensorData } from '../hooks/useSensorData';

const Dashboard: React.FC = () => {
  const { data, loading, error } = useSensorData();

  const activeParcelas = data.parcelas.filter(parcela => parcela.activo);

  return (
    <div className="flex h-screen bg-[#0f0f16]">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header />
        
        <main className="flex-1 overflow-auto bg-[#2B2D42] px-8 py-4">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-[#B7BFCD]">Cultivos del sur <span className='text-[#C3DAD5]'>|</span> Resumen general</p>
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
              <div className="flex gap-8 h-[390px]">
                <div className="w-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                  <Mapbox parcelas={activeParcelas} />
                </div>

                <div className="w-1/2 grid grid-cols-2 gap-6">
                  <WeatherCard 
                    name="Temperatura" 
                    value={`${data.sensores.temperatura}°C`}
                    icon="thermometer"
                    iconType="solid"
                    size="lg"
                    className="h-full"
                  />
                  <WeatherCard 
                    name="Humedad" 
                    value={`${data.sensores.humedad}%`}
                    icon="droplet"
                    size="lg"
                    className="h-full"
                  />
                  <WeatherCard 
                    name="Lluvia" 
                    value={`${data.sensores.lluvia}mm`}
                    icon="cloud-rain"
                    size="lg"
                    className="h-full"
                  />
                  <WeatherCard 
                    name="Intensidad del sol" 
                    value={`${data.sensores.sol}%`}
                    icon="sun"
                    size="lg"
                    className="h-full"
                  />
                </div>
              </div>

              <DashboardCharts sensorData={data.historico} />
            </>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;