import { useState } from 'react';
import api from '../../api/axiosConfig'; // Ajusta la ruta si es necesario

interface Props {
  onNavigate: (view: 'LOGIN' | 'RECOVERY' | 'LOCKED') => void;
}

export default function PasswordRecovery({ onNavigate }: Props) {
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isValidPassword = hasLength && hasUpper && hasNumber && hasSpecial;
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await api.post('/auth/olvide-password', { email });
      setStep(2); 
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'Error al conectar con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await api.post('/auth/verificar-codigo', { email, codigo: code });
      setStep(3); 
    } catch (error: any) {
      setErrorMsg(error.response?.data?.error || 'El código es incorrecto o ha caducado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValidPassword && passwordsMatch) {
      setErrorMsg('');
      setIsLoading(true);

      try {
        await api.post('/auth/reset-password', { 
          email, 
          codigo: code, 
          nuevaPassword: newPassword 
        });
        setStep(4); 
      } catch (error: any) {
        setErrorMsg(error.response?.data?.error || 'Error al actualizar la contraseña.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (step === 4) {
    return (
      <div className="login-card" style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
        <div className="card-header">
          <div className="logo">✅</div>
          <h1 className="card-title">¡Actualizada!</h1>
          <p className="card-subtitle">Tu contraseña ha sido cambiada</p>
        </div>
        <div className="card-body">
          <div className="alert alert-success">
            <span className="alert-icon">🎉</span>
            <span>Ya puedes iniciar sesión con tu nueva contraseña.</span>
          </div>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('LOGIN')} style={{ marginTop: '2rem' }}>
            <span>Ir al Login</span>
            <span>→</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="login-card" style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
      <div className="card-header">
        <div className="logo">🔐</div>
        <h1 className="card-title">Recuperar Contraseña</h1>
        <p className="card-subtitle">
          {step === 1 && "Paso 1: Verificación"}
          {step === 2 && "Paso 2: Código"}
          {step === 3 && "Paso 3: Nueva Contraseña"}
        </p>
      </div>

      <div className="card-body">
        <div className="steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {/* ALERTA DE ERROR GLOBAL */}
        {errorMsg && (
          <div className="alert alert-error" style={{ marginBottom: '1rem', background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* PASO 1: CORREO */}
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <div className="alert alert-info">
              <span className="alert-icon">ℹ️</span>
              <span>Ingresa tu correo para recibir el código.</span>
            </div>
            <div className="form-group">
              <label className="form-label">Correo Electrónico</label>
              <div className="form-input-wrapper">
                <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
              <span>{isLoading ? 'Enviando...' : 'Enviar Código'}</span>
            </button>
            <div className="divider">o</div>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate('LOGIN')} disabled={isLoading}>
              <span>← Volver al Login</span>
            </button>
          </form>
        )}

        {/* PASO 2: CÓDIGO */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode}>
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>Código enviado a <strong>{email}</strong></span>
            </div>
            <div className="form-group">
              <label className="form-label">Código (6 dígitos)</label>
              <div className="form-input-wrapper">
                <input type="text" className="form-input" required maxLength={6} pattern="[0-9]{6}" style={{ textAlign: 'center', letterSpacing: '0.5rem', fontWeight: 700 }} value={code} onChange={(e) => setCode(e.target.value)} disabled={isLoading} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isLoading || code.length < 6} style={{ opacity: (isLoading || code.length < 6) ? 0.7 : 1 }}>
              <span>{isLoading ? 'Verificando...' : 'Verificar Código'}</span>
            </button>
            <div className="divider">o</div>
            <button type="button" className="btn btn-secondary" onClick={() => { setStep(1); setErrorMsg(''); setCode(''); }} disabled={isLoading}>
              <span>← Corregir correo</span>
            </button>
          </form>
        )}

        {/* PASO 3: NUEVA CONTRASEÑA */}
        {step === 3 && (
          <form onSubmit={handleSetNewPassword}>
            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <div className="form-input-wrapper">
                <input type={showPassword ? "text" : "password"} className="form-input" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={isLoading} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <div className="form-input-wrapper">
                <input type={showPassword ? "text" : "password"} className="form-input" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} />
              </div>
              {!passwordsMatch && confirmPassword !== '' && (
                <p style={{ color: 'var(--danger-red)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Las contraseñas no coinciden.</p>
              )}
            </div>

            <div className="password-requirements">
              <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--gray-700)' }}>Requisitos:</div>
              <div className={`requirement ${hasLength ? 'met' : ''}`}><span className="requirement-icon">{hasLength ? '✓' : '○'}</span><span>8 caracteres</span></div>
              <div className={`requirement ${hasUpper ? 'met' : ''}`}><span className="requirement-icon">{hasUpper ? '✓' : '○'}</span><span>1 Mayúscula</span></div>
              <div className={`requirement ${hasNumber ? 'met' : ''}`}><span className="requirement-icon">{hasNumber ? '✓' : '○'}</span><span>1 Número</span></div>
              <div className={`requirement ${hasSpecial ? 'met' : ''}`}><span className="requirement-icon">{hasSpecial ? '✓' : '○'}</span><span>1 Especial (!@#$%)</span></div>
            </div>

            <button type="submit" className="btn btn-success" disabled={!isValidPassword || !passwordsMatch || isLoading} style={{ marginTop: '1.5rem', opacity: (!isValidPassword || !passwordsMatch || isLoading) ? 0.7 : 1 }}>
              <span>{isLoading ? 'Guardando...' : 'Guardar Contraseña'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}