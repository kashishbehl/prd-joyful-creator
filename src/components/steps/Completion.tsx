
import React from 'react';
import { FileIcon, ThumbsUpIcon, ThumbsDownIcon, PlusCircleIcon } from 'lucide-react';
import { usePRD } from '../../context/PRDContext';
import DocumentPreview from '../DocumentPreview';
import { useToast } from '../../hooks/use-toast';

interface CompletionProps {
  onReset: () => void;
}

const Completion = ({ onReset }: CompletionProps) => {
  const { toast } = useToast();
  
  const handleFeedback = (isPositive: boolean) => {
    toast({
      title: "Feedback received",
      description: `Thank you for your ${isPositive ? 'positive' : 'constructive'} feedback!`,
    });
  };
  
  return (
    <div className="step-card animate-fade-in h-[700px] flex flex-col">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
          <FileIcon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-medium mb-2">Your PRD is Ready!</h2>
        <p className="text-muted-foreground">
          Review your document and download it in DOCX format
        </p>
      </div>
      
      <div className="flex-1 mb-6">
        <DocumentPreview />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Was this helpful?</p>
          <button
            onClick={() => handleFeedback(true)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ThumbsUpIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ThumbsDownIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
          </button>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 ml-auto py-2 px-4 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
        >
          <PlusCircleIcon className="h-5 w-5" />
          <span>Start New PRD</span>
        </button>
      </div>
    </div>
  );
};

export default Completion;
