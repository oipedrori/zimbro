import React from 'react';

const BadgeSVG = ({ 
    categoryColor = '#ef4444', 
    title = 'Conquista', 
    size = 120 
}) => {
    const radius = size / 2;
    const pathRadius = radius - 15; // Ajustar o raio para o texto caber dentro
    
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`} 
            xmlns="http://www.w3.org/2000/svg"
            style={{ 
                filter: 'drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.2))'
            }}
        >
            {/* Background Circle */}
            <circle cx={radius} cy={radius} r={radius} fill={categoryColor} />
            
            {/* Inner Border */}
            <circle cx={radius} cy={radius} r={radius - 4} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Center Logo Background (White circle) */}
            <circle cx={radius} cy={radius} r={radius * 0.45} fill="#ffffff" />
            
            {/* Zimbroo Logo Placeholder - Will be an image or SVG path */}
            {/* For now we use the leaf from lucide or standard zimbroo shape */}
            {/* SVG Logo Path (simplified Leaf) */}
            <g transform={`translate(${radius - 12}, ${radius - 12}) scale(1)`}>
                 <path d="M12 22C12 22 20 16 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9C4 16 12 22 12 22Z" fill={categoryColor} />
                 <path d="M12 22V9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                 <path d="M8 14L12 9" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Circular Text Path - Bottom Half Arc */}
            <defs>
                <path 
                    id={`textArc-${title.replace(/\\s/g, '-')}`} 
                    d={`
                        M ${radius - pathRadius}, ${radius}
                        a ${pathRadius},${pathRadius} 0 0,0 ${pathRadius * 2},0
                    `}
                />
            </defs>

            {/* Circular Text */}
            <text 
                fill="#ffffff" 
                fontSize="12" 
                fontWeight="bold" 
                fontFamily="system-ui, -apple-system, sans-serif"
                letterSpacing="1px"
            >
                <textPath 
                    href={`#textArc-${title.replace(/\\s/g, '-')}`} 
                    startOffset="50%" 
                    textAnchor="middle"
                >
                    {title.toUpperCase()}
                </textPath>
            </text>
        </svg>
    );
};

export default BadgeSVG;
