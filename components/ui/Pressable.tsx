"use client";

import { forwardRef } from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "quiet" | "plain";
  size?: "md" | "small";
};

export const Pressable = forwardRef<HTMLButtonElement, Props>(function Pressable(
  { tone = "plain", size = "md", className = "", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={`pressable btn btn-${tone} ${size === "small" ? "btn-small" : ""} ${className}`}
      {...props}
    />
  );
});
