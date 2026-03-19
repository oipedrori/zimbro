import React from 'react';
import { motion } from 'framer-motion';

const BADGE_DEFINITIONS = [
  // Engagement Trilha (Leaves/Sprouts)
  { id: 'eng-1', type: 'engagement', threshold: 10, label: '10 Movimentações', icon: '🌱' },
  { id: 'eng-2', type: 'engagement', threshold: 50, label: '50 Movimentações', icon: '🌿' },
  { id: 'eng-3', type: 'engagement', threshold: 100, label: '100 Movimentações', icon: '🌳' },
  { id: 'eng-4', type: 'engagement', threshold: 500, label: '500 Movimentações', icon: '🌲' },
  { id: 'eng-5', type: 'engagement', threshold: 1000, label: '1000 Movimentações', icon: '🍃' },
  // Success Trilha (Fruits/Berries)
  { id: 'suc-1', type: 'success', threshold: 100, label: 'R$ 100,00 Economizados', icon: '🫐' },
  { id: 'suc-2', type: 'success', threshold: 500, label: 'R$ 500,00 Economizados', icon: '🍓' },
  { id: 'suc-3', type: 'success', threshold: 1000, label: 'R$ 1.000,00 Economizados', icon: '🍎' },
  { id: 'suc-4', type: 'success', threshold: 5000, label: 'R$ 5.000,00 Economizados', icon: '🍊' },
  { id: 'suc-5', type: 'success', threshold: 10000, label: 'R$ 10.000,00 Economizados', icon: '🏆' },
];

const AchievementBadges = ({ transactions = [], isDetailView = false }) => {
  const movementCount = transactions.length;
  const totalSaved = transactions
    .reduce((acc, t) => acc + (t.type === 'income' ? t.amount : -t.amount), 0);
  const positiveSaved = Math.max(0, totalSaved);

  const badges = BADGE_DEFINITIONS.map(badge => {
    const isUnlocked = badge.type === 'engagement' 
      ? movementCount >= badge.threshold 
      : positiveSaved >= badge.threshold;
    return { ...badge, isUnlocked };
  });

  const displayedBadges = isDetailView ? badges : badges.filter(b => b.isUnlocked).slice(0, 6);

  if (!isDetailView && displayedBadges.length === 0) {
    return (
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '10px' }}>
        Suas conquistas aparecerão aqui conforme você evolui sua floresta!
      </p>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(3, 1fr)', 
      gap: '12px',
      padding: '10px 0'
    }}>
      {displayedBadges.map(badge => (
        <BadgeItem key={badge.id} badge={badge} />
      ))}
    </div>
  );
};

const BadgeItem = ({ badge }) => {
  const { isUnlocked, label, threshold, type, icon } = badge;

  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        if (!isUnlocked) {
          alert(type === 'engagement' 
            ? `Registre ${threshold} movimentações para desbloquear!` 
            : `Economize um total de R$ ${threshold.toLocaleString('pt-BR')} para desbloquear!`);
        }
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        opacity: isUnlocked ? 1 : 0.3,
        filter: isUnlocked ? 'none' : 'grayscale(1)',
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div style={{
        width: '60px',
        height: '60px',
        background: 'var(--surface-color)',
        borderRadius: '18px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid var(--glass-border)',
        boxShadow: isUnlocked ? 'var(--shadow-sm)' : 'none',
        position: 'relative'
      }}>
        <BadgeSVG type={type} icon={icon} isUnlocked={isUnlocked} />
        {!isUnlocked && (
          <div style={{ position: 'absolute', bottom: -5, right: -5 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-main)">
              <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 5a3 3 0 0 1 6 0v3H9V7zm3 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          </div>
        )}
      </div>
      <span style={{ 
        fontSize: '0.6rem', 
        fontWeight: '700', 
        textAlign: 'center',
        lineHeight: 1.1,
        color: 'var(--text-main)'
      }}>
        {isUnlocked ? label.split(' ')[0] + '...' : 'Bloqueado'}
      </span>
    </motion.div>
  );
};

const BadgeSVG = ({ type, icon, isUnlocked }) => {
  const color = type === 'engagement' ? '#B8C1A0' : '#FFCD92';
  
  return (
    <svg viewBox="0 0 60 60" width="100%" height="100%">
      {/* Hand-drawn organic circle background */}
      <path
        d="M30 5 
           C 45 5, 55 15, 55 30 
           C 55 45, 45 55, 30 55 
           C 15 55, 5 45, 5 30 
           C 5 15, 15 5, 30 5 Z"
        fill={color}
        opacity="0.2"
      />
      {/* Icon Placeholder (In a real app, I'd have 10 separate SVGs, but using emojis as shorthand for now while maintaining the "hand-drawn" container) */}
      <text 
        x="50%" 
        y="50%" 
        dominantBaseline="middle" 
        textAnchor="middle" 
        fontSize="30"
      >
        {icon}
      </text>
    </svg>
  );
};

export default AchievementBadges;
