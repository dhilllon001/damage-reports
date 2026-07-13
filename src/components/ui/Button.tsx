import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dark' | 'soft'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: 'sm' | 'md' | 'lg'
}

const variants: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-[#0066cc] shadow-[var(--shadow-rest)]',
  secondary: 'bg-green text-white hover:bg-[#176639] shadow-[var(--shadow-rest)]',
  ghost: 'bg-transparent text-ink-2 hover:bg-black/[0.04] border border-line',
  danger: 'bg-red text-white hover:bg-[#c43329]',
  dark: 'bg-ink text-white hover:bg-[#333]',
  soft: 'bg-accent-soft text-accent hover:bg-[#d7e9fa]',
}

const sizes = {
  sm: 'h-8 px-3.5 text-[12.5px]',
  md: 'h-9 px-4 text-[13px]',
  lg: 'h-11 px-5 text-[14px] font-semibold',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius-btn)] font-semibold transition-all duration-200 ease-[var(--ease-apple)] disabled:pointer-events-none disabled:opacity-40',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
)
Button.displayName = 'Button'
