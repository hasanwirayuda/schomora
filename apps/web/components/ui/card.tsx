import { clsx } from "clsx";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "sm" | "md" | "lg";
  bgColor?: string;
  border?: boolean;
  borderColor?: string;
}

export default function Card({
  padding = "md",
  bgColor = "bg-white",
  border = true,
  borderColor = "border-gray-200",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl",
        bgColor,
        {
          border: border,
          [borderColor]: border,
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
