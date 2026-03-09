import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Database, ArrowRight, CheckCircle2, AlertCircle, FileText, Loader2, Link, Lock } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { getNotionDatabaseInfo, fetchNotionTransactions } from '../services/notionService';
import { addTransaction } from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';

const NotionImport = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { t } = useI18n();
    const [searchParams, setSearchParams] = useSearchParams();

    const [notionToken, setNotionToken] = useState(localStorage.getItem('zimbroo_notion_token') || '');
    const [notionDbId, setNotionDbId] = useState(localStorage.getItem('zimbroo_notion_db_id') || '');
    const [step, setStep] = useState(notionToken ? 2 : 1); // 1: OAuth, 2: DB ID, 3: Sinc, 4: Success
    const [dbMetadata, setDbMetadata] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    // Notion OAuth Config (Usando variáveis de ambiente do Vite)
    const NOTION_CLIENT_ID = import.meta.env.VITE_NOTION_CLIENT_ID;
    const NOTION_REDIRECT_URI = import.meta.env.VITE_NOTION_REDIRECT_URI || (window.location.origin + '/notion-callback');

    useEffect(() => {
        const code = searchParams.get('code');
        if (code && !notionToken) {
            handleExchangeCode(code);
        }
    }, [searchParams]);

    const handleExchangeCode = async (code) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/notion-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            });
            const data = await response.json();
            if (data.access_token) {
                setNotionToken(data.access_token);
                localStorage.setItem('zimbroo_notion_token', data.access_token);
                setStep(2); // Vai para o passo do Banco de Dados
                setSearchParams({}); // Limpa a URL
            } else {
                throw new Error(data.error || 'Falha na conexão com o Notion');
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao conectar com o Notion. Verifique as configurações de Redirect URI.");
        } finally {
            setLoading(false);
        }
    };

    const handleStartOAuth = () => {
        if (!NOTION_CLIENT_ID) {
            alert("Erro: Client ID do Notion não configurado nas variáveis de ambiente.");
            return;
        }
        const authUrl = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${NOTION_CLIENT_ID}&redirect_uri=${encodeURIComponent(NOTION_REDIRECT_URI)}&response_type=code`;
        window.location.href = authUrl;
    };

    const confirmDb = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getNotionDatabaseInfo(notionToken, notionDbId);
            setDbMetadata(data);
            setStep(3);
            localStorage.setItem('zimbroo_notion_db_id', notionDbId);
        } catch (err) {
            setError('Banco de Dados não encontrado. Certifique-se de que deu acesso a ele no Notion.');
        } finally {
            setLoading(false);
        }
    };

    const startSync = async () => {
        setLoading(true);
        setError(null);
        try {
            const txs = await fetchNotionTransactions(notionToken, notionDbId);
            if (txs.length === 0) {
                throw new Error('Nenhuma transação encontrada nesta base.');
            }

            for (let i = 0; i < txs.length; i++) {
                await addTransaction(currentUser.uid, txs[i]);
                setProgress(Math.round(((i + 1) / txs.length) * 100));
            }

            setStep(4);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
            {/* Header */}
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', gap: '16px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '10px', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                    <ChevronLeft size={20} />
                </button>
                <h1 style={{ fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: '600' }}>Integração Notion</h1>
            </header>

            <main>
                {step === 1 && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '24px', background: 'var(--primary-color)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <Database size={40} color="white" />
                        </div>

                        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)', lineHeight: 1.2 }}>
                            Traga seu Hub Financeiro do Notion
                        </h2>

                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '32px', fontSize: '1.05rem' }}>
                            Sincronize automaticamente seus gastos do Notion com a inteligência do Zimbroo.
                        </p>

                        <div style={{ background: 'var(--card-bg)', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', textAlign: 'left' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Lock size={20} color="var(--text-main)" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>Autenticação Segura</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Conecta via API Oficial do Notion</p>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.5 }}>
                                Ao clicar abaixo, você será redirecionado para o Notion para escolher quais páginas o <b>Zimbroo</b> poderá acessar. É simples e totalmente seguro.
                            </p>

                            <button
                                onClick={handleStartOAuth}
                                disabled={loading}
                                style={{
                                    width: '100%', padding: '18px', backgroundColor: 'black', color: 'white',
                                    borderRadius: '16px', border: 'none', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '12px', cursor: 'pointer', transition: 'transform 0.2s',
                                    fontWeight: '700', fontSize: '1rem',
                                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                                }}
                            >
                                {loading ? 'Carregando...' : (
                                    <>
                                        <img src="https://www.notion.so/images/favicon.ico" style={{ width: '20px', height: '20px' }} alt="" />
                                        Conectar com Notion
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in">
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>
                            ID do Banco de Dados
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
                            Cole o ID da base de dados financeira que você quer importar.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                                    <Link size={20} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Database ID (32 caracteres)"
                                    value={notionDbId}
                                    onChange={(e) => setNotionDbId(e.target.value)}
                                    style={{
                                        width: '100%', padding: '18px 18px 18px 50px', borderRadius: '18px',
                                        background: 'var(--surface-color)', border: '1px solid var(--glass-border)',
                                        color: 'var(--text-main)', fontSize: '1rem', outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ef4444', marginBottom: '24px', fontSize: '0.9rem', background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '12px' }}>
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            onClick={confirmDb}
                            disabled={!notionDbId || loading}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '18px',
                                background: 'var(--primary-color)', color: 'white',
                                fontWeight: '700', fontSize: '1rem', border: 'none', opacity: !notionDbId ? 0.6 : 1
                            }}
                        >
                            {loading ? 'Verificando...' : 'Próximo Passo'}
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px'
                        }}>
                            <CheckCircle2 size={32} color="#22c55e" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--text-main)' }}>
                            {dbMetadata?.title[0]?.plain_text || 'Base Conectada!'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
                            Pronto para importar suas transações para o Zimbroo.
                        </p>

                        <button
                            onClick={startSync}
                            disabled={loading}
                            style={{
                                width: '100%', padding: '20px', borderRadius: '20px',
                                background: 'var(--primary-color)', color: 'white',
                                fontWeight: '700', fontSize: '1.1rem', border: 'none',
                                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px'
                            }}
                        >
                            {loading ? `Sincronizando ${progress}%...` : 'Iniciar Sincronização'}
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-fade-in" style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ marginBottom: '32px' }}>
                            <CheckCircle2 size={80} color="#22c55e" style={{ margin: '0 auto' }} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '16px', color: 'var(--text-main)' }}>
                            Importação Concluída!
                        </h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '1.1rem' }}>
                            Sua base do Notion foi sincronizada com sucesso.
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            style={{
                                width: '100%', padding: '18px', borderRadius: '18px',
                                background: 'var(--primary-darker)', color: 'white',
                                fontWeight: '700', fontSize: '1rem', border: 'none'
                            }}
                        >
                            Ver meu Dashboard
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default NotionImport;
