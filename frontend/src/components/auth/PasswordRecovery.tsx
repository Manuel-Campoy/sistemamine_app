import { useState } from 'react';

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
  
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
  const isValidPassword = hasLength && hasUpper && hasNumber && hasSpecial;
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2); 
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); 
  };

  const handleSetNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPassword && passwordsMatch) {
      setStep(4); 
    }
  };

  if (step === 4) {
    return (
      <div className="login-card">
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
    <div className="login-card">
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
                <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <span className="input-icon">📧</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary"><span>Enviar Código</span></button>
            <div className="divider">o</div>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate('LOGIN')}>
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
                <input type="text" className="form-input" required maxLength={6} pattern="[0-9]{6}" style={{ textAlign: 'center', letterSpacing: '0.5rem', fontWeight: 700 }} value={code} onChange={(e) => setCode(e.target.value)} />
                <span className="input-icon">🔢</span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary"><span>Verificar Código</span></button>
            <div className="divider">o</div>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}><span>← Corregir correo</span></button>
          </form>
        )}

        {/* PASO 3: NUEVA CONTRASEÑA */}
        {step === 3 && (
          <form onSubmit={handleSetNewPassword}>
            <div className="form-group">
              <label className="form-label">Nueva Contraseña</label>
              <div className="form-input-wrapper">
                <input type={showPassword ? "text" : "password"} className="form-input" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <span className="input-icon">🔒</span>
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Contraseña</label>
              <div className="form-input-wrapper">
                <input type={showPassword ? "text" : "password"} className="form-input" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <span className="input-icon">🔒</span>
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

            <button type="submit" className="btn btn-success" disabled={!isValidPassword || !passwordsMatch} style={{ marginTop: '1.5rem' }}>
              <span>Guardar Contraseña</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}