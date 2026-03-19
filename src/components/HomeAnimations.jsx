import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WateringCanAnimation = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ x: 100, y: -50, opacity: 0, rotate: 0 }}
        animate={{ x: 50, y: 0, opacity: 1, rotate: -45 }}
        exit={{ x: 100, y: -50, opacity: 0, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <svg width="80" height="60" viewBox="0 0 80 60">
          {/* Watering Can Body */}
          <path d="M10,40 Q10,10 30,10 L50,10 Q70,10 70,40 Z" fill="#B4BA9F" />
          {/* Spout */}
          <path d="M70,30 L75,35 L75,45 L70,40" fill="#B4BA9F" />
          {/* Handle */}
          <path d="M10,25 Q0,25 0,15 Q0,5 10,5 L20,5" fill="none" stroke="#B4BA9F" strokeWidth="4" strokeLinecap="round" />
          
          {/* Droplets */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={i}
                r="3"
                fill="#A5B4FC"
                initial={{ cx: 75, cy: 40 }}
                animate={{ cx: 75 + (i - 2) * 5, cy: 100 + i * 5, opacity: 0 }}
                transition={{ 
                  duration: 1, 
                  repeat: Infinity, 
                  delay: 0.5 + i * 0.1,
                  ease: "easeIn" 
                }}
              />
            ))}
          </motion.g>
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);

export const ScissorsAnimation = ({ isVisible }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ x: -100, y: -50, opacity: 0, rotate: 0 }}
        animate={{ x: -50, y: 0, opacity: 1, rotate: 15 }}
        exit={{ x: -100, y: -50, opacity: 0, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          zIndex: 10,
          pointerEvents: 'none'
        }}
      >
        <svg width="60" height="60" viewBox="0 0 60 60">
          {/* Scissors Handle 1 */}
          <motion.circle 
            cx="15" cy="15" r="8" stroke="#FFB4A9" strokeWidth="4" fill="none"
            animate={{ rotate: [0, -20, 0] }}
            transition={{ duration: 0.4, repeat: 3 }}
          />
          {/* Scissors Handle 2 */}
          <motion.circle 
            cx="15" cy="35" r="8" stroke="#FFB4A9" strokeWidth="4" fill="none"
            animate={{ rotate: [0, 20, 0] }}
            transition={{ duration: 0.4, repeat: 3 }}
          />
          {/* Blades */}
          <motion.path 
            d="M23,25 L50,15" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round"
            animate={{ d: ["M23,25 L50,15", "M23,25 L50,23", "M23,25 L50,15"] }}
            transition={{ duration: 0.4, repeat: 3 }}
          />
          <motion.path 
            d="M23,25 L50,35" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round"
            animate={{ d: ["M23,25 L50,35", "M23,25 L50,27", "M23,25 L50,35"] }}
            transition={{ duration: 0.4, repeat: 3 }}
          />
        </svg>
      </motion.div>
    )}
  </AnimatePresence>
);
