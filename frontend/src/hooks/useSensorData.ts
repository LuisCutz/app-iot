import { useState, useEffect } from 'react';
import { ApiResponse, fetchApiData } from '../services/sensorService';

export const useSensorData = (refreshInterval = 300000) => {
  const [data, setData] = useState<ApiResponse>({
    sensores: {
      humedad: 0,
      temperatura: 0,
      lluvia: 0,
      sol: 0
    },
    parcelas: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const apiData = await fetchApiData();
        setData(apiData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos de los sensores');
      } finally {
        setLoading(false);
      }
    };

    getData();
    const interval = setInterval(getData, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
};