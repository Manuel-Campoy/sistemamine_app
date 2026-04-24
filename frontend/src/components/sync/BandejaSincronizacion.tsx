import { useState, useEffect } from 'react';
import { localDb } from '../../db/localDb';
import api from '../../api/axiosConfig';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { useNotification } from '../../hooks/useNotification';
import { 
  limpiarCola, 
  incrementarSincExitosas,
  incrementarFallos
} from '../../utils/syncQueue'; 

export default function BandejaSincronizacion() {
  const isOnline = useNetworkStatus();
  const { success, error } = useNotification(); 
  
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [progreso, setProgreso] = useState({ actual: 0, total: 0 });

  const cargarPendientes = async () => {
    try {
      const todosLosMovimientos = await localDb.movimientos.toArray();
      const sinSincronizar = todosLosMovimientos.filter(mov => mov.sincronizado === false);
      setPendientes(sinSincronizar);
    } catch (err) {
      console.error("Error al leer base local:", err);
    }
  };

  useEffect(() => {
    cargarPendientes();
    
    // ✅ PUNTO 5: Intentar sincronizar automáticamente cuando vuelve online
    if (isOnline && pendientes.length > 0) {
      const timeoutReintento = setTimeout(() => {
        sincronizacionAutomatica();
      }, 1000); // Esperar 1s después de que vuelva online
      
      return () => clearTimeout(timeoutReintento);
    }
  }, [isOnline]);

  // ✅ PUNTO 5: Sincronización automática
  const sincronizacionAutomatica = async () => {
    if (!isOnline || pendientes.length === 0 || isSyncing) return;

    setIsSyncing(true);
    setProgreso({ actual: 0, total: pendientes.length });
    let exitos = 0;

    for (let i = 0; i < pendientes.length; i++) {
      const mov = pendientes[i];
      try {
        const payload = { ...mov };
        delete payload.sincronizado;
        delete payload.intentoSync;
        delete payload.idmovimiento;
        delete payload.timestamp_creacion;
        delete payload.timestamp_sincronizado;
        delete payload.conflicto_detectado;

        await api.post('/movimientos', payload);

        // ✅ PUNTO 2: Actualizar timestamp de sincronización (Last-Write-Wins)
        await localDb.movimientos.update(mov.idmovimiento, { 
          sincronizado: true,
          timestamp_sincronizado: Date.now()
        });
        
        incrementarSincExitosas();
        exitos++;
      } catch (err) {
        console.error(`Fallo al sincronizar el viaje ${mov.idmovimiento}:`, err);
        await localDb.movimientos.update(mov.idmovimiento, { 
          intentoSync: (mov.intentoSync || 0) + 1 
        });
        incrementarFallos();
      } finally {
        setProgreso(prev => ({ ...prev, actual: prev.actual + 1 }));
      }
    }

    setIsSyncing(false);
    
    // ✅ PUNTO 5: Limpiar localStorage después de sincronización exitosa
    if (exitos === pendientes.length) {
      limpiarCola();
      success(`¡${exitos} viajes respaldados en el servidor!`, { icon: '☁️' });
    } else {
      error(`Se sincronizaron ${exitos} de ${pendientes.length} viajes. La red podría estar inestable.`);
    }
    
    cargarPendientes();
  };

  const iniciarSincronizacion = async () => {
    if (!isOnline) {
      error("Necesitas conexión a internet para sincronizar."); 
      return;
    }
    if (pendientes.length === 0) return;

    setIsSyncing(true);
    setProgreso({ actual: 0, total: pendientes.length });
    let exitos = 0;

    for (let i = 0; i < pendientes.length; i++) {
      const mov = pendientes[i];
      try {
        const payload = { ...mov };
        delete payload.sincronizado;
        delete payload.intentoSync;
        delete payload.idmovimiento;
        delete payload.timestamp_creacion;
        delete payload.timestamp_sincronizado;
        delete payload.conflicto_detectado;

        await api.post('/movimientos', payload);

        // ✅ PUNTO 2: Actualizar timestamp de sincronización
        await localDb.movimientos.update(mov.idmovimiento, { 
          sincronizado: true,
          timestamp_sincronizado: Date.now()
        });
        
        incrementarSincExitosas();
        exitos++;
      } catch (err) {
        console.error(`Fallo al sincronizar el viaje ${mov.idmovimiento}:`, err);
        await localDb.movimientos.update(mov.idmovimiento, { 
          intentoSync: (mov.intentoSync || 0) + 1 
        });
        incrementarFallos();
      } finally {
        setProgreso(prev => ({ ...prev, actual: prev.actual + 1 }));
      }
    }

    setIsSyncing(false);
    cargarPendientes(); 

    if (exitos === pendientes.length) {
      limpiarCola();
      success(`¡${exitos} viajes respaldados en el servidor!`, { icon: '☁️' }); 
    } else {
      error(`Se sincronizaron ${exitos} de ${pendientes.length} viajes. La red podría estar inestable.`);
    }
  };

  if (pendientes.length === 0 && !isSyncing) return null;

  const porcentaje = progreso.total > 0 ? Math.round((progreso.actual / progreso.total) * 100) : 0;

  return (
    <div style={{ 
      background: 'white', 
      border: '1px solid var(--warning-amber)', 
      borderRadius: '8px', 
      padding: '1.5rem', 
      marginBottom: '2rem',
      boxShadow: '0 4px 6px -1px rgba(245, 158, 11, 0.1)',
      borderLeft: '5px solid var(--warning-amber)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div>
          <h3 style={{ margin: 0, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span> Tienes datos sin respaldar
          </h3>
          <p style={{ margin: '0.25rem 0 0 0', color: 'var(--gray-600)', fontSize: '0.9rem' }}>
            Hay <strong>{pendientes.length} viaje(s)</strong> registrados en modo offline que aún no se envían al servidor principal.
          </p>
        </div>

        <div>
          {!isSyncing ? (
            <button 
              onClick={iniciarSincronizacion} 
              disabled={!isOnline}
              style={{
                background: isOnline ? 'var(--primary-blue)' : 'var(--gray-300)',
                color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '6px',
                fontWeight: 600, cursor: isOnline ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
              }}
            >
              {isOnline ? '☁️ Sincronizar Ahora' : '📡 Sin Señal para Sincronizar'}
            </button>
          ) : (
            <div style={{ textAlign: 'right', minWidth: '150px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-blue)' }}>
                Subiendo {progreso.actual} de {progreso.total}...
              </span>
            </div>
          )}
        </div>
      </div>

      {isSyncing && (
        <div style={{ marginTop: '1rem', width: '100%', background: 'var(--gray-200)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'var(--primary-blue)', width: `${porcentaje}%`, transition: 'width 0.3s ease-out' }}></div>
        </div>
      )}
    </div>
  );
}