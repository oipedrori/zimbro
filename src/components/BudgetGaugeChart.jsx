import React from 'react';
import { motion } from 'framer-motion';

const BudgetGaugeChart = ({ percentage = 0 }) => {
  // Ensure percentage is between 0 and 100
  const val = Math.min(Math.max(percentage, 0), 100);
  
  // Calculate stroke color based on progress (low=green, mid=orange, high=red)
  const getStrokeColor = (p) => {
    if (p < 40) return '#B8C1A0'; // Muted Green
    if (p < 80) return '#EFA86B'; // Muted Orange
    return '#7A3B36'; // Muted Red
  };

  const strokeColor = getStrokeColor(val);
  
  // SVG path for semi-circle
  // Using 180-degree arc
  const radius = 80;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (val / 100) * circumference;

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      gap: '8px'
    }}>
      <p style={{ 
        fontSize: '0.85rem', 
        fontWeight: '700', 
        color: 'var(--text-main)',
        opacity: 0.8 
      }}>
        Progresso do Orçamento (%)
      </p>
      
      <div style={{ 
        position: 'relative', 
        width: '200px', 
        height: '100px',
        overflow: 'hidden'
      }}>
        {/* Blur Layer behind the chart */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '0',
          background: 'rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '100px 100px 0 0',
          zIndex: 0
        }}></div>
        
        <svg viewBox="0 0 200 100" style={{ position: 'relative', zIndex: 1 }}>
          {/* Background Track */}
          <path
            d="M20,100 A80,80 0 0,1 180,100"
            fill="none"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Progress Path */}
          <motion.path
            d="M20,100 A80,80 0 0,1 180,100"
            fill="none"
            stroke={strokeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Percentage text centered in the gauge */}
        <div style={{
          position: 'absolute',
          bottom: '5px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2
        }}>
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              fontSize: '1.4rem', 
              fontWeight: '800', 
              color: 'var(--text-main)' 
            }}
          >
            {Math.round(val)}%
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default BudgetGaugeChart;
