
import React from 'react';
import { CheckIcon } from 'lucide-react';
import { usePRD } from '../context/PRDContext';

const steps = [
  { number: 1, title: 'Upload' },
  { number: 2, title: 'Analysis' },
  { number: 3, title: 'Generation' },
  { number: 4, title: 'Download' },
];

const StepIndicator = () => {
  const { state } = usePRD();
  const { currentStep } = state;

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Determine if the step is active, completed, or upcoming
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isUpcoming = currentStep < step.number;
          
          // Connect to the next step with a line, except for the last step
          const hasConnector = index < steps.length - 1;

          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' 
                      : isCompleted 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span 
                  className={`text-sm ${
                    isActive 
                      ? 'text-primary font-medium' 
                      : isCompleted 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              
              {hasConnector && (
                <div 
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted && steps[index + 1].number <= currentStep
                      ? 'bg-primary'
                      : 'bg-secondary'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
