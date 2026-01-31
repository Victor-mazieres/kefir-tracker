import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ className, type, label, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-text-main mb-1">{label}</label>}
            <input
                type={type}
                className={cn(
                    'flex h-12 w-full rounded-md border border-secondary bg-surface px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
                    className
                )}
                ref={ref}
                {...props}
            />
        </div>
    );
});
Input.displayName = 'Input';
