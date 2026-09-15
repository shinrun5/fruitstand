import { ButtonHTMLAttributes, ReactNode } from "react";

const VARIANT_CLASS = {
  primary: "bg-green text-white",
  secondary: "bg-paper text-ink",
  alert: "bg-coral text-white",
} as const;

type Variant = keyof typeof VARIANT_CLASS;

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

/** Chunky pill button, matching the Fruit Crew app's style guide. */
export function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`inline-flex items-center gap-2 rounded-full border-[3px] border-ink px-[22px] py-3
        font-heading text-[15px] font-bold shadow-[4px_4px_0_var(--color-ink)]
        transition-transform active:translate-x-1 active:translate-y-1 active:shadow-none
        disabled:pointer-events-none disabled:opacity-50
        ${VARIANT_CLASS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
