import React from 'react';
import { motion } from 'framer-motion';
import { CATEGORIAS_DESPESA, getCategoryInfo } from '../utils/categories';

const AUTUMN_COLORS = [
  '#7A3B36', '#8F4A44', '#A55A52', '#BA6A62', '#CF7B71', '#E28D83', '#F2A095', '#FFB4A9',
  '#A66135', '#BA7140', '#CE834D', '#DF955B', '#EFA86B', '#F9BB7E', '#FFCD92', '#FFDFA8'
];

const CategoryForest = ({ transactions, onCategoryClick }) => {
  // Calculate expenses per category
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const catId = getCategoryInfo(t.category, 'expense').id;
      acc[catId] = (acc[catId] || 0) + t.amount;
      return acc;
    }, {});

  const maxExpense = Math.max(...Object.values(expensesByCategory), 1);

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(4, 1fr)', 
      gap: '16px',
      padding: '20px 0'
    }}>
      {CATEGORIAS_DESPESA.map((cat, index) => {
        const amount = expensesByCategory[cat.id] || 0;
        // Scale from 0.4 to 1.2
        const scale = 0.4 + (amount / maxExpense) * 0.8;
        const color = AUTUMN_COLORS[index % AUTUMN_COLORS.length];

        return (
          <motion.div
            key={cat.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onCategoryClick(cat, amount)}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '80px', 
              display: 'flex', 
              alignItems: 'flex-end', 
              justifyContent: 'center',
              position: 'relative'
            }}>
              <TreeSVG color={color} scale={scale} />
            </div>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: '700', 
              color: 'var(--text-main)', 
              textAlign: 'center',
              lineHeight: 1,
              opacity: amount > 0 ? 1 : 0.5
            }}>
              {cat.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

const TreeSVG = ({ color, scale }) => (
  <svg 
    viewBox="0 0 100 120" 
    width="100%" 
    height="100%" 
    style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}
  >
    {/* Trunk */}
    <path d="M45 120 L55 120 L52 80 L48 80 Z" fill="#3E4A35" />
    {/* Canopy (Rounded cloud-like) */}
    <path
      d="M50 20 
         C 30 20, 15 35, 15 55 
         C 15 75, 30 90, 50 90 
         C 70 90, 85 75, 85 55 
         C 85 35, 70 20, 50 20 Z"
      fill={color}
    />
    {/* Texture */}
    <g stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round">
      <line x1="35" y1="45" x2="40" y2="47" />
      <line x1="60" y1="40" x2="65" y2="42" />
      <line x1="45" y1="65" x2="50" y2="67" />
    </g>
  </svg>
);

export default CategoryForest;
