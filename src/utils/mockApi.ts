
import { Question, Persona } from '../context/PRDContext';

// Simulated delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock questions based on persona
const getQuestionsByPersona = (persona: Persona): Question[] => {
  const commonQuestions = [
    { id: '1', text: 'What problem does this product solve?' },
    { id: '2', text: 'Who are the target users of this product?' },
    { id: '3', text: 'What are the key success metrics for this product?' },
  ];

  const personaSpecificQuestions: Record<Persona, Question[]> = {
    Business: [
      { id: 'b1', text: 'What is the business model for this product?' },
      { id: 'b2', text: 'What is the expected ROI within the first year?' },
      { id: 'b3', text: 'Who are the main competitors in this space?' },
    ],
    Technical: [
      { id: 't1', text: 'What are the technical constraints for this product?' },
      { id: 't2', text: 'Are there specific performance requirements?' },
      { id: 't3', text: 'What technologies should be considered for implementation?' },
    ],
    Product: [
      { id: 'p1', text: 'What are the must-have features for the MVP?' },
      { id: 'p2', text: 'What is the expected timeline for development?' },
      { id: 'p3', text: 'How does this product align with our product strategy?' },
    ],
  };

  return [...commonQuestions, ...personaSpecificQuestions[persona]];
};

// Mock API functions
export const mockApi = {
  // Step 1: Upload document
  uploadDocument: async (file: File) => {
    await delay(2000); // Simulate network delay
    return { success: true, message: 'Document uploaded successfully' };
  },

  // Step 1: Download template
  downloadTemplate: async () => {
    await delay(1000);
    // In a real app, this would trigger a file download
    return { success: true, message: 'Template downloaded' };
  },

  // Step 2: Analyze document
  analyzeDocument: async (file: File, persona: Persona) => {
    await delay(3000);
    // Return mock questions based on persona
    return { success: true, questions: getQuestionsByPersona(persona) };
  },

  // Step 2: Submit answer
  submitAnswer: async (questionId: string, answer: string) => {
    await delay(500);
    return { success: true, message: 'Answer submitted' };
  },

  // Step 3: Generate PRD
  generatePRD: async (projectName: string, answers: Record<string, string>) => {
    // This would trigger a long-running process
    return { success: true, jobId: 'prd-gen-123' };
  },

  // Step 3: Check generation status
  checkGenerationStatus: async (jobId: string) => {
    await delay(1000);
    // Randomly progress between 5-15% each check
    const progressIncrement = Math.floor(Math.random() * 10) + 5;
    
    // Return different stages based on progress
    let stage = 'Drafting Initial PRD';
    if (progressIncrement > 30) stage = 'Organizing Content';
    if (progressIncrement > 60) stage = 'Refining Language';
    if (progressIncrement > 90) stage = 'Finalizing Document';
    
    return { 
      success: true, 
      progress: progressIncrement, 
      stage,
      isComplete: progressIncrement >= 100
    };
  },

  // Step 4: Get final PRD
  getFinalPRD: async () => {
    await delay(1500);
    return { 
      success: true, 
      document: `# Product Requirements Document
      
## Executive Summary
This document outlines the requirements for our new product initiative. The product aims to solve [problem] for [target users] by providing [key value proposition].

## Problem Statement
[Detailed problem description based on user inputs]

## User Segmentation
[User segments and personas derived from questions]

## Product Features
[Feature list and priorities based on user input]

## Success Metrics
[KPIs and success metrics specified during Q&A]

## Timeline & Milestones
[Project timeline with key delivery milestones]
      `,
      qualityScore: 92
    };
  },

  // Step 4: Download DOCX
  downloadDOCX: async () => {
    await delay(1000);
    // In a real app, this would trigger a file download
    return { success: true, message: 'DOCX downloaded' };
  },
};
