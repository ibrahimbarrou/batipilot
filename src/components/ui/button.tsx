"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0 active:scale-[0.985] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-800 text-white shadow-xs hover:bg-brand-900 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-brand-500/40",
        secondary:
          "bg-white text-ink-800 border border-line shadow-xs hover:bg-ink-50 hover:border-line-strong",
        ghost: "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
        subtle: "bg-ink-100 text-ink-700 hover:bg-ink-200",
        signal:
          "bg-signal-500 text-white shadow-xs hover:bg-signal-600 focus-visible:ring-2 focus-visible:ring-signal-400/40",
        danger: "bg-risk-600 text-white shadow-xs hover:bg-risk-700",
        outline:
          "border border-brand-200 bg-brand-50/60 text-brand-800 hover:bg-brand-100",
        link: "text-brand-700 underline-offset-4 hover:underline",
        dark: "bg-ink-900 text-white hover:bg-ink-800 shadow-xs",
      },
      size: {
        xs: "h-7 px-2.5 text-xs [&_svg]:size-3.5",
        sm: "h-8 px-3 text-[13px] [&_svg]:size-4",
        md: "h-9 px-3.5 text-sm [&_svg]:size-4",
        lg: "h-11 px-5 text-[15px] [&_svg]:size-[18px]",
        icon: "size-9 [&_svg]:size-4",
        "icon-sm": "size-8 [&_svg]:size-4",
        "icon-xs": "size-7 [&_svg]:size-3.5",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && !asChild ? (
          <>
            <Loader2 className="animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
