import { useEffect, useState } from 'react';

interface Props {
    onComplete: () => void;
}

export function LearningModeIntro({ onComplete }: Props) {
    const [stage, setStage] = useState<'enter' | 'show' | 'exit'>('enter');

    useEffect(() => {
        // Smooth animation sequence with proper timing
        const enterTimer = setTimeout(() => setStage('show'), 50);
        const showTimer = setTimeout(() => setStage('exit'), 1400);
        const exitTimer = setTimeout(() => onComplete(), 1900);

        return () => {
            clearTimeout(enterTimer);
            clearTimeout(showTimer);
            clearTimeout(exitTimer);
        };
    }, [onComplete]);

    return (
        <div
            className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-gradient-to-br from-forge-cream-200 via-forge-cream-300 to-forge-cream-400
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${stage === 'enter' ? 'opacity-0' : stage === 'exit' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
      `}
        >
            {/* Ambient glow */}
            <div
                className={`
          absolute w-96 h-96 rounded-full 
          bg-gradient-to-r from-forge-orange/20 to-orange-600/10 
          blur-3xl transition-all duration-700 ease-out
          ${stage === 'enter' ? 'scale-0 opacity-0' : stage === 'show' ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}
        `}
            />

            {/* Logo container */}
            <div
                className={`
          relative z-10 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${stage === 'enter' ? 'scale-50 opacity-0 rotate-[-8deg]' : 'scale-100 opacity-100 rotate-0'}
        `}
            >
                <img
                    src="/lovable-uploads/Forge College Logo Transparent.png"
                    alt="Forge College"
                    className="h-20 sm:h-24 md:h-28 w-auto max-w-[280px] object-contain drop-shadow-[0_0_40px_rgba(249,115,22,0.3)]"
                    style={{ imageRendering: 'auto' }}
                    loading="eager"
                    onError={(e) => {
                        // Fallback para a logo antiga caso a nova não carregue
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes('Forge College Logo.png')) {
                            target.src = '/lovable-uploads/Forge College Logo.png';
                        }
                    }}
                />
            </div>

            {/* Text content */}
            <div
                className={`
          relative z-10 mt-8 text-center transition-all duration-500 ease-out
          ${stage === 'enter' ? 'opacity-0 translate-y-6' : stage === 'show' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-10px]'}
        `}
                style={{ transitionDelay: stage === 'enter' ? '0ms' : '200ms' }}
            >
                <p className="text-forge-dark/90 text-base sm:text-lg font-medium tracking-wider uppercase">
                    Learning Mode
                </p>
                <div
                    className={`
            mt-3 flex items-center justify-center gap-2 text-forge-dark/60 text-xs sm:text-sm
            transition-all duration-300
            ${stage === 'show' ? 'opacity-100' : 'opacity-0'}
          `}
                    style={{ transitionDelay: '400ms' }}
                >
                    <span>Focus</span>
                    <span className="w-1 h-1 rounded-full bg-forge-orange/60" />
                    <span>Learn</span>
                    <span className="w-1 h-1 rounded-full bg-forge-orange/60" />
                    <span>Build</span>
                </div>
            </div>

            {/* Animated rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className={`
            w-32 h-32 rounded-full border border-forge-dark/10
            transition-all duration-1000 ease-out
            ${stage === 'enter' ? 'scale-50 opacity-0' : stage === 'show' ? 'scale-[2.5] opacity-100' : 'scale-[3] opacity-0'}
          `}
                />
                <div
                    className={`
            absolute w-48 h-48 rounded-full border border-forge-dark/10
            transition-all duration-1200 ease-out
            ${stage === 'enter' ? 'scale-50 opacity-0' : stage === 'show' ? 'scale-[2] opacity-100' : 'scale-[2.5] opacity-0'}
          `}
                    style={{ transitionDelay: '100ms' }}
                />
            </div>
        </div>
    );
}
