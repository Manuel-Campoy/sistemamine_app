import { useState, useEffect } from 'react';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { localDb } from '../../db/localDb';
import { obtenerResumenCola } from '../../utils/syncQueue';

export default function Footer() {
  const isOnline = useNetworkStatus();
  const [pendientes, setPendientes] = useState(0);
  const [resumenCola, setResumenCola] = useState({ total: 0, porProcesar: 0, conErrores: 0 });

  useEffect(() => {
    const cargarPendientes = async () => {
      try {
        const todos = await localDb.movimientos.toArray();
        const sinSync = todos.filter(m => m.sincronizado === false).length;
        setPendientes(sinSync);
        
        const resumen = obtenerResumenCola();
        setResumenCola(resumen);
      } catch (err) {
        console.error("Error al cargar pendientes en Footer:", err);
      }
    };

    cargarPendientes();
    
    if (isOnline) {
      const intervalId = setInterval(cargarPendientes, 5000); 
      return () => clearInterval(intervalId);
    }
  }, [isOnline]);

  const anioActual = new Date().getFullYear();

  const estadoSync = {
    icon: isOnline ? '🟢' : '🔴',
    texto: isOnline ? 'Conectado' : 'Desconectado (Offline)',
    color: isOnline ? '#059669' : '#dc2626',
    bgColor: isOnline ? '#ecfdf5' : '#fef2f2',
    borderColor: isOnline ? '#d1fae5' : '#fee2e2'
  };

  const hasPendientes = pendientes > 0;
  const descripcionPendientes = 
    pendientes > 0 
      ? `${pendientes} movimiento${pendientes !== 1 ? 's' : ''} sin sincronizar`
      : 'Todo sincronizado ✅';

  return (
    <footer 
      style={{
        background: 'white',
        borderTop: '1px solid var(--gray-200)',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: 'var(--gray-600)',
        marginTop: 'auto', 
        zIndex: 10,
        gap: '1rem',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <strong style={{ color: 'var(--primary-dark)' }}>Sistema Minero</strong> 
        <span style={{ opacity: 0.7 }}>v1.0.0</span>
      </div>

      <div className="ocultar-en-movil" style={{ flex: 1 }}>
        &copy; {anioActual} Operaciones Mineras
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        
        {hasPendientes && (
          <div 
            style={{
              background: resumenCola.conErrores > 0 ? '#fee2e2' : '#fef3c7',
              border: `1px solid ${resumenCola.conErrores > 0 ? '#fecaca' : '#fcd34d'}`,
              borderRadius: '4px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: resumenCola.conErrores > 0 ? '#991b1b' : '#92400e',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <span>{resumenCola.conErrores > 0 ? '⚠️' : '📡'}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div>{descripcionPendientes}</div>
              {resumenCola.conErrores > 0 && (
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                  {resumenCola.conErrores} con errores de red
                </div>
              )}
            </div>
          </div>
        )}

        <div 
          style={{
            background: estadoSync.bgColor,
            border: `1px solid ${estadoSync.borderColor}`,
            borderRadius: '4px',
            padding: '0.35rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: estadoSync.color,
            fontWeight: 600,
            fontSize: '0.8rem',
            transition: 'all 0.3s ease'
          }}
        >
          <span 
            style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              background: estadoSync.color, 
              borderRadius: '50%',
              boxShadow: `0 0 4px ${estadoSync.color}`,
              animation: isOnline ? 'none' : 'pulse 1.5s ease-in-out infinite'
            }}
          />
          {estadoSync.texto}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </footer>
  );
}