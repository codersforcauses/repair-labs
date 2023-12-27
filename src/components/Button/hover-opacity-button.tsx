import { forwardRef } from "react";

const HoverOpacityButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`hover:enabled:opacity-50 transition-all duration-150 hover:enabled:scale-110 active:enabled:scale-90 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

HoverOpacityButton.displayName = "HoverOpacityButton";

export default HoverOpacityButton;
