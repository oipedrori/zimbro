import React, { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIAS_DESPESA } from '../utils/categories';
import { getYearlyStats } from '../services/transactionService';
import { useAuth } from '../contexts/AuthContext';

const Statistics = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonthNum = currentDate.getMonth() + 1;
    const monthPrefix = format(currentDate, 'yyyy-MM');

    // Transações do mês atual para montar o gráfico de pizza
    const { transactions } = useTransactions(monthPrefix);

    const [yearlyStats, setYearlyStats] = useState([]);
    const [loadingYearly, setLoadingYearly] = useState(true);

    useEffect(() => {
        if (currentUser) {
            getYearlyStats(currentUser.uid, currentYear).then(data => {
                setYearlyStats(data);
                setLoadingYearly(false);
            });
        }
    }, [currentUser, currentYear]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    };

    // --- PIP CHART LOGIC (MÊS ATUAL) ---
    const expensesByCategory = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});

    const totalExpenses = Object.values(expensesByCategory).reduce((acc, val) => acc + val, 0);
    const conicStops = [];
    let cumPercent = 0;

    if (totalExpenses > 0) {
        // Ordena para colocar os maiores gastos primeiro visualmente
        const sortedCats = Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a);
        sortedCats.forEach(([catId, amount]) => {
            const category = CATEGORIAS_DESPESA.find(c => c.id === catId) || { color: '#999' };
            const pct = (amount / totalExpenses) * 100;
            conicStops.push(`${category.color} ${cumPercent}% ${cumPercent + pct}%`);
            cumPercent += pct;
        });
    }

    const pieChartBg = totalExpenses > 0
        ? `conic-gradient(${conicStops.join(', ')})`
        : 'var(--glass-border)';

    // --- BAR CHART LOGIC (ANO) ---
    // Encontrar o valor maximo absoluto para escalar as barras (considerando saldos positivos e negativos altos)
    const maxBarValue = Math.max(...yearlyStats.map(s => Math.abs(s.balance)), 1);

    return (
        <div className="page-container animate-fade-in" style={{ paddingBottom: '100px', animation: 'fadeIn 0.4s forwards' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <button
                    onClick={() => navigate('/')}
                    style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', border: 'none' }}
                >
                    <ChevronUp size={16} />
                    <span>Deslize ou clique para voltar</span>
                </button>
            </div>

            <header style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.4rem', color: 'var(--primary-darkest)', fontWeight: '700' }}>Estatísticas</h1>
            </header>

            {/* Gráfico Anual de Saldos */}
            <section className="glass-panel" style={{ padding: '24px 16px', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--primary-darkest)', marginBottom: '24px' }}>Saldos Projetados ({currentYear})</h3>

                {loadingYearly ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Carregando projeção...</p>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '160px', paddingBottom: '20px', borderBottom: '1px solid var(--glass-border)' }}>
                        {yearlyStats.map((stat) => {
                            const isCurrent = stat.month === currentMonthNum;
                            const isNegative = stat.balance < 0;
                            const fillPercentage = Math.min((Math.abs(stat.balance) / maxBarValue) * 100, 100);
                            const minHeight = 4; // pra sempre mostrar alguma cor

                            // Cores premium
                            const barColor = isNegative ? 'var(--danger-color)' : 'var(--primary-color)';
                            const barOpacity = isCurrent ? 1 : 0.4;

                            return (
                                <div key={stat.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', width: '20px' }}>
                                    {/* Tooltip super simplificada */}
                                    {isCurrent && (
                                        <div style={{ position: 'absolute', top: '-10px', fontSize: '0.6rem', fontWeight: 'bold', color: barColor }}>
                                            {stat.balance > 0 ? '+' : ''}{(stat.balance / 1000).toFixed(1)}k
                                        </div>
                                    )}
                                    <div style={{
                                        width: '100%',
                                        height: `${Math.max(fillPercentage, minHeight)}%`,
                                        background: barColor,
                                        borderRadius: '4px',
                                        opacity: barOpacity,
                                        transition: 'height 0.5s ease-out'
                                    }}></div>
                                    <span style={{ fontSize: '0.65rem', color: isCurrent ? 'var(--primary-darkest)' : 'var(--text-muted)', fontWeight: isCurrent ? '700' : '500' }}>
                                        {stat.label.charAt(0)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Gráfico de Pizza (Categorias do Mês) */}
            <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ width: '100%', fontSize: '1rem', fontWeight: '600', color: 'var(--primary-darkest)', marginBottom: '8px' }}>
                    Despesas de {format(currentDate, 'MMMM', { locale: ptBR }).replace(/^\w/, c => c.toUpperCase())}
                </h3>

                {totalExpenses > 0 ? (
                    <>
                        <div style={{ position: 'relative', width: '200px', height: '200px', margin: '24px 0', border: '1px solid var(--glass-border)', borderRadius: '50%', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                            <div style={{
                                width: '100%', height: '100%',
                                borderRadius: '50%',
                                background: pieChartBg,
                                display: 'flex', justifyContent: 'center', alignItems: 'center'
                            }}>
                                {/* Inner Hole for Donut Look */}
                                <div style={{ width: '130px', height: '130px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Gasto</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--danger-color)', marginTop: '-2px' }}>{formatCurrency(totalExpenses)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Legenda Dinâmica */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                            {Object.entries(expensesByCategory).sort(([, a], [, b]) => b - a).map(([catId, amount]) => {
                                const category = CATEGORIAS_DESPESA.find(c => c.id === catId) || { label: catId, color: '#999', icon: '📌' };
                                const pct = (amount / totalExpenses) * 100;
                                return (
                                    <div key={catId} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-main)', background: 'var(--surface-color)', padding: '4px 10px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: category.color }}></div>
                                        <span>{category.icon} {category.label}</span>
                                        <span style={{ fontWeight: '600', opacity: 0.8 }}>({pct.toFixed(0)}%)</span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <p>Nenhuma despesa registrada neste mês ainda!</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Statistics;
