import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axiosConfig';
import { socket } from '../api/socket';
import toast from 'react-hot-toast';
import BandejaSincronizacion from '../components/sync/BandejaSincronizacion';

interface DashboardData {
  kpis: {
    toneladas: number;
    lotes: number;
    viajes: number;
  };
  grafica: { dia: string; toneladas: number }[];
}

export default function DashboardHome() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const cargarDatosDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/dashboard/resumen');
      setData(response.data);
    } catch (err: any) {
      setError('No se pudieron cargar los datos del dashboard.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const escucharNuevoViaje = (nuevoViaje: { toneladas: number }) => {
      toast.success(`¡Nuevo viaje registrado! +${nuevoViaje.toneladas} t`, {
        icon: '🚛',
        style: { background: '#1e293b', color: '#fff' }
      });
      setData((prevData) => {
        if (!prevData) return prevData;

        const nuevaGrafica = [...prevData.grafica];

        if (nuevaGrafica.length > 0) {
          const ultimoDiaIndex = nuevaGrafica.length - 1;
          nuevaGrafica[ultimoDiaIndex] = {
            ...nuevaGrafica[ultimoDiaIndex],
            toneladas: nuevaGrafica[ultimoDiaIndex].toneladas + nuevoViaje.toneladas
          };
        }

        return {
          ...prevData,
          kpis: {
            ...prevData.kpis,
            toneladas: prevData.kpis.toneladas + nuevoViaje.toneladas,
            viajes: prevData.kpis.viajes + 1, 
          },
          grafica: nuevaGrafica
        };
      });
    };

    socket.on('nueva_dompada', escucharNuevoViaje);
    return () => {
      socket.off('nueva_dompada', escucharNuevoViaje);
    };
  }, []);

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--gray-500)' }}>Cargando métricas de la mina... ⏳</div>;
  }

  if (error) {
    return <div className="alert alert-error">⚠️ {error}</div>;
  }

  return (
    <div style={{ width: '100%' }}>

      <BandejaSincronizacion />
      
      {/* SECCIÓN 1: Tarjetas de Indicadores (KPIs) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        <div style={{ background: 'white', border: '1px solid var(--gray-300)', borderRadius: '8px', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#84cc16', marginBottom: '0.5rem', transition: 'all 0.3s ease' }}>
            {data?.kpis.toneladas.toLocaleString('es-MX', { maximumFractionDigits: 2 })}
          </div>
          <div style={{ color: 'var(--gray-600)', fontSize: '1.1rem', fontWeight: 500 }}>Toneladas Extraídas</div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--gray-300)', borderRadius: '8px', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary-blue)', marginBottom: '0.5rem' }}>
            {data?.kpis.lotes}
          </div>
          <div style={{ color: 'var(--gray-600)', fontSize: '1.1rem', fontWeight: 500 }}>Lotes Registrados</div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--gray-300)', borderRadius: '8px', padding: '2rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary-orange)', marginBottom: '0.5rem', transition: 'all 0.3s ease' }}>
            {data?.kpis.viajes}
          </div>
          <div style={{ color: 'var(--gray-600)', fontSize: '1.1rem', fontWeight: 500 }}>Viajes de Extracción</div>
        </div>

      </div>

      {/* SECCIÓN 2: Gráfica de Producción Semanal */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--gray-800)', fontWeight: 600, margin: 0 }}>
            Producción Semanal
          </h2>
        </div>
        
        <div style={{ background: 'white', border: '1px solid var(--gray-300)', borderRadius: '8px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div className="contenedor-grafica">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.grafica} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`${value} t`, 'Extracción']}
                />
                <Bar dataKey="toneladas" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} barSize={40} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
}