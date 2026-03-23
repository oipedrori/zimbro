import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import ConfirmDialog from './ConfirmDialog';
import { useI18n } from '../contexts/I18nContext';

const SwipeableItem = ({ children, onDelete, onEdit }) => {
    const [isDeleted, setIsDeleted] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { t } = useI18n();
    const x = useMotionValue(0);

    // Transformações para efeitos visuais durante o arraste
    const opacity = useTransform(x, [-100, -80, 0, 80, 100], [0.5, 1, 1, 1, 0.5]);
    const scale = useTransform(x, [-100, -80, 0, 80, 100], [0.95, 1, 1, 1, 0.95]);

    const handleDragEnd = (event, info) => {
        const { offset, velocity } = info;
        
        // Thresholds ajustados para maior estabilidade no centro (mais "magnetismo" no zero)
        // Aumentamos o deslocamento necessário e a velocidade para evitar saltos acidentais
        const actionThreshold = 60; // Antes era 40
        const velocityThreshold = 800; // Antes era 500

        if (offset.x < -actionThreshold || velocity.x < -velocityThreshold) {
            animate(x, -80, { type: 'spring', bounce: 0.2, duration: 0.4 });
        } else if (onEdit && (offset.x > actionThreshold || velocity.x > velocityThreshold)) {
            animate(x, 80, { type: 'spring', bounce: 0.2, duration: 0.4 });
        } else {
            animate(x, 0, { type: 'spring', bounce: 0.2, duration: 0.4 });
        }
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const confirmDeletion = () => {
        setShowConfirm(false);
        setIsDeleted(true);
        setTimeout(() => {
            onDelete();
        }, 300);
    };

    const handleEditClick = () => {
        animate(x, 0, { type: 'spring', bounce: 0.2, duration: 0.4 });
        if (onEdit) onEdit();
    };

    if (isDeleted) {
        return (
            <motion.div 
                initial={{ height: 'auto', opacity: 1 }}
                animate={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
            {/* Background Actions Container */}
            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                zIndex: 0
            }}>
                {/* Left Side (Edit) */}
                <div style={{
                    width: '100px',
                    background: 'var(--success-color)',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    borderRadius: '0',
                    paddingLeft: '20px',
                    opacity: onEdit ? 1 : 0
                }}>
                    {onEdit && (
                        <button
                            onClick={handleEditClick}
                            style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px' }}
                            aria-label="Editar"
                        >
                            <Edit2 size={24} />
                        </button>
                    )}
                </div>

                {/* Right Side (Delete) */}
                <div style={{
                    width: '100px',
                    background: 'var(--danger-color)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    borderRadius: '0',
                    paddingRight: '20px'
                }}>
                    <button
                        onClick={handleDeleteClick}
                        style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px' }}
                        aria-label="Apagar"
                    >
                        <Trash2 size={24} />
                    </button>
                </div>
            </div>

            {/* Foreground Item */}
            <motion.div
                drag="x"
                dragConstraints={{ left: -80, right: onEdit ? 80 : 0 }}
                dragElastic={0.1}
                onDragEnd={handleDragEnd}
                style={{
                    x,
                    opacity,
                    scale,
                    background: 'var(--surface-color)',
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    cursor: 'grab',
                    touchAction: 'none' // Importante para drag no mobile
                }}
                whileTap={{ cursor: 'grabbing' }}
            >
                <div style={{ width: '100%' }}>
                    {children}
                </div>
            </motion.div>

            <ConfirmDialog 
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                title={t('confirm_deletion', { defaultValue: 'Excluir Movimentação' })}
                message={t('delete_confirmation_message', { defaultValue: 'Tem certeza que deseja excluir esta movimentação? Esta ação não pode ser desfeita.' })}
                confirmLabel={t('exclude', { defaultValue: 'Excluir' })}
                cancelLabel={t('cancel', { defaultValue: 'Cancelar' })}
                onConfirm={confirmDeletion}
                type="danger"
            />
        </div>
    );
};

export default SwipeableItem;
