import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export const Marquee = ({ 
  children, 
  speed = 22, 
  direction = "left",
  className = ""
}: MarqueeProps) => {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";
  
  return (
    <div 
      className={`overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <div 
        className={`inline-flex gap-10 ${animationClass}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
        {children}
      </div>
    </div>
  );
};
