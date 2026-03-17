import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const CookieNotice = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useI18n();

    useEffect(() => {
        const hasAccepted = localStorage.getItem('zimbroo_cookies_accepted');
        if (hasAccepted !== 'true') {
            // Show with a slight delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        setIsVisible(false);
        localStorage.setItem('zimbroo_cookies_accepted', 'true');
    };

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '450px',
            background: 'rgba(18, 18, 18, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--glass-border)',
            borderRadius: '24px',
            padding: '24px',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            animation: 'slideUpContent 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '16px', 
                    background: 'var(--primary-gradient)', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    flexShrink: 0
                }}>
                    <ShieldCheck size={24} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'white' }}>
                        {t('cookie_title')}
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.4' }}>
                        {t('cookie_desc')}
                    </p>
                </div>
            </div>

            <button
                onClick={handleAccept}
                style={{
                    width: '100%',
                    padding: '16px',
                    background: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '700',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                {t('cookie_accept_btn')}
            </button>

            <style>{`
                @keyframes slideUpContent {
                    from { transform: translate(-50%, 100px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default CookieNotice;
