
import React, { useState } from 'react';
import { FileTextIcon, DownloadIcon } from 'lucide-react';
import { usePRD } from '../../context/PRDContext';
import FileUpload from '../FileUpload';
import { mockApi } from '../../utils/mockApi';
import { useToast } from '../../hooks/use-toast';

interface WelcomeProps {
  onNext: () => void;
}

const Welcome = ({ onNext }: WelcomeProps) => {
  const { state, setProjectName, setSelectedPersona } = usePRD();
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownloadTemplate = async () => {
    setIsDownloading(true);
    try {
      await mockApi.downloadTemplate();
      toast({
        title: "Template downloaded",
        description: "The PRD template has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the template. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  const canProceed = 
    state.projectName.trim() !== '' && 
    state.selectedPersona !== null && 
    state.uploadedDocument !== null;
  
  return (
    <div className="step-card animate-scale-in">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium mb-2">Welcome to PRD Generator</h2>
        <p className="text-muted-foreground">
          Create comprehensive product requirement documents with AI assistance
        </p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Name
          </label>
          <input
            type="text"
            value={state.projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter your project name"
            className="input-field w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Persona
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {['Business', 'Technical', 'Product'].map((persona) => (
              <button
                key={persona}
                onClick={() => setSelectedPersona(persona as any)}
                className={`p-4 rounded-lg border ${
                  state.selectedPersona === persona
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50 hover:bg-secondary/50'
                } transition-all duration-200`}
              >
                <span className="font-medium">{persona}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">
              Upload Document
            </label>
            <button
              onClick={handleDownloadTemplate}
              disabled={isDownloading}
              className="flex items-center space-x-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <DownloadIcon className="h-4 w-4" />
              <span>{isDownloading ? 'Downloading...' : 'Download Template'}</span>
            </button>
          </div>
          
          <FileUpload onUploadComplete={() => {}} />
        </div>
        
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-3 px-4 rounded-lg text-center font-medium transition-all duration-300 ${
            canProceed
              ? 'glass-button'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Continue to Analysis
        </button>
      </div>
    </div>
  );
};

export default Welcome;
