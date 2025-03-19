
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FileTextIcon, DownloadIcon, Star } from 'lucide-react';
import { usePRD } from '../context/PRDContext';
import { mockApi } from '../utils/mockApi';
import { useToast } from '../hooks/use-toast';

const DocumentPreview = () => {
  const { state } = usePRD();
  const { toast } = useToast();
  const [downloading, setDownloading] = React.useState(false);
  
  const handleDownload = async () => {
    setDownloading(true);
    try {
      await mockApi.downloadDOCX();
      toast({
        title: "Document downloaded",
        description: "Your PRD has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading your PRD. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDownloading(false);
    }
  };
  
  if (!state.finalDocument) {
    return <div>Loading document...</div>;
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileTextIcon className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-medium">{state.projectName || 'Product Requirements Document'}</h3>
        </div>
        
        {state.qualityScore && (
          <div className="flex items-center space-x-1 px-3 py-1 rounded-full bg-primary/10 text-primary">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{state.qualityScore}/100</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto mb-6 glass-card p-6 rounded-lg shadow-sm">
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{state.finalDocument}</ReactMarkdown>
        </div>
      </div>
      
      <button
        onClick={handleDownload}
        className="glass-button w-full rounded-lg py-3 flex items-center justify-center space-x-2"
        disabled={downloading}
      >
        <DownloadIcon className="h-5 w-5" />
        <span>{downloading ? "Downloading..." : "Download DOCX"}</span>
      </button>
    </div>
  );
};

export default DocumentPreview;
