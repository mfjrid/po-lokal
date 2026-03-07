import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "secondary" | "destructive" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
    const variants = {
        default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
        destructive: "bg-red-500 text-slate-50 hover:bg-red-500/80",
        warning: "bg-amber-500 text-white hover:bg-amber-500/80",
    };

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 border-transparent",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge };
