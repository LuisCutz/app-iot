import axios from 'axios';

export interface SensorData {
  humedad: number;
  temperatura: number;
  lluvia: number;
  sol: number;
  fecha_lectura?: string;
}

export interface Lectura {
  id: number;
  parcela_id: number;
  humedad: number;
  temperatura: number;
  lluvia: number;
  sol: number;
  ultimo_riego: string | null;
  fecha_lectura: string;
}

export interface Parcela {
  id: number;
  nombre: string;
  ubicacion: string;
  responsable: string;
  tipo_cultivo: string;
  latitud: number;
  longitud: number;
  activo: boolean;
  lecturas: Lectura[];
}

export interface ApiResponse {
  sensores: SensorData;
  parcelas: Parcela[];
  historico: SensorData[];
}

const API_URL = 'http://localhost:3000';

export const fetchApiData = async (): Promise<ApiResponse> => {
  try {
    // Obtener datos de parcelas con sus últimas lecturas
    const parcelasResponse = await axios.get(`${API_URL}/info/parcelas`);

    // Obtener histórico de sensores globales
    const historicoResponse = await axios.get(`${API_URL}/sensores`);

    // Ordenar las lecturas por fecha_lectura de más reciente a más antigua
    const parcelas = parcelasResponse.data.map((parcela: Parcela) => ({
      ...parcela,
      lecturas: parcela.lecturas.sort((a: Lectura, b: Lectura) =>
        new Date(b.fecha_lectura).getTime() - new Date(a.fecha_lectura).getTime()
      )
    }));

    // Obtener la última lectura del histórico para los sensores globales
    const ultimaLectura = historicoResponse.data[0] || {
      humedad: 0,
      temperatura: 0,
      lluvia: 0,
      sol: 0,
      fecha_lectura: new Date().toISOString()
    };

    return {
      sensores: {
        humedad: ultimaLectura.humedad,
        temperatura: ultimaLectura.temperatura,
        lluvia: ultimaLectura.lluvia,
        sol: ultimaLectura.sol,
        fecha_lectura: ultimaLectura.fecha_lectura
      },
      parcelas,
      historico: historicoResponse.data
    };
  } catch (error) {
    console.error('Error fetching API data:', error);
    throw new Error('Error al obtener datos de la API');
  }
};

// Función para obtener el histórico de una parcela específica
export const fetchParcelaHistorico = async (id: number): Promise<Parcela> => {
  try {
    const response = await axios.get(`${API_URL}/info/parcelas/${id}/historico`);
    const parcela = response.data;

    // Ordenar las lecturas por fecha_lectura de más reciente a más antigua
    parcela.lecturas = parcela.lecturas.sort((a: Lectura, b: Lectura) =>
      new Date(b.fecha_lectura).getTime() - new Date(a.fecha_lectura).getTime()
    );

    return parcela;
  } catch (error) {
    console.error('Error fetching parcela histórico:', error);
    throw new Error('Error al obtener el histórico de la parcela');
  }
};