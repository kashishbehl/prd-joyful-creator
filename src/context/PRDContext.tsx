
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Persona = 'Business' | 'Technical' | 'Product';

export interface Question {
  id: string;
  text: string;
  answer?: string;
}

export interface PRDState {
  currentStep: number;
  projectName: string;
  selectedPersona: Persona | null;
  uploadedDocument: File | null;
  questions: Question[];
  generationProgress: number;
  generationStage: string;
  finalDocument: string | null;
  qualityScore: number | null;
}

interface PRDContextType {
  state: PRDState;
  setCurrentStep: (step: number) => void;
  setProjectName: (name: string) => void;
  setSelectedPersona: (persona: Persona) => void;
  setUploadedDocument: (document: File | null) => void;
  updateQuestionAnswer: (questionId: string, answer: string) => void;
  setGenerationProgress: (progress: number) => void;
  setGenerationStage: (stage: string) => void;
  setFinalDocument: (document: string) => void;
  setQualityScore: (score: number) => void;
  resetState: () => void;
}

const initialState: PRDState = {
  currentStep: 1,
  projectName: '',
  selectedPersona: null,
  uploadedDocument: null,
  questions: [],
  generationProgress: 0,
  generationStage: '',
  finalDocument: null,
  qualityScore: null,
};

const PRDContext = createContext<PRDContextType | undefined>(undefined);

export const PRDProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PRDState>(initialState);

  const setCurrentStep = (step: number) => {
    setState(prevState => ({ ...prevState, currentStep: step }));
  };

  const setProjectName = (name: string) => {
    setState(prevState => ({ ...prevState, projectName: name }));
  };

  const setSelectedPersona = (persona: Persona) => {
    setState(prevState => ({ ...prevState, selectedPersona: persona }));
  };

  const setUploadedDocument = (document: File | null) => {
    setState(prevState => ({ ...prevState, uploadedDocument: document }));
  };

  const updateQuestionAnswer = (questionId: string, answer: string) => {
    setState(prevState => ({
      ...prevState,
      questions: prevState.questions.map(q => 
        q.id === questionId ? { ...q, answer } : q
      ),
    }));
  };

  const setGenerationProgress = (progress: number) => {
    setState(prevState => ({ ...prevState, generationProgress: progress }));
  };

  const setGenerationStage = (stage: string) => {
    setState(prevState => ({ ...prevState, generationStage: stage }));
  };

  const setFinalDocument = (document: string) => {
    setState(prevState => ({ ...prevState, finalDocument: document }));
  };

  const setQualityScore = (score: number) => {
    setState(prevState => ({ ...prevState, qualityScore: score }));
  };

  const resetState = () => {
    setState(initialState);
  };

  return (
    <PRDContext.Provider
      value={{
        state,
        setCurrentStep,
        setProjectName,
        setSelectedPersona,
        setUploadedDocument,
        updateQuestionAnswer,
        setGenerationProgress,
        setGenerationStage,
        setFinalDocument,
        setQualityScore,
        resetState,
      }}
    >
      {children}
    </PRDContext.Provider>
  );
};

export const usePRD = () => {
  const context = useContext(PRDContext);
  if (context === undefined) {
    throw new Error('usePRD must be used within a PRDProvider');
  }
  return context;
};
