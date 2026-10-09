import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  padding = 'md',
  hoverEffect = false,
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6 sm:p-7',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-subtle ${
        hoverEffect ? 'hover:shadow-card hover:border-slate-300 transition-all duration-200' : ''
      } ${paddingClasses[padding]} ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
