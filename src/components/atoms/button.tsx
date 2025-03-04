import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cva } from "cva";
import type { VariantProps } from "cva";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function Button(props: ButtonProps) {
  const { variant, children, onClick, ...rest } = props;

  return (
    <button className={buttonVariants({ variant })} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
