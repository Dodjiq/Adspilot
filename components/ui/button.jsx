import * as React from "react"
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* Brand primary — purple */
        default:
          "bg-primary text-primary-foreground border-primary hover:brightness-110",
        /* Outlined — ghost with border, stays white text on hover */
        outline:
          "border-border bg-white/5 text-foreground hover:bg-white/10 hover:border-white/30",
        /* Secondary surface */
        secondary:
          "bg-secondary text-secondary-foreground border-secondary hover:bg-secondary/70",
        /* Ghost — transparent, white text, subtle hover */
        ghost:
          "bg-transparent text-foreground/70 border-transparent hover:bg-white/8 hover:text-foreground",
        /* Destructive — red tint */
        destructive:
          "bg-destructive/15 text-red-400 border-destructive/30 hover:bg-destructive/25",
        link: "text-primary underline-offset-4 hover:underline border-transparent bg-transparent",
      },
      size: {
        default: "h-9 gap-1.5 px-4 py-2",
        xs:      "h-6 gap-1 px-2 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3",
        sm:      "h-7 gap-1 px-3 text-xs rounded-md [&_svg:not([class*='size-'])]:size-3.5",
        lg:      "h-10 gap-2 px-5 rounded-lg",
        icon:    "size-9 rounded-lg",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
