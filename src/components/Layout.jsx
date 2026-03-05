import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AiPanel from './AiPanel';
import TransactionModal from './TransactionModal';
import './Layout.css';

const Layout = () => {
    const [isAiActive, setIsAiActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('action') === 'voice') {
            setIsAiActive(true);
            // Remove the query param so it doesn't trigger again on reload
            navigate(location.pathname, { replace: true });
        }
    }, [location.search, navigate]);

    const handleAiClick = () => {
        setIsAiActive(!isAiActive);
    };

    // Swipe Navigation Logic tracking finger
    const [touchStart, setTouchStart] = useState({ x: null, y: null });
    const [currentPull, setCurrentPull] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);

    const minSwipeDistance = 80;

    const onTouchStart = (e) => {
        if (isAnimating) return;
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY
        });
    };

    const onTouchMove = (e) => {
        if (!touchStart.x || isAnimating) return;

        const currentX = e.targetTouches[0].clientX;
        const currentY = e.targetTouches[0].clientY;
        const dx = currentX - touchStart.x;
        const dy = currentY - touchStart.y;

        // If scrolling vertically more than horizontally, cancel horizontal swipe
        if (Math.abs(dy) > Math.abs(dx)) return;

        if (location.pathname === '/' && dx < 0) {
            // Home -> Stats (Swipe Left)
            setCurrentPull(dx);
        } else if (location.pathname === '/statistics' && dx > 0) {
            // Stats -> Home (Swipe Right)
            setCurrentPull(dx);
        }
    };

    const onTouchEnd = () => {
        if (!touchStart.x || isAnimating) return;

        if (location.pathname === '/' && currentPull < -minSwipeDistance) {
            triggerNavigation('/statistics', -window.innerWidth);
        } else if (location.pathname === '/statistics' && currentPull > minSwipeDistance) {
            triggerNavigation('/', window.innerWidth);
        } else {
            // Snap back
            setIsAnimating(true);
            setCurrentPull(0);
            setTimeout(() => {
                setIsAnimating(false);
            }, 250);
        }
        setTouchStart({ x: null, y: null });
    };

    const triggerNavigation = (path, exitPull) => {
        setIsAnimating(true);
        setCurrentPull(exitPull);

        setTimeout(() => {
            navigate(path);

            setDisableTransition(true);
            setCurrentPull(-exitPull); // start from other side

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setDisableTransition(false);
                    setCurrentPull(0); // slide to center
                    setTimeout(() => setIsAnimating(false), 250);
                });
            });
        }, 200);
    };

    const mainTransitionStyle = disableTransition || (touchStart.x !== null && !isAnimating && currentPull !== 0)
        ? 'none'
        : 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)';

    return (
        <div className="app-container" style={{ overflow: 'hidden', position: 'relative' }}>

            {/* Visual Pagination Indicator (Dots) */}
            <div style={{
                position: 'absolute',
                top: 'env(safe-area-inset-top, 10px)',
                left: 0, right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                zIndex: 50,
                pointerEvents: 'none'
            }}>
                <div style={{
                    width: location.pathname === '/' ? '16px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: location.pathname === '/' ? 'var(--primary-color)' : 'var(--glass-border)',
                    transition: 'all 0.3s ease'
                }} />
                <div style={{
                    width: location.pathname === '/statistics' ? '16px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: location.pathname === '/statistics' ? 'var(--primary-color)' : 'var(--glass-border)',
                    transition: 'all 0.3s ease'
                }} />
            </div>

            {/* O conteúdo das páginas (Home, Stats) será renderizado aqui */}
            <main
                className="main-content"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{
                    transform: `translateX(${currentPull}px)`,
                    transition: mainTransitionStyle,
                    willChange: 'transform'
                }}
            >
                <Outlet />
            </main>

            {/* Camada do Painel de IA */}
            <AiPanel
                isActive={isAiActive}
                onClose={() => setIsAiActive(false)}
                onOpenManualModal={() => setIsManualModalOpen(true)}
                onListeningChange={setIsListening}
            />

            {/* Modal Manual Global Disparado pela IA Panel */}
            <TransactionModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                defaultType="expense"
            />

            {/* Removed Loader overlay as we now use active sliding */}

            {/* Bottom Blur Effect */}
            <div className="bottom-blur-layer" />

            {/* Navegação Simplificada - Apenas Botão Central (Oculto no Perfil) */}
            {location.pathname !== '/profile' && (
                <nav className="bottom-nav">
                    {/* Botão Central de IA */}
                    <div className="nav-center-item">
                        <button
                            className={`ai-mic-btn ${isAiActive ? 'active' : ''}`}
                            onClick={handleAiClick}
                            aria-label="Ativar Inteligência Artificial"
                        >
                            {isListening && <div className="aura listening"></div>}
                            <div className="mic-glow"></div>
                            <Plus size={32} color="#ffffff" strokeWidth={2.5} style={{ transition: 'transform 0.3s', transform: isAiActive ? 'rotate(45deg)' : 'rotate(0)' }} />
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default Layout;
