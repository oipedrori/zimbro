import React from 'react';
import { motion } from 'framer-motion';

const MutedGenericTree = ({ 
  size = 200, 
  canopyColor = '#B8C1A0', 
  trunkColor = '#3E4A35',
  onClick 
}) => {
  return (
    <motion.div 
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      style={{ 
        width: size, 
        height: size, 
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        position: 'relative'
      }}
    >
      <svg 
        viewBox="0 0 200 200" 
        width="100%" 
        height="100%" 
        fill="none" 
        style={{ filter: 'drop-shadow(0 10px 15px rgba(62, 74, 53, 0.1))' }}
      >
        {/* Trunk */}
        <path
          d="M90 190 L110 190 L105 100 L95 100 Z"
          fill={trunkColor}
          opacity="0.9"
        />
        {/* Trunk Texture */}
        <path d="M98 170 L102 170" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
        <path d="M100 140 L104 140" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeLinecap="round" />
        
        {/* Canopy - Hand-drawn/Organic feel using multiple circles or a complex path */}
        <motion.g
          animate={{ 
            y: [0, -5, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          {/* Main Rounded Shape */}
          <path
            d="M100 30 
               C 60 30, 40 60, 40 90 
               C 40 120, 60 140, 100 140 
               C 140 140, 160 120, 160 90 
               C 160 60, 140 30, 100 30 Z"
            fill={canopyColor}
          />
          
          {/* Subtle Shading */}
          <path
            d="M100 30 
               C 120 30, 150 50, 150 90 
               C 150 120, 130 140, 100 140 Z"
            fill="black"
            opacity="0.05"
          />
          
          {/* Leaf Texture Details (Dashed lines) */}
          <g stroke="rgba(0,0,0,0.1)" strokeWidth="2" strokeLinecap="round">
            <line x1="70" y1="60" x2="75" y2="62" />
            <line x1="90" y1="50" x2="95" y2="52" />
            <line x1="120" y1="70" x2="125" y2="72" />
            <line x1="80" y1="90" x2="85" y2="92" />
            <line x1="110" y1="100" x2="115" y2="102" />
            <line x1="60" y1="110" x2="65" y2="112" />
            <line x1="130" y1="115" x2="135" y2="117" />
          </g>
        </motion.g>
      </svg>
    </motion.div>
  );
};

export default MutedGenericTree;
