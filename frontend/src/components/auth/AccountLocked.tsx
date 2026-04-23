import { useState, useEffect } from 'react';

interface Props {
  onNavigate: (view: 'LOGIN' | 'RECOVERY' | 'LOCKED') => void;
}

export default function AccountLocked({ onNavigate }: Props) {
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onNavigate('LOGIN');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onNavigate]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="login-card" style={{ maxWidth: '450px', width: '100%', margin: '0 auto' }}>
      <div className="card-header" style={{ background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 100%)', color: 'white' }}>
        <div className="logo">🔒</div>
        <h1 className="card-title" style={{ color: 'white' }}>Cuenta Bloqueada</h1>
        <p className="card-subtitle" style={{ color: '#fee2e2' }}>Medida de seguridad activada</p>
      </div>

      <div className="card-body">
        <div className="alert alert-error" style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #f87171' }}>
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
          <p style={{ fontSize: '0.875rem', color: '#78350f', margin: 0 }}>
            Contacta al administrador del sistema para desbloquear tu cuenta mediante consola.
          </p>
        </div>

        <button type="button" className="btn btn-secondary" onClick={() => onNavigate('LOGIN')}>
          <span>← Volver al Login</span>
        </button>
      </div>

      <div className="card-footer" style={{ background: '#fee2e2', padding: '1rem', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', textAlign: 'center' }}>
        <p style={{ color: '#991b1b', margin: 0, fontSize: '0.85rem' }}>
          <strong>Seguridad:</strong> Este bloqueo protege tu cuenta de accesos no autorizados.
        </p>
      </div>
    </div>
  );
}