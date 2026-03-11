import React from 'react';

const LoadingDots = ({ style = {} }) => {
    return (
        <div className="typing-indicator" style={style}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
};

export default LoadingDots;
