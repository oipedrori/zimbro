import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(62, 74, 53, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              zIndex: 100
            }}
          />
          
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'var(--surface-color)',
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              padding: '24px',
              paddingBottom: 'max(40px, env(safe-area-inset-bottom))',
              zIndex: 101,
              boxShadow: '0 -10px 40px rgba(0,0,0,0.1)',
              maxHeight: '80vh',
              overflowY: 'auto'
            }}
          >
            {/* Handle */}
            <div style={{
              width: '40px',
              height: '4px',
              background: 'rgba(62, 74, 53, 0.2)',
              borderRadius: '2px',
              margin: '0 auto 20px auto'
            }} />
            
            {title && (
              <h3 style={{ 
                fontSize: '1.2rem', 
                fontWeight: '800', 
                color: 'var(--text-main)',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                {title}
              </h3>
            )}
            
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
