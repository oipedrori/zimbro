import React from 'react';
import { motion } from 'framer-motion';

const GrowthRingsChart = ({ yearlyStats = [] }) => {
  // Take up to 12 months
  const stats = yearlyStats.slice(-12);
  const maxBalance = Math.max(...stats.map(s => Math.abs(s.balance)), 1);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '16px',
      padding: '24px 0'
    }}>
      <h4 style={{ 
        fontSize: '0.9rem', 
        fontWeight: '700', 
        color: 'var(--text-main)',
        opacity: 0.8 
      }}>
        Anéis de Crescimento (Histórico Anual)
      </h4>
      
      <div style={{ width: '240px', height: '240px', position: 'relative' }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          {stats.map((month, i) => {
            // Organic ring: thicker if balance is higher.
            const thickness = 2 + (Math.abs(month.balance) / maxBalance) * 10;
            const innerRadius = 20 + i * 12; // Start from center
            const color = month.balance >= 0 ? 'rgba(184, 193, 160, 0.4)' : 'rgba(122, 59, 54, 0.4)';
            
            return (
              <motion.circle
                key={i}
                cx="100"
                cy="100"
                r={innerRadius}
                fill="none"
                stroke={color}
                strokeWidth={thickness}
                strokeLinecap="round"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 1 }}
                style={{ 
                  filter: 'url(#distort)',
                  mixBlendMode: 'multiply' 
                }}
              />
            );
          })}
          
          {/* Trunk Texture Lines */}
          <g fill="none" stroke="rgba(62, 74, 53, 0.05)" strokeWidth="1">
            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="20" y1="100" x2="180" y2="100" />
          </g>

          {/* SVG filter for organic, imperfect paths */}
          <defs>
            <filter id="distort">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default GrowthRingsChart;
