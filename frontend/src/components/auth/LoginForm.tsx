import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig'; 
import { useAuth } from '../../context/AuthContext'; 

interface Props {
  onNavigate: (view: 'LOGIN' | 'RECOVERY' | 'LOCKED') => void;
}

export default function LoginForm({ onNavigate }: Props) {
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await api.post('/login', { email, password });
      const data = response.data;

      localStorage.setItem('token', data.token);

      login(data.usuario);
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 3) {
        onNavigate('LOCKED');
      } else {
        const mensaje = error.response?.data?.error || 'No se pudo conectar con el servidor. Verifica tu conexión.';
        setErrorMsg(mensaje);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card" style={{ width: '100%', maxWidth: '500px' }}>
      <div className="card-header">
        <div className="logo">⛏️</div>
        <h1 className="card-title">Sistema Minero</h1>
        <p className="card-subtitle">Sistema de Gestión Minera</p>
      </div>

      <div className="card-body">
        {errorMsg && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            <span><strong>Error:</strong> {errorMsg}</span>
          </div>
        )}

        {failedAttempts > 0 && failedAttempts < 3 && (
          <div style={{ background: '#fef3c7', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
            <strong>💡 Tip:</strong> Después de 3 intentos fallidos, tu cuenta será bloqueada (Llevas {failedAttempts}).
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Correo</label>
            <div className="form-input-wrapper">
              <input 
                type="email" 
                className="form-input" 
                placeholder="usuario@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
                style={{ paddingLeft: '3rem' }} 
              />
              <span className="input-icon">👤</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="form-input-wrapper">
              <input 
                type={showPassword ? "text" : "password"}
                className="form-input" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                style={{ paddingLeft: '3rem', paddingRight: '3.5rem' }} 
              />
              <span className="input-icon">🔒</span>
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.8 : 1, marginTop: '1rem', padding: '1.25rem' }}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Verificando...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
              </>
            )}
          </button>

          <div className="text-center" style={{ marginTop: '1.5rem' }}>
            <button 
              type="button" 
              className="link" 
              onClick={() => onNavigate('RECOVERY')}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}