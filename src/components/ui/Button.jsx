import { forwardRef } from 'react';
import { cn } from '../../lib/utils';


const Button = forwardRef(({ className, variant = 'primary', size = 'default', ...props }, ref) => {
    const variants = {
        primary: 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 hover:-translate-y-0.5 active:translate-y-0',
        secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300',
        ghost: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700',
        outline: 'border-2 border-slate-200 text-slate-600 hover:border-orange-500 hover:text-orange-600'
    };

    const sizes = {
        default: 'px-5 py-2.5 rounded-xl font-bold transition-all',
        sm: 'px-3 py-1.5 text-sm rounded-lg font-bold',
        lg: 'px-8 py-4 text-lg rounded-2xl font-bold',
        icon: 'p-2.5 rounded-xl aspect-square flex items-center justify-center'
    };

    return (
        <button
            ref={ref}
            className={cn('inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none', variants[variant], sizes[size], className)}
            {...props}
        />
    );
});

Button.displayName = 'Button';

export { Button };
