import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export function useRealTimeTelemetry() {
  const [latest, setLatest] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    
    // Conectar ao servidor WebSocket
    const socket = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('[WebSocket] Conectado ao servidor');
      setIsConnected(true);
    });

    socket.on('telemetry:update', (data) => {
      console.log('[WebSocket] Telemetria atualizada:', data);
      setLatest(data);
    });

    socket.on('disconnect', () => {
      console.log('[WebSocket] Desconectado do servidor');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('[WebSocket] Erro de conexão:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return { latest, isConnected };
}
