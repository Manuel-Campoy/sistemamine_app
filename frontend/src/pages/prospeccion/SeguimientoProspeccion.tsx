import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import localforage from 'localforage';
import api from '../../api/axiosConfig'; 
import { useAuth } from '../../context/AuthContext'; 
import toast from 'react-hot-toast';

const CRITERIO_CORTE_ORO = 3.5; 

interface Lote {
  idarealote: string; 
  nombrealias: string;
  idestatusprospeccion: string;
  leyestimada: number | null;
  tonelajeestimado: number | null;
  coordenadas: any[] | null;
  estatus: {
    descripcion: string;
  };
  mina?: {
    aliasmina: string;
  };
}

interface EstatusCatalogo {
  idestatusprospeccion: string;
  descripcion: string;
}

export default function SeguimientoProspeccion() {
  const { user } = useAuth(); 
  const ROL_ACTUAL = user?.rol || 'Sin Rol'; 
  const USUARIO_ID = user?.id || 'USER-UNKNOWN'; 

  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loteSeleccionado, setLoteSeleccionado] = useState<Lote | null>(null);
  const [estatusList, setEstatusList] = useState<EstatusCatalogo[]>([]);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [nuevoEstatusId, setNuevoEstatusId] = useState('');
  const [ley, setLey] = useState('');
  const [tonelaje, setTonelaje] = useState('');
  const [motivo, setMotivo] = useState('');
  const [pdfs, setPdfs] = useState<any[]>([]);

  useEffect(() => {
    cargarDatosIniciales();
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    }
  }, []);

  const cargarDatosIniciales = async () => {
    setIsLoading(true);
    try {
      const [resLotes, resEstatus] = await Promise.all([
        api.get('/prospeccion'),
        api.get('/prospeccion/estatus-prospeccion')
      ]);
      setLotes(resLotes.data.data || []);
      const estatusData = Array.isArray(resEstatus.data) 
        ? resEstatus.data 
        : (resEstatus.data.data || []);
      setEstatusList(estatusData);
    } catch (err: any) {
      if (!navigator.onLine) setErrorMsg('Modo Offline: Mostrando datos en caché');
      else setErrorMsg(err.response?.data?.error || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const seleccionarLote = (lote: Lote) => {
    setLoteSeleccionado(lote);
    setNuevoEstatusId(lote.idestatusprospeccion);
    setLey(lote.leyestimada?.toString() || '');
    setTonelaje(lote.tonelajeestimado?.toString() || '');
    setMotivo('');
    setPdfs([]);
  };

  const onDropPdf = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setPdfs(prev => [...prev, { nombre: file.name, url: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  
  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop: onDropPdf, 
    accept: { 'application/pdf': ['.pdf'] } 
  });

const registrarAuditoria = async (
  loteId: string,
  nuevoEstatus: string,
  valoresAntes: any,
  valoresDespues: any
) => {
  try {
    await api.post('/dashboard/auditoria', {
      usuarioId: USUARIO_ID,
      rol: ROL_ACTUAL,
      accion: `Cambio de estatus a "${nuevoEstatus}"`,
      entidadafectada: 'prospeccion',
      idregistroafectado: loteId,
      valoresantes: JSON.stringify(valoresAntes),
      valoresdespues: JSON.stringify(valoresDespues),
      fechahora: new Date().toISOString()
    });
  } catch (err: any) {
    console.warn('⚠️ Auditoría no registrada (puede fallar en offline)', err.message);
  }
};

const validarTransicion = () => {
  const infoNuevoEstatus = estatusList.find(e => e.idestatusprospeccion === nuevoEstatusId);
  const nombreEstatus = infoNuevoEstatus?.descripcion || '';

  if (nombreEstatus === 'Estimado Registrado' && (!ley || parseFloat(ley) <= 0)) {
    return "Para registrar el estimado, la Ley es obligatoria y debe ser mayor a 0.";
  }
  
  if ((nombreEstatus === 'Autorizado Para Movimiento' || nombreEstatus === 'Rechazado') && (!loteSeleccionado?.leyestimada && !ley)) {
    return "No se puede Autorizar o Rechazar sin una ley estimada registrada.";
  }

  if (nombreEstatus === 'Rechazado' && !motivo) {
    return "Para Rechazar un lote, el motivo es obligatorio.";
  }
  
  const leyFinal = parseFloat(ley) || loteSeleccionado?.leyestimada || 0;
  
  if (nombreEstatus === 'Autorizado Para Movimiento' && leyFinal < CRITERIO_CORTE_ORO && !motivo) {
    return `La ley (${leyFinal} g/t) es menor al corte (${CRITERIO_CORTE_ORO} g/t). Debes ingresar una justificación para autorizar.`;
  }

  if (nombreEstatus === 'Rechazado' && leyFinal >= CRITERIO_CORTE_ORO && !motivo) {
    return `La ley (${leyFinal} g/t) es viable. Debes ingresar un motivo de contradicción para rechazarla.`;
  }
  
  return null; 
};

const guardarSeguimiento = async () => {
  if (!loteSeleccionado) return;
  
  const errorValidacion = validarTransicion();
  if (errorValidacion) {
    toast.error(errorValidacion);
    return;
  }

  const toastId = toast.loading('Guardando y notificando...');
  setIsLoading(true);
  
  const valoresAntes = {
    idestatusprospeccion: loteSeleccionado.idestatusprospeccion,
    leyestimada: loteSeleccionado.leyestimada,
    tonelajeestimado: loteSeleccionado.tonelajeestimado,
  };

  const payload = {
    idestatusprospeccion: nuevoEstatusId,
    leyestimada: ley ? parseFloat(ley) : null,
    tonelajeestimado: tonelaje ? parseFloat(tonelaje) : null,
    observaciones: motivo ? `[Seguimiento]: ${motivo}` : undefined,
    usuarioModificacion: USUARIO_ID,
    rolModificacion: ROL_ACTUAL,
    fechaModificacion: new Date().toISOString()
  };

  if (!isOnline) {
    const queue: any[] = await localforage.getItem('seguimientoQueue') || [];
    queue.push({ 
      idarealote: loteSeleccionado.idarealote, 
      payload,
      auditor: {
        usuarioId: USUARIO_ID,
        rol: ROL_ACTUAL,
        timestamp: new Date().toISOString()
      }
    });
    await localforage.setItem('seguimientoQueue', queue);
    
    toast.success('Modo Offline: Evaluación guardada localmente.', { id: toastId });
    setIsLoading(false);
    setLoteSeleccionado(null);
    return;
  }

  try {
    await api.put(`/prospeccion/${loteSeleccionado.idarealote}`, payload);
    
    const infoNuevoEstatus = estatusList.find(e => e.idestatusprospeccion === nuevoEstatusId);
    const estatusNombre = infoNuevoEstatus?.descripcion || nuevoEstatusId;

    await registrarAuditoria(
      loteSeleccionado.idarealote,
      estatusNombre,
      valoresAntes,
      payload
    );

    if (estatusNombre === 'Autorizado Para Movimiento' || estatusNombre === 'Rechazado') {
      try {
        await api.post('/dashboard/notificaciones/lote', {
          loteAlias: loteSeleccionado.nombrealias,
          estatus: estatusNombre === 'Autorizado Para Movimiento' ? 'Autorizado' : 'Rechazado',
          mensaje: motivo,
          correoDestino: 'mcampoyteran5@gmail.com' 
        });
      } catch (errMail) {
        console.warn('Correo no enviado, pero los datos se guardaron.', errMail);
      }
    }
    
    toast.success('¡Estatus actualizado y notificado!', { id: toastId });
    setLoteSeleccionado(null);
    cargarDatosIniciales();
  } catch (err: any) {
    toast.error(err.response?.data?.error || 'Error al guardar en el servidor.', { id: toastId });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', padding: '2rem', minHeight: '80vh' }}>
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', background: 'var(--primary-dark)', color: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Seguimiento de Lotes</h2>
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Evaluación de Ley y Autorización</p>
        </div>
        
        {errorMsg && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', fontSize: '0.875rem' }}>{errorMsg}</div>}

        <div style={{ padding: '1rem', overflowY: 'auto', flex: 1 }}>
          {lotes.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '2rem' }}>No hay lotes para mostrar</div>
          ) : (
            lotes.map(lote => (
              <div 
                key={lote.idarealote} 
                onClick={() => seleccionarLote(lote)}
                style={{ 
                  padding: '1rem', border: '1px solid var(--gray-200)', borderRadius: '8px', marginBottom: '1rem', cursor: 'pointer',
                  background: loteSeleccionado?.idarealote === lote.idarealote ? '#eff6ff' : 'white',
                  borderColor: loteSeleccionado?.idarealote === lote.idarealote ? 'var(--primary-blue)' : 'var(--gray-200)',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--gray-800)' }}>{lote.nombrealias}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: '0.25rem' }}>
                  Estatus Actual: <span style={{ fontWeight: 'bold', color: 'var(--primary-blue)' }}>{lote.estatus?.descripcion}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {loteSeleccionado ? (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '2rem', animation: 'fadeIn 0.3s' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--gray-800)' }}>
            Evaluación: {loteSeleccionado.nombrealias}
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="nuevoEstatus" className="form-label">Cambiar a Estatus:</label>
            <select id="nuevoEstatus" name="nuevoEstatus" className="form-select" value={nuevoEstatusId} onChange={e => setNuevoEstatusId(e.target.value)}>
              {estatusList.map(e => (
                <option key={e.idestatusprospeccion} value={e.idestatusprospeccion}>
                  {e.descripcion}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ 
            padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem',
            background: (parseFloat(ley) || loteSeleccionado.leyestimada || 0) >= CRITERIO_CORTE_ORO ? '#d1fae5' : '#fee2e2',
            color: (parseFloat(ley) || loteSeleccionado.leyestimada || 0) >= CRITERIO_CORTE_ORO ? '#065f46' : '#991b1b',
            border: `1px solid ${(parseFloat(ley) || loteSeleccionado.leyestimada || 0) >= CRITERIO_CORTE_ORO ? '#10b981' : '#ef4444'}`
          }}>
            <strong>💡 Inteligencia de Mina:</strong><br/>
            Ley: {(parseFloat(ley) || loteSeleccionado.leyestimada || 0)} g/t vs Corte: {CRITERIO_CORTE_ORO} g/t.<br/>
            Sugerencia: <strong>{(parseFloat(ley) || loteSeleccionado.leyestimada || 0) >= CRITERIO_CORTE_ORO ? 'AUTORIZAR ✅' : 'RECHAZAR ❌'}</strong>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label htmlFor="ley" className="form-label required">Ley Lab (g/t)</label>
              <input id="ley" name="ley" type="number" step="0.01" className="form-input" value={ley} onChange={e => setLey(e.target.value)} />
            </div>
            <div>
              <label htmlFor="tonelaje" className="form-label">Tonelaje Est. (t)</label>
              <input id="tonelaje" name="tonelaje" type="number" step="0.01" className="form-input" value={tonelaje} onChange={e => setTonelaje(e.target.value)} />
            </div>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="motivo" className="form-label">Justificación / Observaciones</label>
            <textarea id="motivo" name="motivo" className="form-input" rows={3} value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="¿Por qué se autoriza o rechaza?"></textarea>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label className="form-label">Resultados PDF (Opcional)</label>
            <div {...getRootProps()} style={{ border: '2px dashed var(--gray-300)', padding: '1rem', textAlign: 'center', borderRadius: '8px', cursor: 'pointer' }}>
              <input {...getInputProps()} />
              <div style={{ fontSize: '1.2rem' }}>📄 Toca para adjuntar reporte</div>
            </div>
            {pdfs.length > 0 && <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--primary-blue)' }}>✓ {pdfs.length} archivo(s) listo(s)</div>}
          </div>

          <button className="btn btn-primary" onClick={guardarSeguimiento} disabled={isLoading} style={{ width: '100%', padding: '1rem' }}>
            {isLoading ? 'Guardando...' : (isOnline ? '💾 Actualizar en Servidor' : '💾 Guardar en Tablet')}
          </button>

        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)', borderRadius: '12px', border: '2px dashed var(--gray-200)', color: 'var(--gray-500)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <div>Selecciona un lote para evaluar</div>
          </div>
        </div>
      )}

    </div>
  );
}