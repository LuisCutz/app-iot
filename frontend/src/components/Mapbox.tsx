import mapboxgl, { Map } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { Parcela } from "../services/sensorService";

import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxProps {
  parcelas: Parcela[];
}

function Mapbox({ parcelas }: MapboxProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const myMap = useRef<Map | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN) {
            setError('Token de Mapbox no encontrado');
            setIsLoading(false);
            return;
        }

        try {
            mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
            
            if (mapContainer.current) {
                const defaultCenter: [number, number] = [-102.552784, 23.634501];
                const defaultZoom = 5;

                const center: [number, number] = parcelas.length > 0
                    ? [
                        parcelas.reduce((sum, p) => sum + p.longitud, 0) / parcelas.length,
                        parcelas.reduce((sum, p) => sum + p.latitud, 0) / parcelas.length
                      ]
                    : defaultCenter;

                const zoom = parcelas.length > 0 ? 12 : defaultZoom;

                myMap.current = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: "mapbox://styles/mapbox/streets-v12",
                    center: center,
                    zoom: zoom,
                });

                myMap.current.addControl(new mapboxgl.NavigationControl());

                myMap.current.on('error', (e) => {
                    console.error('Mapbox error:', e);
                    setError('Error al cargar el mapa');
                    setIsLoading(false);
                });

                myMap.current.on('load', () => {
                    setIsLoading(false);
                    setError(null);

                    try {
                        const markers = document.getElementsByClassName('mapboxgl-marker');
                        while(markers.length > 0){
                            markers[0].remove();
                        }

                        parcelas.forEach((parcela) => {
                            const color = parcela.activo ? '#34D399' : '#F87171';
                            const ultimaLectura = parcela.lecturas[0] || {
                                temperatura: 0,
                                humedad: 0,
                                lluvia: 0,
                                sol: 0,
                                ultimo_riego: null,
                                fecha_lectura: new Date().toISOString()
                            };
                            
                            const popup = new mapboxgl.Popup({
                                closeButton: true,
                                closeOnClick: true,
                                maxWidth: '300px'
                            })
                            .setHTML(`
                                <style>
                                    .mapboxgl-popup-close-button {
                                        color: white !important;
                                        font-size: 16px !important;
                                        padding: 4px 8px !important;
                                        background: rgba(30, 30, 30, 0.4) !important;
                                        border-radius: 4px !important;
                                        transition: background 0.2s ease !important;
                                    }
                                    .mapboxgl-popup-close-button:hover {
                                        background: rgba(30, 30, 30, 0.5) !important;
                                    }
                                </style>
                                <div style="
                                    background: rgba(43, 45, 66, 0.85);
                                    backdrop-filter: blur(12px);
                                    -webkit-backdrop-filter: blur(12px);
                                    color: white;
                                    padding: 12px;
                                    border-radius: 8px;
                                    border: 1px solid rgba(255, 255, 255, 0.1);
                                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                                    width: 100%;
                                    max-width: 280px;
                                    word-wrap: break-word;
                                ">
                                    <h5 style="
                                        font-size: 1rem;
                                        font-weight: 600;
                                        margin: 0 0 8px 0;
                                        color: #fff;
                                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                                        padding-bottom: 6px;
                                    ">${parcela.nombre}</h5>

                                    <div style="
                                        background: rgba(255, 255, 255, 0.05);
                                        border-radius: 6px;
                                        padding: 8px;
                                        margin-bottom: 8px;
                                        font-size: 0.875rem;
                                    ">
                                        <p style="
                                            color: rgba(255, 255, 255, 0.8);
                                            margin: 4px 0;
                                            text-align: left;
                                        ">
                                            <span style="color: #B7BFCD;">Ubicación: </span>
                                            <span>${parcela.ubicacion}</span>
                                        </p>
                                        <p style="
                                            color: rgba(255, 255, 255, 0.8);
                                            margin: 4px 0;
                                            text-align: left;
                                        ">
                                            <span style="color: #B7BFCD;">Cultivo: </span>
                                            <span>${parcela.tipo_cultivo}</span>
                                        </p>
                                        <p style="
                                            color: rgba(255, 255, 255, 0.8);
                                            margin: 4px 0;
                                            text-align: left;
                                        ">
                                            <span style="color: #B7BFCD;">Responsable: </span>
                                            <span>${parcela.responsable}</span>
                                        </p>
                                    </div>

                                    <div style="
                                        background: rgba(255, 255, 255, 0.05);
                                        border-radius: 6px;
                                        padding: 8px;
                                        font-size: 0.875rem;
                                    ">
                                        <div style="
                                            display: grid;
                                            grid-template-columns: repeat(2, 1fr);
                                            gap: 8px;
                                        ">
                                            <div style="
                                                background: rgba(255, 99, 132, 0.1);
                                                padding: 8px;
                                                border-radius: 4px;
                                                text-align: center;
                                            ">
                                                <div style="color: rgba(255, 99, 132, 0.8); font-size: 0.75rem;">Temperatura</div>
                                                <div style="color: white; font-weight: 600; margin-top: 2px;">${ultimaLectura.temperatura}°C</div>
                                            </div>
                                            <div style="
                                                background: rgba(53, 162, 235, 0.1);
                                                padding: 8px;
                                                border-radius: 4px;
                                                text-align: center;
                                            ">
                                                <div style="color: rgba(53, 162, 235, 0.8); font-size: 0.75rem;">Humedad</div>
                                                <div style="color: white; font-weight: 600; margin-top: 2px;">${ultimaLectura.humedad}%</div>
                                            </div>
                                            <div style="
                                                background: rgba(52, 211, 153, 0.1);
                                                padding: 8px;
                                                border-radius: 4px;
                                                text-align: center;
                                            ">
                                                <div style="color: rgba(52, 211, 153, 0.8); font-size: 0.75rem;">Lluvia</div>
                                                <div style="color: white; font-weight: 600; margin-top: 2px;">${ultimaLectura.lluvia}mm</div>
                                            </div>
                                            <div style="
                                                background: rgba(255, 205, 86, 0.1);
                                                padding: 8px;
                                                border-radius: 4px;
                                                text-align: center;
                                            ">
                                                <div style="color: rgba(255, 205, 86, 0.8); font-size: 0.75rem;">Sol</div>
                                                <div style="color: white; font-weight: 600; margin-top: 2px;">${ultimaLectura.sol}%</div>
                                            </div>
                                        </div>
                                        ${ultimaLectura.ultimo_riego ? `
                                            <p style="
                                                color: rgba(255, 255, 255, 0.6);
                                                margin: 8px 0 0 0;
                                                font-size: 0.75rem;
                                                text-align: center;
                                            ">
                                                Último riego: ${new Date(ultimaLectura.ultimo_riego).toLocaleString()}
                                            </p>
                                        ` : ''}
                                    </div>
                                </div>
                            `);

                            new mapboxgl.Marker({ color })
                                .setLngLat([parcela.longitud, parcela.latitud])
                                .setPopup(popup)
                                .addTo(myMap.current!);
                        });
                    } catch (err) {
                        console.error('Error adding markers:', err);
                        setError('Error al agregar marcadores al mapa');
                    }
                });
            }
        } catch (err) {
            console.error('Mapbox initialization error:', err);
            setError('Error al inicializar el mapa');
            setIsLoading(false);
        }
        
        return () => {
            if (myMap.current) {
                myMap.current.remove();
            }
        };
    }, [parcelas]);

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-80 z-10">
                    <div className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin shadow-lg"></div>
                </div>
            )}
            {parcelas.length === 0 && !isLoading && !error && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm z-10">
                    <div className="text-center px-4 py-3 rounded-lg">
                        <div className="text-gray-300 text-lg mb-1">No hay parcelas activas</div>
                        <div className="text-gray-400 text-sm">No se encontraron parcelas activas. Intente más tarde.</div>
                    </div>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 z-10">
                    <div className="text-center p-6">
                        <div className="text-red-400 mb-2">
                            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-red-400 text-lg font-semibold">{error}</p>
                        <p className="text-gray-400 mt-2 text-sm">Por favor, verifica tu conexión a internet y recarga la página</p>
                    </div>
                </div>
            )}
            <div ref={mapContainer} className="w-full h-full rounded-xl overflow-hidden"></div>
        </div>
    );
}

export default Mapbox;