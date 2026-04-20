import React from 'react';

interface FuturisticBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({ intensity = 'medium' }) => {
  const getIntensity = () => {
    switch (intensity) {
      case 'low':
        return 'opacity-20';
      case 'high':
        return 'opacity-40';
      default:
        return 'opacity-30';
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated Grid Background */}
      <div className={`absolute inset-0 ${getIntensity()} transition-opacity duration-300`}>
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary/20 dark:text-primary/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Shapes */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
    </div>
  );
};

export default FuturisticBackground;
