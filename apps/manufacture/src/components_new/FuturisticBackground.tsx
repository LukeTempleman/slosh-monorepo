import { memo } from 'react';

interface FuturisticBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const FuturisticBackground = memo(({ 
  className = "", 
  intensity = 'medium' 
}: FuturisticBackgroundProps) => {
  const getAnimationSpeed = () => {
    switch (intensity) {
      case 'low': return { slow: '60s', medium: '40s', fast: '25s' };
      case 'medium': return { slow: '45s', medium: '30s', fast: '20s' };
      case 'high': return { slow: '30s', medium: '20s', fast: '15s' };
      default: return { slow: '45s', medium: '30s', fast: '20s' };
    }
  };

  const speed = getAnimationSpeed();

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Primary gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/8 to-accent/15" />
      
      {/* Animated geometric grid */}
      <div className="absolute inset-0 opacity-35">
        <div 
          className="absolute inset-0 bg-grid-pattern animate-grid-move"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animationDuration: speed.slow
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Large floating circles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`circle-${i}`}
            className={`absolute rounded-full border-2 border-primary/35 animate-float-${(i % 3) + 1} shadow-lg shadow-primary/10`}
            style={{
              width: `${120 + i * 40}px`,
              height: `${120 + i * 40}px`,
              left: `${10 + i * 15}%`,
              top: `${5 + i * 12}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: speed.medium
            }}
          />
        ))}

        {/* Hexagonal patterns */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`hex-${i}`}
            className="absolute animate-pulse"
            style={{
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 4) * 20}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${3 + i * 0.5}s`
            }}
          >
            <div className="w-8 h-8 border-2 border-accent/45 transform rotate-45 shadow-sm shadow-accent/20" />
          </div>
        ))}

        {/* Scanning lines */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent animate-scan-horizontal"
          style={{ animationDuration: speed.fast }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent animate-scan-vertical"
          style={{ 
            animationDuration: speed.fast,
            animationDelay: '10s'
          }}
        />

        {/* Data stream lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`stream-${i}`}
            className="absolute h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-data-stream shadow-sm shadow-primary/30"
            style={{
              top: `${20 + i * 15}%`,
              left: '-100%',
              width: '200%',
              animationDelay: `${i * 3}s`,
              animationDuration: speed.medium
            }}
          />
        ))}

        {/* Particle field */}
        {[...Array(20)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 bg-primary/75 rounded-full animate-particle-float shadow-sm shadow-primary/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}

        {/* Digital rain effect */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`rain-${i}`}
            className="absolute w-0.5 bg-gradient-to-b from-success/40 via-success/30 to-transparent animate-digital-rain shadow-sm shadow-success/20"
            style={{
              left: `${10 + i * 10}%`,
              height: `${80 + Math.random() * 80}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 6}s`
            }}
          />
        ))}

        {/* Orbital rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {[...Array(3)].map((_, i) => (
              <div
                key={`orbit-${i}`}
                className={`absolute border-2 border-primary/25 rounded-full animate-orbit-${i + 1} shadow-lg shadow-primary/10`}
                style={{
                  width: `${300 + i * 150}px`,
                  height: `${300 + i * 150}px`,
                  left: `${-150 - i * 75}px`,
                  top: `${-150 - i * 75}px`,
                  animationDuration: `${20 + i * 10}s`
                }}
              >
                <div 
                  className="absolute w-3 h-3 bg-primary/80 rounded-full shadow-lg shadow-primary/50"
                  style={{
                    top: '-6px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay gradients for content readability - adjusted for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/40 to-background/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />
    </div>
  );
});

FuturisticBackground.displayName = 'FuturisticBackground';

export default FuturisticBackground;
