
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
    title: string;
    description: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, description }) => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    );
}
