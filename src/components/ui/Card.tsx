import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  elevation?: 'soft' | 'medium' | 'large';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = true,
  elevation = 'soft'
}) => {
  const elevationClasses = {
    soft: 'card-shadow-soft',
    medium: 'card-shadow-medium',
    large: 'card-shadow-large'
  };

  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 
      ${elevationClasses[elevation]}
      ${hover ? 'card-hover' : 'transition-shadow duration-300'}
      ${className}
    `}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};