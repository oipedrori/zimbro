import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mic, TrendingUp, ShieldCheck } from 'lucide-react';

const Onboarding = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            await loginWithGoogle();
            navigate('/'); // Redireciona para home se sucesso
        } catch (error) {
            console.error("Falha ao fazer login", error);
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="fluid-bg" style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            padding: '40px 24px',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                right: '-20%',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(40px)',
                zIndex: 0
            }}></div>

            <div style={{ zIndex: 1 }} className="animate-slide-up">
                {/* Logo area */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TrendingUp color={"var(--primary-color)"} size={28} />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Zimbro</h1>
                </div>

                <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '24px', fontWeight: '600' }}>
                    O primeiro<br />assistente financeiro<br />movido a IA.
                </h2>

                <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '48px', lineHeight: 1.6 }}>
                    Converse naturalmente para adicionar despesas, planejar o futuro e alcançar sua liberdade financeira.
                </p>

                {/* Feature List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <FeatureItem
                        icon={<Mic size={24} />}
                        title="Sua voz no controle"
                        desc="Apenas diga o que gastou e o Zimbro resolve o resto."
                    />
                    <FeatureItem
                        icon={<ShieldCheck size={24} />}
                        title="Previsão Inteligente"
                        desc="Despesas parceladas e recorrentes são calculadas no futuro automaticamente."
                    />
                </div>
            </div>

            <div style={{ zIndex: 1, marginTop: '40px' }} className="animate-fade-in">
                <button
                    onClick={handleLogin}
                    disabled={isLoggingIn}
                    style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: 'white',
                        color: 'var(--primary-color)',
                        borderRadius: 'var(--border-radius-lg)',
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                        transition: 'transform 0.2s'
                    }}
                >
                    {isLoggingIn ? 'Conectando...' : (
                        <>
                            {/* Ícone simples do Google em SVG */}
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continuar com Google
                        </>
                    )}
                </button>
            </div>

            <style>{`
                .fluid-bg {
                    background: linear-gradient(135deg, #10b981 0%, #059669 40%, #047857 100%);
                    background-size: 200% 200%;
                    animation: gradientAnim 8s ease infinite;
                }
                @keyframes gradientAnim {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div >
    );
};

const FeatureItem = ({ icon, title, desc }) => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '12px',
            borderRadius: '50%',
            backdropFilter: 'blur(10px)'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>{title}</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: 1.4 }}>{desc}</p>
        </div>
    </div>
);

export default Onboarding;
