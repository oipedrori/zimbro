import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BadgeSVG from './BadgeSVG';
import { useGamification } from '../contexts/GamificationContext';

const AchievementUnlockModal = () => {
    const { unlockQueue, dismissCurrentUnlock } = useGamification();
    const currentUnlock = unlockQueue[0];

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (currentUnlock) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [currentUnlock]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            dismissCurrentUnlock();
        }, 300); // match exit animation duration
    };

    return (
        <AnimatePresence>
            {isVisible && currentUnlock && (
                <div 
                    onClick={handleClose}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        WebkitTapHighlightColor: 'transparent',
                        zIndex: 9999, // Highly elevated above all modals
                    }}
                >
                    {/* Dark Overlay */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0, 0, 0, 0.85)',
                            backdropFilter: 'blur(5px)',
                            WebkitBackdropFilter: 'blur(5px)'
                        }}
                    />

                    {/* Content */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        padding: '24px',
                        textAlign: 'center'
                    }}>
                        <motion.h2 
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            style={{ 
                                fontSize: '2.5rem', 
                                fontWeight: '900', 
                                marginBottom: '40px',
                                background: 'linear-gradient(to bottom, #fff, #ffd700)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '0 4px 12px rgba(255,215,0,0.3)'
                            }}
                        >
                            Parabéns!
                        </motion.h2>

                        {/* Badge with Spin-In and Scale */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ 
                                type: 'spring', 
                                damping: 15, 
                                stiffness: 100,
                                mass: 1.2
                            }}
                            style={{ marginBottom: '40px' }}
                        >
                            <BadgeSVG 
                                title={currentUnlock.title} 
                                categoryColor={currentUnlock.color} 
                                size={180} 
                            />
                        </motion.div>

                        <motion.p 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ delay: 0.3, type: 'spring' }}
                            style={{ 
                                fontSize: '1.2rem', 
                                fontWeight: '500', 
                                lineHeight: '1.5',
                                maxWidth: '300px'
                            }}
                        >
                            Você conquistou o prêmio de <br/>
                            <span style={{ fontWeight: '800', color: currentUnlock.color, fontSize: '1.5rem', display: 'block', marginTop: '8px' }}>
                                {currentUnlock.title}
                            </span>
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 1 }}
                            style={{
                                position: 'absolute',
                                bottom: '40px',
                                fontSize: '0.8rem',
                                letterSpacing: '1px'
                            }}
                        >
                            Toque em qualquer lugar para continuar
                        </motion.p>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AchievementUnlockModal;
