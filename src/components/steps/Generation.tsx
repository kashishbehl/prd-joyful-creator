
import React, { useEffect, useState } from 'react';
import { usePRD } from '../../context/PRDContext';
import ProgressIndicator from '../ProgressIndicator';
import { mockApi } from '../../utils/mockApi';

interface GenerationProps {
  onNext: () => void;
}

const Generation = ({ onNext }: GenerationProps) => {
  const { state, setGenerationProgress, setGenerationStage, setFinalDocument, setQualityScore } = usePRD();
  const [jobId, setJobId] = useState<string | null>(null);
  
  // Start the generation process
  useEffect(() => {
    const startGeneration = async () => {
      try {
        // Prepare answers object
        const answers: Record<string, string> = {};
        state.questions.forEach(q => {
          if (q.answer) {
            answers[q.id] = q.answer;
          }
        });
        
        // Start generation
        const result = await mockApi.generatePRD(state.projectName, answers);
        setJobId(result.jobId);
      } catch (error) {
        console.error('Generation error:', error);
      }
    };
    
    startGeneration();
  }, []);
  
  // Poll for status updates
  useEffect(() => {
    if (!jobId) return;
    
    const poll = setInterval(async () => {
      try {
        const status = await mockApi.checkGenerationStatus(jobId);
        setGenerationProgress(status.progress);
        setGenerationStage(status.stage);
        
        if (status.isComplete) {
          clearInterval(poll);
          
          // Fetch the final document
          const result = await mockApi.getFinalPRD();
          setFinalDocument(result.document);
          setQualityScore(result.qualityScore);
          
          // Wait a bit to show 100% completion before moving on
          setTimeout(() => {
            onNext();
          }, 1500);
        }
      } catch (error) {
        console.error('Status check error:', error);
        clearInterval(poll);
      }
    }, 1500);
    
    return () => clearInterval(poll);
  }, [jobId]);
  
  return (
    <div className="step-card animate-fade-in py-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-2">Generating Your PRD</h2>
        <p className="text-muted-foreground">
          Your answers are being used to create a comprehensive document
        </p>
      </div>
      
      <ProgressIndicator 
        progress={state.generationProgress} 
        stage={state.generationStage || 'Initializing'} 
      />
    </div>
  );
};

export default Generation;
