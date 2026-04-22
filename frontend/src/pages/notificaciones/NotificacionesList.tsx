import { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { socket } from '../../api/socket';
import toast from 'react-hot-toast';

interface Notificacion {
  idnotificacion: string; 
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechacreacion: string;
}

export default function NotificacionesList() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dashboard/notificaciones');
      setNotificaciones(response.data.data || response.data);
      setErrorMsg('');
    } catch (error: any) {
      setErrorMsg('Error al conectar con el servidor para obtener notificaciones.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const escucharNuevaNotificacion = (nuevaNotificacion: Notificacion) => {
      setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
      toast(`Nueva alerta: ${nuevaNotificacion.titulo}`, { icon: '🔔' });
    };
    socket.on('nueva_notificacion', escucharNuevaNotificacion);
    return () => {
      socket.off('nueva_notificacion', escucharNuevaNotificacion);
    };
  }, []);

  const marcarComoLeida = async (id: string) => {
    try {
      await api.put(`/dashboard/notificaciones/${id}/leer`);
      setNotificaciones(prev => 
        prev.map(n => n.idnotificacion === id ? { ...n, leida: true } : n)
      );
      toast.success('Marcada como leída');
    } catch (error) {
      toast.error('No se pudo actualizar el estado.');
    }
  };

  const getIconoYColor = (tipo: string, leida: boolean) => {
    const opacidad = leida ? '0.6' : '1';
    if (tipo === 'Éxito') return { icon: '✅', color: '#10b981', bg: '#d1fae5', opacity: opacidad };
    if (tipo === 'Alerta' || tipo === 'Error') return { icon: '⚠️', color: '#ef4444', bg: '#fee2e2', opacity: opacidad };
    return { icon: 'ℹ️', color: '#3b82f6', bg: '#dbeafe', opacity: opacidad };
  };

  const noLeidasCount = notificaciones.filter(n => !n.leida).length;

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'white' }}>
      
      <div className="page-header" style={{ padding: '2rem', borderBottom: '2px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-dark)', margin: 0 }}>
            Centro de Notificaciones
          </h1>
          <p className="page-subtitle" style={{ color: 'var(--gray-600)', margin: 0 }}>
            Avisos del sistema y alertas operativas 
          </p>
        </div>
        
        {noLeidasCount > 0 && (
          <div style={{ background: '#ef4444', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 700, fontSize: '0.875rem' }}>
            {noLeidasCount} sin leer
          </div>
        )}
      </div>

      <div className="page-content" style={{ padding: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
          <button onClick={cargarNotificaciones} className="btn btn-secondary btn-sm">
            🔄 Actualizar
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-500)', fontWeight: 600 }}>
            Cargando bandeja de notificaciones...
          </div>
        ) : errorMsg ? (
          <div className="alert alert-error" style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px' }}>
            {errorMsg}
          </div>
        ) : notificaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--gray-50)', borderRadius: '12px' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--gray-600)', fontWeight: 600 }}>Tu bandeja está vacía</div>
            <div style={{ color: 'var(--gray-500)' }}>No hay avisos recientes del sistema.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {notificaciones.map((notif) => {
              const estilo = getIconoYColor(notif.tipo, notif.leida);
              
              return (
                <div 
                  key={notif.idnotificacion} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '1.5rem', 
                    padding: '1.5rem', 
                    background: notif.leida ? 'var(--gray-50)' : 'white', 
                    border: `1px solid ${notif.leida ? 'var(--gray-200)' : 'var(--primary-blue)'}`, 
                    borderRadius: '12px',
                    opacity: estilo.opacity,
                    transition: 'all 0.2s',
                    boxShadow: notif.leida ? 'none' : '0 4px 6px rgba(37, 99, 235, 0.1)'
                  }}
                >
                  <div style={{ fontSize: '2rem', background: estilo.bg, padding: '1rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {estilo.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: notif.leida ? 600 : 800, color: 'var(--gray-800)' }}>
                        {notif.titulo}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: 600 }}>
                        {new Date(notif.fechacreacion).toLocaleString()}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--gray-600)', lineHeight: 1.5 }}>
                      {notif.mensaje}
                    </p>
                  </div>

                  {!notif.leida && (
                    <button 
                      onClick={() => marcarComoLeida(notif.idnotificacion)}
                      style={{ 
                        background: 'transparent', 
                        border: '2px solid var(--primary-blue)', 
                        color: 'var(--primary-blue)', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Marcar Leída
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}