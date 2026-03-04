import React, { useRef, useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';

const SwipeableItem = ({ children, onDelete, onEdit }) => {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const itemRef = useRef(null);

    const deleteThreshold = -80;
    const editThreshold = 80;

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const diff = x - startX;

        // Allow both left (negative) and right (positive)
        if (diff < 0) {
            setCurrentX(Math.max(diff, -100)); // cap left
        } else if (diff > 0 && onEdit) {
            setCurrentX(Math.min(diff, 100)); // cap right only if edit action exists
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (currentX < deleteThreshold) {
            setCurrentX(-80);
        } else if (currentX > editThreshold && onEdit) {
            setCurrentX(80);
        } else {
            setCurrentX(0); // Snap back
        }
    };

    const handleDeleteClick = () => {
        setIsDeleted(true);
        setTimeout(() => {
            onDelete();
        }, 300);
    };

    const handleEditClick = () => {
        setCurrentX(0); // Snap back on edit click
        if (onEdit) onEdit();
    };

    if (isDeleted) {
        return (
            <div style={{ height: 0, opacity: 0, transition: 'all 0.3s', overflow: 'hidden' }}>
                {children}
            </div>
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
                    borderRadius: '16px 0 0 16px',
                    paddingLeft: '20px'
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
                    borderRadius: '0 16px 16px 0',
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
            <div
                ref={itemRef}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    transform: `translateX(${currentX}px)`,
                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                    background: 'var(--surface-color)', // Needs solid bg to hide background buttons
                    width: '100%',
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex'
                }}
            >
                <div style={{ width: '100%' }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default SwipeableItem;
