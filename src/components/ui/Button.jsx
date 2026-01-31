import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
        primary: 'bg-primary text-white hover:bg-primary-light focus-visible:ring-primary shadow-sm hover:shadow-md',
        secondary: 'bg-surface text-text-main border border-secondary hover:bg-background focus-visible:ring-text-main shadow-sm',
        danger: 'bg-accent text-white hover:bg-accent-hover focus-visible:ring-accent shadow-sm',
        ghost: 'hover:bg-secondary/10 text-text-main hover:text-primary',
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
        <button
            ref={ref}
            className={cn(
                'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
});

Button.displayName = 'Button';
