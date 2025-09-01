import React from 'react';

// FIX: Update ButtonProps to be a discriminated union to correctly handle polymorphic rendering.
// This ensures that when `as='label'`, the props are correctly typed for a label element,
// and when `as='button'` or is omitted, props are typed for a button element.
type BaseProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
};

type ButtonAsButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    as?: 'button';
  };

type ButtonAsLabelProps = BaseProps &
  Omit<React.LabelHTMLAttributes<HTMLLabelElement>, keyof BaseProps> & {
    as: 'label';
  };

type ButtonProps = ButtonAsButtonProps | ButtonAsLabelProps;

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', as = 'button', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // FIX: Conditionally render a 'label' or 'button' element based on the 'as' prop.
  // A type assertion is used on `props` because TypeScript cannot correctly infer
  // the type of a rest parameter (`...props`) from a destructured discriminated union.
  if (as === 'label') {
    return (
      <label className={combinedClasses} {...(props as React.LabelHTMLAttributes<HTMLLabelElement>)}>
        {children}
      </label>
    );
  }

  return (
    <button className={combinedClasses} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
};
