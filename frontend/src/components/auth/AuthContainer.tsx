import { useState } from "react";
import LoginForm from "./LoginForm";
import PasswordRecovery from "./PasswordRecovery";
import AccountLocked from "./AccountLocked";

type AuthState = 'LOGIN' | 'RECOVERY' | 'LOCKED';

export default function AuthContainer() {
    const [currentView, setCurrentView] = useState<AuthState>('LOGIN');

    const renderCurrentView = () => {
        switch (currentView) {
            case 'LOGIN':
                return <LoginForm onNavigate={setCurrentView}/>;
            case 'RECOVERY':
                return <PasswordRecovery onNavigate={setCurrentView}/>;
            case 'LOCKED':
                return <AccountLocked onNavigate={setCurrentView}/>;
        }
    };

    return (
    <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        width: '100vw', 
        margin: 0, 
        padding: '1rem',
        backgroundColor: '#1e293b', 
        boxSizing: 'border-box',
        overflowX: 'hidden' 
    }}>
        {renderCurrentView()}
    </div>
    );
}