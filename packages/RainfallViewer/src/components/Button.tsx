import React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

export const buttonClasses = tv({
  base: 'rounded-md text-sm text-center font-semibold shadow-sm focus-visible:outline focus-visible:outline-indigo-dye focus-visible:outline-2 focus-visible:outline-offset-2',
  variants: {
    color: {
      primary: 'bg-indigo-dye text-white hover:bg-indigo-dye ',
      secondary:
        'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
    },
    disabled: {
      true: 'opacity-50 pointer-events-none',
    },
    size: {
      xs: 'rounded px-2 py-1 text-xs',
      sm: 'rounded px-2 py-1',
      md: 'px-2.5 py-1.5',
      lg: 'px-3 py-2',
      xl: 'px-3.5 py-2.5',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

type ButtonVariants = VariantProps<typeof buttonClasses>;
interface ButtonProps extends ButtonVariants {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Button({
  color,
  size,
  className,
  disabled,
  children,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses({ color, size, className, disabled })}
    >
      {children}
    </button>
  );
}
