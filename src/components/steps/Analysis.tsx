
import React, { useEffect, useState } from 'react';
import { FileTextIcon, Loader } from 'lucide-react';
import { usePRD } from '../../context/PRDContext';
import ChatInterface from '../ChatInterface';
import { mockApi } from '../../utils/mockApi';

interface AnalysisProps {
  onNext: () => void;
}

const Analysis = ({ onNext }: AnalysisProps) => {
  const { state, setCurrentStep } = usePRD();
  const [analyzing, setAnalyzing] = useState(true);
  const [chatReady, setChatReady] = useState(false);
  
  useEffect(() => {
    const performAnalysis = async () => {
      // Only perform analysis if we have a document and persona
      if (state.uploadedDocument && state.selectedPersona) {
        try {
          setAnalyzing(true);
          const result = await mockApi.analyzeDocument(
            state.uploadedDocument,
            state.selectedPersona
          );
          // In a real app, we would store the questions in context
          // For now, they're already set in the mock API
          setAnalyzing(false);
          setChatReady(true);
        } catch (error) {
          console.error('Analysis error:', error);
          setAnalyzing(false);
        }
      }
    };
    
    performAnalysis();
  }, [state.uploadedDocument, state.selectedPersona]);
  
  const handleChatComplete = () => {
    // Wait a bit to let the user read the final message
    setTimeout(() => {
      onNext();
    }, 2000);
  };
  
  const handleBack = () => {
    setCurrentStep(1);
  };
  
  return (
    <div className="step-card animate-fade-in h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">Document Analysis</h2>
        <button
          onClick={handleBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back
        </button>
      </div>
      
      {analyzing ? (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <FileTextIcon className="h-12 w-12 text-muted-foreground" />
            <div className="absolute -right-2 -bottom-2">
              <Loader className="h-6 w-6 text-primary animate-spin" />
            </div>
          </div>
          <h3 className="text-lg font-medium">Analyzing your document</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Claude is reviewing your document to understand your requirements.
            This will just take a moment.
          </p>
        </div>
      ) : chatReady ? (
        <div className="flex-1">
          <ChatInterface onComplete={handleChatComplete} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p>Something went wrong. Please try again.</p>
        </div>
      )}
    </div>
  );
};

export default Analysis;
