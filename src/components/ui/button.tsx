
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8E24AA]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        purpleDark: "bg-purple-600 text-white hover:bg-purple-800", // Purple with dark hover - text always white
        purpleLight: "bg-purple-500 text-white hover:bg-purple-700", // Light purple with darker hover - text always white
        greenDark: "bg-green-600 text-white hover:bg-green-800", // Green with dark hover - text always white
        blueDark: "bg-blue-600 text-white hover:bg-blue-800", // Blue with dark hover - text always white
        redDark: "bg-red-600 text-white hover:bg-red-800", // Red with dark hover - text always white
        // Updated variant for sales page with glassmorphism effects
        sales: "bg-gradient-to-r from-purple-700 to-purple-900 text-white hover:from-purple-800 hover:to-purple-950 shadow-md shadow-purple-500/30 transition-all duration-300",
        // Glass effect button with new tech aesthetics
        glass: "backdrop-blur-md bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-300 shadow-md shadow-white/5 hover:shadow-lg hover:shadow-white/10",
        // Neon effect button with tech-inspired glow
        neon: "bg-transparent border-2 border-[#304FFE] text-[#304FFE] hover:text-white hover:bg-[#304FFE]/20 hover:border-[#304FFE] hover:shadow-[0_0_15px_rgba(48,79,254,0.5)] transition-all duration-300",
        // High-contrast tech button
        tech: "bg-[#0A0F1C] border border-[#304FFE]/50 text-white hover:bg-[#151F38] hover:border-[#304FFE] transition-all duration-300 shadow-md shadow-[#304FFE]/20",
        // New gradient pulsing button
        gradient: "bg-gradient-to-r from-[#304FFE] to-[#8E24AA] text-white hover:shadow-lg hover:shadow-[#304FFE]/30 transition-all duration-300",
        
        // New CYRUS button variants with improved contrast and interaction
        cyrusPrimary: "bg-gradient-to-r from-[#8E24AA] to-[#4A148C] hover:from-[#A64EFF] hover:to-[#6A1B9A] text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 ease-in-out rounded-full",
        cyrusWhite: "bg-white text-black hover:bg-zinc-100 font-semibold transition-all duration-200 ease-in-out rounded-full",
        cyrusGhost: "bg-transparent border border-[#8E24AA] text-[#8E24AA] hover:bg-[#8E24AA]/10 hover:text-[#A64EFF] font-medium transition-all duration-200 ease-in-out rounded-full",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
        // New CYRUS button sizes
        cyrus: "px-5 py-2.5",
        cyrusSm: "px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
