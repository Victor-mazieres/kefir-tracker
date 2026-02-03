import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-text-main mb-1">{label}</label>}
            <input
                type={type}
                className={cn(
                    'flex h-12 w-full rounded-md border bg-surface px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                    error ? 'border-red-500 focus-visible:ring-red-500' : 'border-secondary',
                    className
                )}
                ref={ref}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
});
Input.displayName = 'Input';
