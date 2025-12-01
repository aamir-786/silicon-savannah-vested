import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string
    label?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, error, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-[hsl(var(--foreground))]">
                        {label}
                        {props.required && <span className="text-[hsl(var(--error))] ml-1">*</span>}
                    </label>
                )}
                <input
                    type={type}
                    className={cn(
                        "flex h-11 w-full rounded-lg border-2 border-[hsl(var(--border))] bg-background px-4 py-2 text-sm transition-colors",
                        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                        "placeholder:text-[hsl(var(--muted-foreground))]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:border-[hsl(var(--primary))]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        error && "border-[hsl(var(--error))] focus-visible:ring-[hsl(var(--error))]",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-[hsl(var(--error))]">{error}</p>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
