import { useState, useEffect } from 'react';

interface props {
    onNavigate: (view: 'LOGIN' | 'RECOVERY' | 'LOCKED') => void;
}

export default function AccountLocked({ onNavigate } : props) {
    const [timeLeft, setTimeLeft] = useState(15*60);

    useEffect(() => {
        if (timeLeft <= 0) {
            onNavigate('LOGIN');
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev)=> prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    },[timeLeft, onNavigate]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="login-card">
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)' }}>
        <div className="logo">🔒</div>
        <h1 className="card-title">Cuenta Bloqueada</h1>
        <p className="card-subtitle">Medida de seguridad activada</p>
      </div>

      <div className="card-body">
        <div className="alert alert-error">
          <span className="alert-icon">⛔</span>
          <span><strong>Acceso denegado:</strong> Tu cuenta ha sido bloqueada temporalmente debido a múltiples intentos fallidos.</span>
        </div>

        <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🕐</div>
          <h3 style={{ color: 'var(--gray-800)', marginBottom: '0.5rem' }}>Tiempo de espera</h3>
          <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--danger-red)', marginBottom: '1rem' }}>
            {timeString}
          </p>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Tu cuenta se desbloqueará automáticamente en 15 minutos.<br />
            Después podrás intentar iniciar sesión nuevamente.
          </p>
        </div>

        <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: '12px', border: '2px solid #f59e0b', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, color: '#92400e', marginBottom: '0.5rem' }}>
            💡 ¿Necesitas acceso inmediato?
          </div>
          <p style={{ fontSize: '0.875rem', color: '#78350f' }}>
            Contacta al administrador del sistema para desbloquear tu cuenta mediante consola.
          </p>
        </div>

        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('LOGIN')}>
          <span>← Volver al Login</span>
        </button>
      </div>

      <div className="card-footer" style={{ background: '#fee2e2' }}>
        <p style={{ color: '#991b1b' }}>
          <strong>Seguridad:</strong> Este bloqueo protege tu cuenta de accesos no autorizados.
        </p>
      </div>
    </div>
  );
}