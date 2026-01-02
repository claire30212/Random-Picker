import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyle = "rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-morandi-dark text-morandi-base shadow-lg shadow-morandi-dark/20 hover:bg-morandi-dark/90 hover:shadow-xl",
    secondary: "bg-morandi-sand text-morandi-dark shadow-md hover:bg-morandi-sand/80",
    outline: "border-2 border-morandi-dark text-morandi-dark hover:bg-morandi-dark hover:text-morandi-base",
    ghost: "text-morandi-gray hover:bg-morandi-gray/10 hover:text-morandi-dark",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg font-bold",
  };

  return (
    <button
      className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;