import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Database, Search, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

const NotionImport = () => {
    const navigate = useNavigate();
    const { t } = useI18n();
    const [step, setStep] = useState(1); // 1: Info, 2: Connect/Input, 3: Success
    const [notionUrl, setNotionUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConnect = () => {
        setLoading(true);
        // Simulate connection
        setTimeout(() => {
            setLoading(false);
            setStep(3);
        }, 2500);
    };

    return (
        <div className="page-container animate-fade-in" style={{ paddingBottom: '40px', position: 'relative', overflow: 'hidden', minHeight: '100dvh' }}>
            <div className="notion-aura"></div>

            {/* Header */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', marginBottom: '32px', position: 'relative', zIndex: 2 }}>
                <button onClick={() => navigate(-1)} style={{ padding: '8px', marginLeft: '-8px' }}>
                    <ChevronLeft size={24} color="var(--text-main)" />
                </button>
                <h1 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600' }}>Importar do Notion</h1>
                <div style={{ width: '40px' }}></div>
            </header>

            <div style={{ position: 'relative', zIndex: 2 }}>
                {step === 1 && (
                    <div className="animate-fade-in">
                        <div style={{
                            width: '70px', height: '70px', background: '#000', borderRadius: '18px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                        }}>
                            <Database size={32} color="white" />
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)', lineHeight: 1.2 }}>
                            Traga seu Hub Financeiro do Notion
                        </h2>

                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px', fontSize: '1.05rem' }}>
                            Conecte sua conta do Notion para importar automaticamente todas as suas transações e categorias do template Hub Financeiro.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                            {[
                                { title: 'Importação Direta', desc: 'Não precisa exportar arquivos CSV.' },
                                { title: 'Sincronização de Categorias', desc: 'Mantemos suas categorias personalizadas.' },
                                { title: 'Histórico Completo', desc: 'Importamos anos de movimentações em segundos.' }
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    <div style={{ marginTop: '4px' }}>
                                        <CheckCircle2 size={18} color="var(--primary-color)" />
                                    </div>
                                    <div>
                                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>{item.title}</h4>
                                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '18px',
                                background: 'var(--primary-darker)', color: 'white',
                                fontWeight: '700', fontSize: '1rem', border: 'none',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            Começar Importação <ArrowRight size={20} />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>
                            Link do seu Hub
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
                            Cole o link da página principal do seu Hub Financeiro no Notion para iniciarmos a leitura.
                        </p>

                        <div style={{ position: 'relative', marginBottom: '24px' }}>
                            <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="notion.so/my-hub/..."
                                value={notionUrl}
                                onChange={(e) => setNotionUrl(e.target.value)}
                                style={{
                                    width: '100%', padding: '18px 18px 18px 50px', borderRadius: '18px',
                                    background: 'var(--surface-color)', border: '1px solid var(--glass-border)',
                                    color: 'var(--text-main)', fontSize: '1rem', outline: 'none'
                                }}
                            />
                        </div>

                        <div style={{ background: 'rgba(234, 179, 8, 0.1)', padding: '16px', borderRadius: '16px', display: 'flex', gap: '12px', marginBottom: '40px' }}>
                            <AlertCircle size={20} color="#ca8a04" style={{ flexShrink: 0 }} />
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#854d0e', lineHeight: 1.4 }}>
                                Certifique-se de que a página está marcada como <b>"Share to Web"</b> ou que você autorizou o Zimbro nas configurações do Notion.
                            </p>
                        </div>

                        <button
                            onClick={handleConnect}
                            disabled={!notionUrl || loading}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '18px',
                                background: loading ? 'var(--text-muted)' : 'var(--primary-color)',
                                color: 'white', fontWeight: '700', fontSize: '1rem', border: 'none',
                                opacity: !notionUrl ? 0.6 : 1, transition: 'all 0.3s'
                            }}
                        >
                            {loading ? 'Analisando Base de Dados...' : 'Conectar e Importar'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in" style={{ textAlign: 'center', paddingTop: '40px' }}>
                        <div style={{
                            width: '80px', height: '80px', background: 'var(--primary-light)', borderRadius: '50%',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px',
                            color: 'var(--primary-color)'
                        }}>
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>
                            Tudo pronto!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '40px' }}>
                            Suas transações foram importadas com sucesso. Seu Zimbro agora está atualizado com todo seu histórico do Notion.
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '18px',
                                background: 'var(--primary-darker)', color: 'white',
                                fontWeight: '700', fontSize: '1rem', border: 'none'
                            }}
                        >
                            Ir para Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotionImport;
