import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm": variant === "primary",
            "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50": variant === "secondary",
            "bg-red-600 hover:bg-red-700 text-white": variant === "danger",
            "hover:bg-gray-100 text-gray-700": variant === "ghost",
            "px-3 py-2 text-sm": size === "sm",
            "px-4 py-2.5 text-sm": size === "md",
            "px-6 py-3 text-base": size === "lg",
          },
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };