import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AiPanel from './AiPanel';
import TransactionModal from './TransactionModal';
import './Layout.css';

const Layout = () => {
    const [isAiActive, setIsAiActive] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const location = useLocation();

    const handleAiClick = () => {
        setIsAiActive(!isAiActive);
    };

    // Swipe Navigation Logic
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const navigate = useNavigate();

    const minSwipeDistance = 70;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientY);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientY);

    const onTouchEnd = (e) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isUpSwipe = distance > minSwipeDistance;
        const isDownSwipe = distance < -minSwipeDistance;

        // Ensure we are at the top before capturing down swipe
        const isAtTop = e.currentTarget.scrollTop <= 0;

        if (location.pathname === '/' && isDownSwipe && isAtTop) {
            navigate('/statistics');
        }

        if (location.pathname === '/statistics' && isUpSwipe) {
            navigate('/');
        }
    };

    return (
        <div className="app-container">
            {/* O conteúdo das páginas (Home, Stats) será renderizado aqui */}
            <main
                className="main-content"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <Outlet />
            </main>

            {/* Camada do Painel de IA */}
            <AiPanel
                isActive={isAiActive}
                onClose={() => setIsAiActive(false)}
                onOpenManualModal={() => setIsManualModalOpen(true)}
            />

            {/* Modal Manual Global Disparado pela IA Panel */}
            <TransactionModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                defaultType="expense"
            />

            {/* Navegação Simplificada - Apenas Botão Central */}
            <nav className="bottom-nav">
                {/* Botão Central de IA */}
                <div className="nav-center-item">
                    <button
                        className={`ai-mic-btn ${isAiActive ? 'active' : ''}`}
                        onClick={handleAiClick}
                        aria-label="Ativar Inteligência Artificial"
                    >
                        <div className="mic-glow"></div>
                        <Plus size={32} color="#ffffff" strokeWidth={2.5} style={{ transition: 'transform 0.3s', transform: isAiActive ? 'rotate(45deg)' : 'rotate(0)' }} />
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Layout;
