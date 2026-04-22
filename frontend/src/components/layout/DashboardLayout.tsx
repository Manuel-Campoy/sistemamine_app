import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { useAuth } from '../../context/AuthContext'; 
import api from '../../api/axiosConfig'; 
import { socket } from '../../api/socket';
import Footer from './Footer'; 
import useSincronizadorCatalogos from '../../hooks/useSincronizadorCatalogos';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const isOnline = useNetworkStatus();
  useSincronizadorCatalogos(isOnline);
  
  const { user, logout } = useAuth(); 
  const rol = user?.rol || 'Sin Rol';

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notificacionesSinLeer, setNotificacionesSinLeer] = useState(0); 
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const cargarNotificaciones = async () => {
      try {
        const response = await api.get('/dashboard/notificaciones');
        const sinLeer = response.data.filter((n: any) => !n.leida).length;
        setNotificacionesSinLeer(sinLeer);
      } catch (error) {
        console.warn("No se pudieron cargar las notificaciones");
      }
    };

    if (isOnline) cargarNotificaciones();

    const escucharNuevasNotificaciones = () => {
      setNotificacionesSinLeer(prev => prev + 1);
    };

    socket.on('nueva_notificacion', escucharNuevasNotificaciones);

    return () => {
      socket.off('nueva_notificacion', escucharNuevasNotificaciones);
    };
  }, [isOnline]);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const isDashboardActive = location.pathname === '/dashboard';
  const isCatalogosActive = location.pathname.includes('/usuarios') || location.pathname.includes('/unidades') || location.pathname.includes('/rocas') || location.pathname.includes('/estatus-prospeccion') || location.pathname.includes('/vehiculos') || location.pathname.includes('/minas');
  const isProspeccionActive = location.pathname.includes('/prospeccion') || location.pathname.includes('/seguimiento-prospeccion');
  const isProduccionActive = location.pathname.includes('/produccion') || location.pathname.includes('/cierre-post-produccion');
  const isMovimientoActive = location.pathname.includes('/movimiento');
  const isCombustibleActive = location.pathname.includes('/combustible'); 
  const isReportesActive = location.pathname.includes('/reportes');

  const iniciales = (user?.nombre || 'Usuario Desconocido')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const dropdownContainerStyle: React.CSSProperties = {
    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
    marginTop: '-0.5rem', backgroundColor: 'white', color: 'var(--gray-800)',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', borderRadius: '8px', overflow: 'hidden',
    minWidth: '220px', zIndex: 50, display: 'flex', flexDirection: 'column',
    border: '1px solid var(--gray-200)', textAlign: 'left'
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: '0.75rem 1.25rem', cursor: 'pointer', borderBottom: '1px solid var(--gray-100)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem',
    backgroundColor: 'white', fontWeight: 500, transition: 'background-color 0.2s'
  };

  const getNavStyle = (isActive: boolean) => ({
    cursor: 'pointer', fontWeight: isActive ? 600 : 400, color: 'white',
    padding: '1.5rem 0', borderBottom: isActive ? '3px solid var(--primary-blue)' : '3px solid transparent',
    opacity: isActive ? 1 : 0.8, transition: 'all 0.2s'
  });

  const isAdmin = rol === 'Super administrador' || rol === 'Administrador del sistema';
  const isSupervisor = rol === 'Supervisor' || isAdmin;
  const isGeologo = rol === 'Geólogo/Prospector' || isAdmin;
  const isOperador = rol === 'Chofer/operador' || isAdmin;
  const isCLevel = rol === 'Inversionista' || isAdmin; 

return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: 'var(--gray-100)' }}>
      
      <header style={{ 
        backgroundColor: 'var(--primary-dark)', color: 'white', padding: '0 2rem',
        height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        zIndex: 40 
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '250px' }}>
          <span style={{ fontSize: '1.5rem' }}>⛏️</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, letterSpacing: '0.5px' }}>Sistema Mina</h2>
        </div>
        
        <nav ref={navRef} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
            <li onClick={() => { setOpenMenu(null); navigate('/dashboard'); }} style={getNavStyle(isDashboardActive)}>
              Dashboard
            </li>

            {/* PROSPECCIÓN */}
            {(isGeologo || isSupervisor) && (
              <li style={{ position: 'relative' }}>
                <div style={{ ...getNavStyle(isProspeccionActive), display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => toggleMenu('prospeccion')}>
                  Prospección <span style={{ fontSize: '0.6rem' }}>▼</span>
                </div>
                {openMenu === 'prospeccion' && (
                  <div style={dropdownContainerStyle}>
                    <div onClick={() => { navigate('/dashboard/prospeccion'); setOpenMenu(null); }}
                      style={{ ...dropdownItemStyle, color: location.pathname.includes('/prospeccion') ? 'var(--primary-blue)' : 'inherit' }} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'} 
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      Prospección
                    </div>
                    <div onClick={() => { navigate('/dashboard/seguimiento-prospeccion'); setOpenMenu(null); }}
                      style={{ ...dropdownItemStyle, color: location.pathname.includes('/seguimiento-prospeccion') ? 'var(--primary-blue)' : 'inherit' }} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'} 
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      Seguimiento de Prospección
                    </div>
                  </div>
                )}
              </li>
            )}

            {/* MOVIMIENTO */}
            {(isOperador || isSupervisor) && (
              <li onClick={() => { setOpenMenu(null); navigate('/dashboard/movimiento'); }} style={getNavStyle(isMovimientoActive)}>
                Movimiento
              </li>
            )}

            {/* PRODUCCIÓN */}
            {(isSupervisor || isCLevel) && (
              <li style={{ position: 'relative' }}>
                <div style={{ ...getNavStyle(isProduccionActive), display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => toggleMenu('produccion')}>
                  Producción <span style={{ fontSize: '0.6rem' }}>▼</span>
                </div>
                {openMenu === 'produccion' && (
                  <div style={dropdownContainerStyle}>
                    <div onClick={() => { navigate('/dashboard/produccion'); setOpenMenu(null); }}
                      style={{ ...dropdownItemStyle, color: location.pathname.includes('/produccion') ? 'var(--primary-blue)' : 'inherit' }} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'} 
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      Producción 
                    </div>
                    <div onClick={() => { navigate('/dashboard/cierre-post-produccion'); setOpenMenu(null); }}
                      style={{ ...dropdownItemStyle, color: location.pathname.includes('/cierre-post-produccion') ? 'var(--primary-blue)' : 'inherit' }} 
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--gray-50)'} 
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
                    >
                      Cierre Post-Producción
                    </div>
                  </div>
                )}
              </li>
            )}

            {/* COMBUSTIBLE */}
            {(isOperador || isSupervisor || isCLevel) && (
              <li onClick={() => { setOpenMenu(null); navigate('/dashboard/combustible'); }} style={getNavStyle(isCombustibleActive)}>
                Combustible
              </li>
            )}

            {/* REPORTES */}
            {(isSupervisor || isCLevel) && (
              <li onClick={() => { setOpenMenu(null); navigate('/dashboard/reportes'); }} style={getNavStyle(isReportesActive)}>
                Reportes
              </li>
            )}

            {/* CATÁLOGOS */}
            {isAdmin && (
              <li style={{ position: 'relative' }}>
                <div style={{ ...getNavStyle(isCatalogosActive), display: 'flex', alignItems: 'center', gap: '0.3rem' }} onClick={() => toggleMenu('catalogos')}>
                  Catálogos <span style={{ fontSize: '0.6rem' }}>▼</span>
                </div>
                {openMenu === 'catalogos' && (
                  <div style={dropdownContainerStyle}>
                    <div onClick={() => { navigate('/dashboard/usuarios'); setOpenMenu(null); }} style={{ ...dropdownItemStyle }}>Usuarios</div>
                    <div onClick={() => { navigate('/dashboard/unidades'); setOpenMenu(null); }} style={{ ...dropdownItemStyle }}>Unidades</div>
                    <div onClick={() => { navigate('/dashboard/rocas'); setOpenMenu(null); }} style={{ ...dropdownItemStyle }}>Tipo de roca/material</div>
                    <div onClick={() => { navigate('/dashboard/estatus-prospeccion'); setOpenMenu(null); }} style={{ ...dropdownItemStyle }}>Estatus Prospección</div>
                    <div onClick={() => { navigate('/dashboard/vehiculos'); setOpenMenu(null); }} style={{ ...dropdownItemStyle }}>Vehículos</div>
                    <div onClick={() => { navigate('/dashboard/minas'); setOpenMenu(null); }} style={{ ...dropdownItemStyle }}>Empresas/Minas</div>
                  </div>
                )}
              </li>
            )}
          </ul>
        </nav>

        {/* PERFIL DE USUARIO DERECHA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '250px', justifyContent: 'flex-end' }}>
          <div onClick={() => navigate('/dashboard/notificaciones')} style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '1.4rem' }}>🔔</span>
            {notificacionesSinLeer > 0 && (
              <span style={{ 
                position: 'absolute', top: '2px', right: '0px', 
                backgroundColor: 'var(--danger-red)', color: 'white', 
                fontSize: '0.65rem', fontWeight: 'bold', 
                padding: '0.1rem 0.35rem', borderRadius: '10px',
                animation: 'pulse 2s infinite' 
              }}>
                {notificacionesSinLeer > 99 ? '+99' : notificacionesSinLeer}
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '35px', height: '35px', backgroundColor: 'var(--primary-blue)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
              {iniciales}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user?.nombre || 'Usuario'}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--gray-300)' }}>{user?.rol || 'Sin Rol'}</span>
            </div>
          </div>

          <div style={{ height: '30px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
          
          <button onClick={handleLogout} style={{ backgroundColor: 'transparent', color: '#fca5a5', border: '1px solid rgba(252, 165, 165, 0.5)', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.875rem' }}>
            Salir
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        <Outlet /> 
      </main>

      <Footer />

    </div>
  );
}