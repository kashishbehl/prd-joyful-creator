
import React from 'react';
import { PRDProvider, usePRD } from '../context/PRDContext';
import Header from '../components/Header';
import StepIndicator from '../components/StepIndicator';
import Welcome from '../components/steps/Welcome';
import Analysis from '../components/steps/Analysis';
import Generation from '../components/steps/Generation';
import Completion from '../components/steps/Completion';

const PRDApp = () => {
  const { state, setCurrentStep, resetState } = usePRD();
  
  const handleNext = () => {
    setCurrentStep(state.currentStep + 1);
  };
  
  const handleReset = () => {
    resetState();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <StepIndicator />
        
        {state.currentStep === 1 && <Welcome onNext={handleNext} />}
        {state.currentStep === 2 && <Analysis onNext={handleNext} />}
        {state.currentStep === 3 && <Generation onNext={handleNext} />}
        {state.currentStep === 4 && <Completion onReset={handleReset} />}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <PRDProvider>
      <PRDApp />
    </PRDProvider>
  );
};

export default Index;
