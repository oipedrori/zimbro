import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toJpeg } from 'html-to-image';
import { X, Share2, Download, AlertCircle } from 'lucide-react';
import BadgeSVG from './BadgeSVG';
import { useAuth } from '../contexts/AuthContext';

const AchievementDetailsModal = ({ isOpen, onClose, badge }) => {
    const { currentUser } = useAuth();
    const shareRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!badge) return null;

    const exportImage = async () => {
        if (!shareRef.current) return;
        setIsExporting(true);

        try {
            // Wait for fonts to be ready
            await document.fonts.ready;

            const dataUrl = await toJpeg(shareRef.current, { 
                quality: 0.95,
                width: 1080,
                height: 1920,
                // Ensure proper scaling and bg
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });
            
            // Try native share first (mobile)
            if (navigator.share) {
                try {
                    // Convert dataUrl to blob
                    const res = await fetch(dataUrl);
                    const blob = await res.blob();
                    const file = new File([blob], 'zimbroo-conquista.jpg', { type: 'image/jpeg' });
                    
                    await navigator.share({
                        title: 'Minha nova conquista no Zimbroo!',
                        text: `Acabei de desbloquear a badge "${badge.title}" no app Zimbroo.`,
                        files: [file]
                    });
                     setIsExporting(false);
                     return;
                } catch (e) {
                    console.log("Share failed or user cancelled, falling back to download", e);
                }
            }

            // Fallback to download
            const link = document.createElement('a');
            link.download = `zimbroo-${badge.id}.jpg`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Oops, something went wrong!', error);
            alert("Não foi possível gerar a imagem.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.5)',
                            zIndex: 1000,
                            backdropFilter: 'blur(4px)'
                        }}
                    />

                    {/* Bottom Sheet / Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        style={{
                            position: 'fixed', bottom: 0, left: 0, right: 0,
                            background: 'var(--surface-color)',
                            borderTopLeftRadius: '24px',
                            borderTopRightRadius: '24px',
                            padding: '32px 24px',
                            zIndex: 1001,
                            maxHeight: '90vh',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
                        }}
                    >
                        {/* Drag Handle shape */}
                        <div style={{
                            width: '40px', height: '5px', background: 'var(--glass-border)',
                            borderRadius: '10px', position: 'absolute', top: '12px', left: '50%',
                            transform: 'translateX(-50%)'
                        }} />

                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '24px', right: '24px',
                                background: 'var(--bg-color)', border: '1px solid var(--glass-border)',
                                width: '36px', height: '36px', borderRadius: '50%',
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                color: 'var(--text-main)', cursor: 'pointer'
                            }}
                        >
                            <X size={20} />
                        </button>

                        {/* Visual Display */}
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>
                                {badge.categoryTitle}
                            </p>
                            
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 15 }}
                                style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}
                            >
                                <BadgeSVG title={badge.title} categoryColor={badge.color} size={160} />
                            </motion.div>

                            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '8px' }}>
                                {badge.title}
                            </h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '300px', margin: '0 auto 32px' }}>
                                Você alcançou um novo marco na categoria de {badge.categoryTitle.toLowerCase()}. Continue assim!
                            </p>
                        </div>

                        {/* Share Button */}
                        <button
                            onClick={exportImage}
                            disabled={isExporting}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: badge.color,
                                color: 'white',
                                borderRadius: '16px',
                                border: 'none',
                                fontWeight: '700',
                                fontSize: '1rem',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: isExporting ? 'not-allowed' : 'pointer',
                                opacity: isExporting ? 0.7 : 1,
                                boxShadow: `0 8px 24px ${badge.color}40`,
                                transition: 'transform 0.2s',
                            }}
                        >
                            {isExporting ? (
                                <>Gerando imagem...</>
                            ) : (
                                <>
                                    <Share2 size={20} />
                                    Compatilhar Conquista
                                </>
                            )}
                        </button>
                    </motion.div>

                    {/* Hidden Off-Screen Node For html-to-image (9:16 layout) */}
                    <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
                        <div 
                            ref={shareRef}
                            style={{
                                width: '1080px',
                                height: '1920px',
                                background: badge.color,
                                padding: '80px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontFamily: 'system-ui, -apple-system, sans-serif'
                            }}
                        >
                            <div style={{ textAlign: 'center', marginTop: '120px' }}>
                                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '48px', fontWeight: '600', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px' }}>
                                    {badge.categoryTitle}
                                </p>
                                <h2 style={{ color: 'white', fontSize: '80px', fontWeight: '900', margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                                    {currentUser?.displayName || 'Usuário'}
                                </h2>
                            </div>

                            <div style={{ transform: 'scale(3)', transformOrigin: 'center' }}>
                                <BadgeSVG title={badge.title} categoryColor={badge.color} size={300} />
                            </div>

                            <div style={{ textAlign: 'center', marginBottom: '120px', background: 'rgba(0,0,0,0.2)', padding: '60px 80px', borderRadius: '40px', backdropFilter: 'blur(20px)' }}>
                                <p style={{ color: 'white', fontSize: '42px', fontWeight: '800', margin: '0 0 16px 0' }}>Conquista Desbloqueada</p>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                                    {/* Zimbroo Logomark simulated */}
                                    <div style={{ width: '60px', height: '60px', background: 'white', borderRadius: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <div style={{ width: '30px', height: '30px', background: badge.color, borderRadius: '50%' }}></div>
                                    </div>
                                    <span style={{ color: 'white', fontSize: '36px', fontWeight: '900', letterSpacing: '-1px' }}>Zimbroo</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AchievementDetailsModal;
