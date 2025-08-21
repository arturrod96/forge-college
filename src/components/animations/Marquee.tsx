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
  const animationDirection = direction === "left" ? "marquee-left" : "marquee-right";
  
  return (
    <div 
      className={`overflow-hidden whitespace-nowrap [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${className}`}
    >
      <div 
        className={`inline-flex gap-10 animate-[${animationDirection}_${speed}s_linear_infinite]`}
      >
        {children}
        {children}
      </div>
      
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
