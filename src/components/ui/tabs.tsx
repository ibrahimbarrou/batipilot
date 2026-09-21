"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { variant?: "pill" | "underline" }
>(({ className, variant = "pill", ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      variant === "pill"
        ? "inline-flex items-center gap-0.5 rounded-lg border border-line bg-ink-50 p-1"
        : "inline-flex items-center gap-6 border-b border-line",
      className,
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & { variant?: "pill" | "underline" }
>(({ className, variant = "pill", ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1.5 text-[13px] font-medium whitespace-nowrap transition-all disabled:opacity-50 [&_svg]:size-4",
      variant === "pill"
        ? "rounded-md px-3 py-1.5 text-ink-500 hover:text-ink-800 data-[state=active]:bg-white data-[state=active]:text-ink-900 data-[state=active]:shadow-xs"
        : "-mb-px border-b-2 border-transparent px-0.5 py-2.5 text-ink-500 hover:text-ink-800 data-[state=active]:border-brand-700 data-[state=active]:text-brand-800",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("focus-visible:outline-none data-[state=active]:animate-[fade-up_0.35s_var(--ease-out-quint)_both]", className)}
    {...props}
  />
));
TabsContent.displayName = "TabsContent";
