
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // Added onClick prop to support clickable cards
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`bg-gray-800/50 border border-gray-700/50 rounded-xl shadow-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
