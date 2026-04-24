import { useState, useEffect } from 'react';
import { socket } from '../api/socket';
import api from '../api/axiosConfig';

export default function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        const handleConnect = () => setIsOnline(true);
        const handleDisconnect = () => setIsOnline(false);

        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        const healthCheckInterval = setInterval(async () => {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000); 

                await api.get('/ping', { 
                    signal: controller.signal,
                    timeout: 5000 
                });
                
                clearTimeout(timeoutId);
                setIsOnline(true);
            } catch (err) {
                console.warn('Healthcheck fallido - API no disponible', err);
                setIsOnline(false);
            }
        }, 30000); 

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            clearInterval(healthCheckInterval);
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return isOnline;
}