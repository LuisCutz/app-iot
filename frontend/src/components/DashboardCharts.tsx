import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorData } from '../services/sensorService';
import BoxIcon from './BoxIcon';

interface DashboardChartsProps {
  sensorData: SensorData[];
}

type ChartType = 'line' | 'bar' | 'area';

const DashboardCharts: React.FC<DashboardChartsProps> = ({ sensorData }) => {
  const [chartType, setChartType] = useState<ChartType>('line');

  const filterDataByHour = (data: SensorData[]) => {
    if (!data || data.length === 0) return [];

    const dates = data.map((item) => new Date(item.fecha_lectura!).getTime());
    const mostRecentDate = new Date(Math.max(...dates));
    const oneHourAgo = new Date(mostRecentDate.getTime() - 60 * 60 * 1000);

    const filteredData = data.filter((item) => {
      const itemDate = new Date(item.fecha_lectura!);
      return itemDate >= oneHourAgo;
    });

    const groupedData: { [key: string]: SensorData } = {};
    filteredData.forEach((item) => {
      const date = new Date(item.fecha_lectura!);
      const minutes = Math.floor(date.getMinutes() / 5) * 5;
      date.setMinutes(minutes);
      date.setSeconds(0);
      date.setMilliseconds(0);
      const key = date.toISOString();

      if (!groupedData[key]) {
        groupedData[key] = item;
      }
    });

    return Object.values(groupedData);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'p.m.' : 'a.m.';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${hours}:${minutes} ${period}`;
  };

  const getChartData = () => {
    const filteredData = filterDataByHour([...sensorData].reverse());
    return filteredData.map(data => ({
      ...data,
      time: formatDateTime(data.fecha_lectura!),
      lluviaAcumulada: data.lluvia
    }));
  };

  const getChartTitle = () => {
    switch (chartType) {
      case 'line':
        return 'Monitoreo de intensidad solar durante la última hora';
      case 'bar':
        return 'Registro de temperatura y humedad durante la última hora';
      case 'area':
        return 'Acumulación de precipitaciones durante la última hora';
      default:
        return '';
    }
  };

  const renderChart = () => {
    const data = getChartData();

    if (!data || data.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No hay datos disponibles para mostrar</p>
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return (
          <>
            <h3 className="text-lg font-medium text-white mb-4 text-center">{getChartTitle()}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="time"
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  label={{
                    value: 'Porcentaje de intensidad solar',
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.7)',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend
                  wrapperStyle={{
                    color: 'white',
                    paddingTop: '15px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sol"
                  name="Intensidad solar registrada (%)"
                  stroke="rgba(255, 205, 86, 0.8)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </>
        );

      case 'bar':
        return (
          <>
            <h3 className="text-lg font-medium text-white mb-4 text-center">{getChartTitle()}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="time"
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  label={{
                    value: 'Temperatura (°C) / Humedad (%)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.7)',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend
                  wrapperStyle={{
                    color: 'white',
                    paddingTop: '15px'
                  }}
                />
                <Bar
                  dataKey="temperatura"
                  name="Temperatura ambiente registrada (°C)"
                  fill="rgba(255, 99, 132, 0.7)"
                />
                <Bar
                  dataKey="humedad"
                  name="Humedad relativa registrada (%)"
                  fill="rgba(53, 162, 235, 0.7)"
                />
              </BarChart>
            </ResponsiveContainer>
          </>
        );

      case 'area':
        return (
          <>
            <h3 className="text-lg font-medium text-white mb-4 text-center">{getChartTitle()}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="time"
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  label={{
                    value: 'Precipitación (mm)',
                    angle: -90,
                    position: 'insideLeft',
                    fill: 'rgba(255,255,255,0.7)',
                    style: { textAnchor: 'middle' }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'white' }}
                  itemStyle={{ color: 'white' }}
                />
                <Legend
                  wrapperStyle={{
                    color: 'white',
                    paddingTop: '15px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="lluviaAcumulada"
                  name="Precipitación acumulada registrada (mm)"
                  stroke="rgba(52, 211, 153, 0.8)"
                  fill="rgba(52, 211, 153, 0.2)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex bg-slate-700/30 rounded-lg p-1">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${chartType === 'line'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'text-gray-400 hover:text-gray-300'
              }`}
            title="Intensidad del sol"
          >
            <BoxIcon type="regular" name="sun" color={chartType === 'line' ? '#FACC15' : '#9CA3AF'} size="sm" />
            <span className="text-sm">Solar</span>
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${chartType === 'bar'
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
              }`}
            title="Temperatura y humedad"
          >
            <BoxIcon type="solid" name="thermometer" color={chartType === 'bar' ? '#60A5FA' : '#9CA3AF'} size="sm" />
            <span className="text-sm">Temp/Hum</span>
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 cursor-pointer ${chartType === 'area'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-gray-400 hover:text-gray-300'
              }`}
            title="Lluvia acumulada"
          >
            <BoxIcon type="regular" name="cloud-rain" color={chartType === 'area' ? '#34D399' : '#9CA3AF'} size="sm" />
            <span className="text-sm">Lluvia</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg p-6 border border-white/5">
        {renderChart()}
      </div>
    </div>
  );
};

export default DashboardCharts;