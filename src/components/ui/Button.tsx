import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  loading = false,
  disabled,
  ...props 
}) => {
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium 
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    relative overflow-hidden
    ${!disabled && !loading ? 'button-hover' : ''}
  `;
  
  const variants = {
    primary: `
      bg-indigo-600 text-white shadow-sm
      hover:bg-indigo-700 hover:shadow-md
      active:bg-indigo-800
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    secondary: `
      bg-purple-600 text-white shadow-sm
      hover:bg-purple-700 hover:shadow-md
      active:bg-purple-800
      before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700
    `,
    outline: `
      border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
      hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-sm
      active:bg-gray-100 dark:active:bg-gray-600
    `,
    ghost: `
      text-gray-700 dark:text-gray-300 bg-transparent
      hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm
      active:bg-gray-200 dark:active:bg-gray-700
    `
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={loading ? 'opacity-0' : 'relative z-10'}>
        {children}
      </span>
    </button>
  );
};

export default Button;