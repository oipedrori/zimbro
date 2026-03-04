import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ChevronLeft, User, LogOut, Crown, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Mock settings
    const [currency, setCurrency] = useState('BRL');
    const [isPremium, setIsPremium] = useState(false); // Default to free for demo

    // Theme logic
    const [theme, setTheme] = useState(localStorage.getItem('zimbro_theme') || 'system');

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('theme-dark');
            root.classList.remove('theme-light');
        } else if (theme === 'light') {
            root.classList.add('theme-light');
            root.classList.remove('theme-dark');
        } else {
            root.classList.remove('theme-dark', 'theme-light');
        }
        localStorage.setItem('zimbro_theme', theme);
    }, [theme]);

    return (
        <div className="page-container animate-fade-in" style={{ paddingBottom: '110px' }}>
            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px', marginLeft: '-8px' }}>
                    <ChevronLeft size={24} color="var(--text-main)" />
                </button>
                <h1 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: '600' }}>Perfil</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            {/* Profile Info */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-color)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', marginBottom: '16px', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)' }}>
                    <User size={36} />
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {currentUser?.displayName || 'Usuário Zimbro'}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '12px' }}>{currentUser?.email}</p>

                {/* Theme Toggle Centralizado */}
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-color)', padding: '6px 16px', borderRadius: '20px', gap: '8px', border: '1px solid var(--glass-border)' }}>
                    <Moon size={16} color="var(--primary-color)" />
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        style={{ background: 'transparent', border: 'none', fontWeight: '600', color: 'var(--primary-color)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
                    >
                        <option value="system">Sistema</option>
                        <option value="light">Claro</option>
                        <option value="dark">Escuro</option>
                    </select>
                </div>
            </div>

            {/* Premium Upsell Card */}
            <section style={{ background: isPremium ? 'var(--primary-darkest)' : 'var(--primary-darker)', borderRadius: '24px', padding: '24px', color: '#f8fafc', marginBottom: '32px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 25px rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Crown size={24} color="#fbbf24" />
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Zimbro PRO</h3>
                    </div>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '600' }}>
                        {isPremium ? 'Ativo' : 'Free Phase'}
                    </span>
                </div>

                <p style={{ fontSize: '0.9rem', opacity: 0.9, marginBottom: '20px', lineHeight: '1.4' }}>
                    {isPremium ? 'Sua assinatura premium está ativa. Você tem acesso a todos os limites e inteligência sem restrições.' : 'Desbloqueie orçamentos ilimitados, IA avançada e gráficos preditivos.'}
                </p>

                {!isPremium && (
                    <button style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'var(--primary-color)', color: 'var(--text-main)', fontWeight: '700', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                        Fazer Upgrade Agora
                    </button>
                )}
            </section>

            {/* Log out Menu Item (settings removed as requested) */}
            <section style={{ background: 'var(--surface-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                <div
                    onClick={logout}
                    style={{ display: 'flex', alignItems: 'center', padding: '18px 20px', cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--danger-color)' }}>
                            <LogOut size={20} />
                        </div>
                        <span style={{ fontWeight: '600', color: 'var(--danger-color)' }}>Sair da Conta</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Profile;
