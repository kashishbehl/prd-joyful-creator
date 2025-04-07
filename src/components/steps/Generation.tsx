
import React, { useEffect, useState } from 'react';
import { usePRD } from '../../context/PRDContext';
import ProgressIndicator from '../ProgressIndicator';
import { mockApi } from '../../utils/mockApi';
import { fetchWrapper } from '@/utils/fetchWrapper';

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

    handleGeneratePrd();
    
  }, []);
 
  const handleGeneratePrd = async() => {
    if (state.session_id) {
      const res = await fetchWrapper(`/prd/export-prd/${state.session_id}?assemble=true`);
      console.log(res);
      if (!res.ok) {
        throw new Error('Failed to download the file');
      }
      const blob = await res.blob();
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Razorpay_PRD.docx'; // Ensure the filename matches the backend
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  }
  
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
      </div>
    </div>
  );
};

export default Generation;
