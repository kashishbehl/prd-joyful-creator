
import React, { useCallback, useState } from 'react';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import { usePRD } from '../context/PRDContext';
import { useToast } from '../hooks/use-toast';

interface FileUploadProps {
  onUploadComplete: () => void;
}

const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const { state, setUploadedDocument } = usePRD();
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndUploadFile(files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };

  const validateAndUploadFile = async (file: File) => {
    // Check file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a DOCX or PDF file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      
      // In a real app, you would upload the file to the server here
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadedDocument(file);
      toast({
        title: "File uploaded",
        description: "Your document has been uploaded successfully."
      });
      onUploadComplete(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setUploadedDocument(null);
  };

  return (
    <div className="w-full">
      {!state.uploadedDocument ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all duration-300 ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-secondary/50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <UploadCloudIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Drag & Drop your file here</h3>
              <p className="text-sm text-muted-foreground mb-4">
                or click to browse (DOCX or PDF only)
              </p>
              <label className="glass-button inline-flex items-center px-4 py-2 rounded-lg cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".docx,.pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <span className="text-sm font-medium">
                  {isUploading ? 'Uploading...' : 'Select File'}
                </span>
              </label>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{state.uploadedDocument.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(state.uploadedDocument.size / 1024).toFixed(0)} KB
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <XIcon className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
