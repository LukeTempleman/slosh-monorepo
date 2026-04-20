import { Suspense } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineBackgroundProps {
  className?: string;
  sceneUrl?: string;
  opacity?: number;
}

const SplineBackground = ({ 
  className = "", 
  sceneUrl = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode",
  opacity = 0.5
}: SplineBackgroundProps) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <Suspense fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/12 animate-pulse" />
      }>
        <div 
          className="absolute inset-0 scale-110" 
          style={{ opacity }}
        >
          <Spline
            scene={sceneUrl}
            style={{
              width: '100%',
              height: '100%',
              background: 'transparent',
            }}
          />
        </div>
        {/* Gradient overlay for better text readability - adjusted for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/80" />
      </Suspense>
    </div>
  );
};

export default SplineBackground;