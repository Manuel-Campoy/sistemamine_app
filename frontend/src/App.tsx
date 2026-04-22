import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthContainer from './components/auth/AuthContainer';
import { AuthProvider } from './context/AuthContext'; 
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardHome from './pages/DashboardHome';

import UsuariosList from './pages/catalogos/UsuariosList';
import UsuarioForm from './pages/catalogos/UsuarioForm';
import PermisosMatrix from './pages/catalogos/PermisosMatrix';

import UnidadesList from './pages/catalogos/UnidadesList';
import TipoRocaList from './pages/catalogos/TipoRocaList';
import EstatusProspeccionList from './pages/catalogos/EstatusProspeccionList';

import VehiculosList from './pages/catalogos/VehiculosList';
import VehiculoForm from './pages/catalogos/VehiculoForm';

import CombustibleList from './pages/combustible/CombustibleList';
import CombustibleForm from './pages/combustible/CombustibleForm';

import MinasList from './pages/catalogos/MinasList';
import MinaForm from './pages/catalogos/MinaForm';

import ProspeccionList from './pages/prospeccion/ProspeccionList';
import ProspeccionForm from './pages/prospeccion/ProspeccionForm';
import SeguimientoProspeccion from './pages/prospeccion/SeguimientoProspeccion';

import MovimientoListForm from './pages/movimiento/MovimientoListForm';
import MovimientoTierraForm from './pages/movimiento/MovimientoTierraForm';
import MovimientosHistory from './pages/movimiento/MovimientoHistory';

import ProduccionList from './pages/produccion/ProduccionList';
import ProduccionOperacion from './pages/produccion/ProduccionOperacion';
import PostProduccionList from './pages/postproduccion/PostProduccionList';

import ReportesCenter from './pages/reportes/ReportesCenter';
import NotificacionesList from './pages/notificaciones/NotificacionesList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<AuthContainer />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              
              <Route path="usuarios" element={<UsuariosList />} />
              <Route path="usuarios/nuevo" element={<UsuarioForm />} />
              <Route path="usuarios/editar/:id" element={<UsuarioForm />} />
              <Route path="permisos" element={<PermisosMatrix />} />

              <Route path="unidades" element={<UnidadesList />} />
              <Route path="rocas" element={<TipoRocaList />} />
              <Route path="estatus-prospeccion" element={<EstatusProspeccionList />} />

              <Route path="vehiculos" element={<VehiculosList />} />
              <Route path="vehiculos/nuevo" element={<VehiculoForm />} />
              <Route path="vehiculos/editar/:id" element={<VehiculoForm />} />

              <Route path="/dashboard/combustible" element={<CombustibleList />} />
              <Route path="/dashboard/combustible/despacho" element={<CombustibleForm />} />

              <Route path="minas" element={<MinasList />} />
              <Route path="minas/nuevo" element={<MinaForm />} />
              <Route path="minas/editar/:id" element={<MinaForm />} />

              <Route path="prospeccion" element={<ProspeccionList />} />
              <Route path="prospeccion/nuevo" element={<ProspeccionForm />} />
              <Route path="prospeccion/editar/:id" element={<ProspeccionForm />} />
              <Route path="seguimiento-prospeccion" element={<SeguimientoProspeccion />} />

              <Route path="movimiento" element={<MovimientoListForm />} />
              <Route path="movimiento/registrar/:idarealote" element={<MovimientoTierraForm />} />
              <Route path="movimiento/historial/:idarealote?" element={<MovimientosHistory />} />

              <Route path="produccion" element={<ProduccionList />} />
              <Route path="produccion/operacion/:idlote" element={<ProduccionOperacion />} />
              <Route path="cierre-post-produccion" element={<PostProduccionList />} />  
                          
              <Route path="reportes" element={<ReportesCenter />} />
              <Route path="notificaciones" element={<NotificacionesList />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#333', color: '#fff', fontWeight: 'bold' },
            success: { style: { background: '#10b981' } },
            error: { style: { background: '#ef4444' } },
          }} 
        />
      </BrowserRouter>
    </AuthProvider> 
  ); 
}

export default App;