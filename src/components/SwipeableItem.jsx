import React, { useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';

const SwipeableItem = ({ children, onDelete }) => {
    const [startX, setStartX] = useState(0);
    const [currentX, setCurrentX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const itemRef = useRef(null);

    const threshold = -80; // Distance to trigger delete reveal

    const handleTouchStart = (e) => {
        setStartX(e.touches[0].clientX);
        setIsDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        const x = e.touches[0].clientX;
        const diff = x - startX;
        // Only allow swiping left
        if (diff < 0) {
            setCurrentX(Math.max(diff, -100)); // cap at -100px
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        if (currentX < threshold) {
            // Snap to open
            setCurrentX(-80);
        } else {
            // Snap back
            setCurrentX(0);
        }
    };

    const handleDeleteClick = () => {
        setIsDeleted(true);
        setTimeout(() => {
            onDelete();
        }, 300); // Wait for transition
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
            {/* Background Action (Trash) */}
            <div style={{
                position: 'absolute',
                top: 0, bottom: 0, right: 0,
                width: '100px',
                background: 'var(--danger-color)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                paddingRight: '20px',
                color: 'white',
                zIndex: 0
            }}>
                <button
                    onClick={handleDeleteClick}
                    style={{ color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px' }}
                    aria-label="Apagar"
                >
                    <Trash2 size={24} />
                </button>
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
                    background: 'var(--bg-color)',
                    position: 'relative',
                    zIndex: 1,
                    width: '100%'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default SwipeableItem;
