import { useState, useEffect } from 'react';

export default function Footer() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const anioActual = new Date().getFullYear();

  return (
    <footer 
      style={{
        background: 'white',
        borderTop: '1px solid var(--gray-200)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.85rem',
        color: 'var(--gray-600)',
        marginTop: 'auto', 
        zIndex: 10
      }}
    >
      {/* SECCIÓN IZQUIERDA: Versión del Sistema */}
      <div>
        <strong style={{ color: 'var(--primary-dark)' }}>Sistema Minero</strong> 
        <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>v1.0.0</span>
      </div>

      {/* SECCIÓN CENTRAL: Copyright */}
      <div className="ocultar-en-movil">
        &copy; {anioActual} Operaciones Mineras. Todos los derechos reservados.
      </div>

      {/* SECCIÓN DERECHA: Indicador de Red */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>Estado:</span>
        {isOnline ? (
          <span style={{ color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 4px #10b981' }}></span>
            Conectado al Servidor
          </span>
        ) : (
          <span style={{ color: '#d97706', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#f59e0b', borderRadius: '50%', boxShadow: '0 0 4px #f59e0b' }}></span>
            Modo Offline (Local)
          </span>
        )}
      </div>
    </footer>
  );
}