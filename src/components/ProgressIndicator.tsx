
import React from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';

interface ProgressIndicatorProps {
  progress: number;
  stage: string;
}

const ProgressIndicator = ({ progress, stage }: ProgressIndicatorProps) => {
  // Animation determined by current stage
  let animation = '';
  
  switch (stage) {
    case 'Drafting Initial PRD':
      animation = 'animate-pulse-opacity';
      break;
    case 'Organizing Content':
      animation = 'animate-float';
      break;
    case 'Refining Language':
      animation = 'animate-pulse-opacity';
      break;
    case 'Finalizing Document':
      animation = 'animate-spin-slow';
      break;
    default:
      animation = '';
  }
  
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-40 h-40 mb-6">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-secondary/50"></div>
        
        {/* Progress circle */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-secondary/30"
            strokeWidth="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
          />
          <circle
            className="text-primary transition-all duration-500 ease-in-out"
            strokeWidth="8"
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            strokeDasharray={`${40 * 2 * Math.PI}`}
            strokeDashoffset={`${40 * 2 * Math.PI * (1 - progress / 100)}`}
          />
        </svg>
        
        {/* Icon in the center */}
        <div className="absolute inset-0 flex items-center justify-center">
          {progress >= 100 ? (
            <Sparkles className={`h-8 w-8 text-primary animate-scale-in`} />
          ) : (
            <RefreshCcw className={`h-8 w-8 text-primary ${animation}`} />
          )}
        </div>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center mt-20">
          <span className="text-xl font-medium">{Math.round(progress)}%</span>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-2">{stage}</h3>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        {progress < 100
          ? "Claude is carefully analyzing your inputs and crafting a comprehensive PRD tailored to your specifications."
          : "Your PRD is ready! Please proceed to the next step to review and download it."}
      </p>
    </div>
  );
};

export default ProgressIndicator;
