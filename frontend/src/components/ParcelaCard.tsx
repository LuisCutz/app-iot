import React, { useState } from 'react';
import { Parcela } from '../services/sensorService';
import WeatherCard from './WeatherCard';
import BoxIcon from './BoxIcon';
import ParcelaCharts from './ParcelaCharts';

interface ParcelaCardProps {
  parcela: Parcela;
}

const ParcelaCard: React.FC<ParcelaCardProps> = ({ parcela }) => {
  const [showCharts, setShowCharts] = useState(false);
  const ultimaLectura = parcela.lecturas[0];

  return (
    <>
      <div className={`${
        parcela.activo 
          ? 'bg-gray-600/50 ' 
          : 'bg-gray-800/30 '
        } backdrop-blur-md border border-white/20 rounded-xl p-6 transition-all duration-300`}>
        <div className="flex gap-8">
          {/* Información principal */}
          <div className="flex-1">
            <div className="flex justify-start items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {parcela.nombre}
                  <span className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${
                    parcela.activo 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    <BoxIcon 
                      type="solid" 
                      name={parcela.activo ? 'check-circle' : 'x-circle'} 
                      color={parcela.activo ? '#34D399' : '#F87171'} 
                      size="sm"
                    />
                    {parcela.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </h3>
                <p className={`text-gray-300 ${!parcela.activo && 'opacity-60'}`}>{parcela.ubicacion}</p>
              </div>
              <button
                onClick={() => setShowCharts(true)}
                className="group relative p-2 bg-blue-500/20 text-blue-400 rounded-lg ml-2 hover:bg-blue-500/30 transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="Ver gráficos"
              >
                <BoxIcon type="regular" name="line-chart" size="sm" color="#60A5FA" />
                <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap">
                  Ver gráficos
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-sm">
                <p className={`text-gray-400 ${!parcela.activo && 'opacity-60'}`}>Responsable</p>
                <p className={`text-white ${!parcela.activo && 'opacity-60'}`}>{parcela.responsable}</p>
              </div>
              <div className="text-sm">
                <p className={`text-gray-400 ${!parcela.activo && 'opacity-60'}`}>Cultivo</p>
                <p className={`text-white ${!parcela.activo && 'opacity-60'}`}>{parcela.tipo_cultivo}</p>
              </div>
            </div>

            <p className={`text-sm text-gray-400 ${!parcela.activo && 'opacity-60'}`}>
              Último riego: {ultimaLectura?.ultimo_riego ? new Date(ultimaLectura.ultimo_riego).toLocaleString() : 'No disponible'}
            </p>
          </div>

          {/* Sensores */}
          <div className="grid grid-cols-4 gap-4 flex-[2]">
            <WeatherCard 
              name="Temperatura" 
              value={`${ultimaLectura?.temperatura || 0}°C`}
              icon="thermometer"
              iconType="solid"
              size="sm"
            />
            <WeatherCard 
              name="Humedad" 
              value={`${ultimaLectura?.humedad || 0}%`}
              icon="droplet"
              size="sm"
            />
            <WeatherCard 
              name="Lluvia" 
              value={`${ultimaLectura?.lluvia || 0}mm`}
              icon="cloud-rain"
              size="sm"
            />
            <WeatherCard 
              name="Intensidad del sol" 
              value={`${ultimaLectura?.sol || 0}%`}
              icon="sun"
              size="sm"
            />
          </div>
        </div>
      </div>

      <ParcelaCharts
        parcela={parcela}
        isOpen={showCharts}
        onClose={() => setShowCharts(false)}
      />
    </>
  );
};

export default ParcelaCard;