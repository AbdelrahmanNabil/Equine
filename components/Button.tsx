
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  className?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '',
  fullWidth = false
}) => {
  const baseStyles = "flex items-center justify-center rounded-xl px-6 py-4 font-semibold text-[17px] transition-all active:scale-95 disabled:opacity-50";
  
  const variants = {
    primary: "bg-[#007AFF] text-white",
    secondary: "bg-[#F2F2F7] text-[#007AFF]",
    success: "bg-[#34C759] text-white",
    danger: "bg-[#FF3B30] text-white",
    ghost: "bg-transparent text-[#007AFF]"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {children}
    </button>
  );
};
