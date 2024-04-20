import { JSX } from "solid-js/jsx-runtime";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { splitProps } from "solid-js";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  label: string;
}

export function Button(props: ButtonProps) {
  const [defined, rest] = splitProps(props, ["variant", "label"]);
  
  return (
    <button
      class={buttonVariants({ variant: defined.variant })}
      {...rest}
    >
      {defined.label}
    </button>
  );
}