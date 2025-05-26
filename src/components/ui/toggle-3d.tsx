
import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggle3DVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground transform-gpu",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-white to-gray-50 border border-gray-200 shadow-sm hover:shadow-md data-[state=on]:from-blue-50 data-[state=on]:to-blue-100 data-[state=on]:border-blue-200 data-[state=on]:shadow-inner dark:from-gray-800 dark:to-gray-900 dark:border-gray-700 dark:data-[state=on]:from-blue-900 dark:data-[state=on]:to-blue-800",
        outline: "border border-input bg-gradient-to-b from-transparent to-gray-50/50 hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-gradient-to-b data-[state=on]:from-accent data-[state=on]:to-accent/80 dark:to-gray-800/50",
        raised: "bg-gradient-to-b from-white via-gray-50 to-gray-100 border border-gray-200 shadow-lg hover:shadow-xl active:shadow-inner data-[state=on]:from-blue-100 data-[state=on]:via-blue-50 data-[state=on]:to-blue-200 data-[state=on]:shadow-inner dark:from-gray-700 dark:via-gray-800 dark:to-gray-900",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
      effect: {
        none: "",
        subtle: "hover:scale-[1.02] active:scale-[0.98]",
        medium: "hover:scale-105 active:scale-95 hover:-translate-y-0.5",
        strong: "hover:scale-110 active:scale-90 hover:-translate-y-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      effect: "subtle",
    },
  }
)

export interface Toggle3DProps
  extends React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
    VariantProps<typeof toggle3DVariants> {}

const Toggle3D = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  Toggle3DProps
>(({ className, variant, size, effect, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggle3DVariants({ variant, size, effect, className }))}
    {...props}
  />
))

Toggle3D.displayName = TogglePrimitive.Root.displayName

export { Toggle3D, toggle3DVariants }
