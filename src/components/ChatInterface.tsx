
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, EditIcon } from 'lucide-react';
import { usePRD } from '../context/PRDContext';
import { mockApi } from '../utils/mockApi';
import { Textarea } from './ui/textarea';

interface ChatInterfaceProps {
  onComplete: () => void;
}

interface ChatMessage {
  id: string;
  isUser: boolean;
  text: string;
  questionId?: string;
}

const ChatInterface = ({ onComplete }: ChatInterfaceProps) => {
  const { state, updateQuestionAnswer } = usePRD();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Initialize with a welcome message
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        isUser: false,
        text: "I'm here to help you create a comprehensive PRD. I'll ask you some questions to gather the necessary information."
      }
    ]);
    
    // Add first question after a delay
    const timer = setTimeout(() => {
      if (state.questions.length > 0) {
        const firstQuestion = state.questions[0];
        setMessages(prev => [
          ...prev,
          {
            id: `q-${firstQuestion.id}`,
            isUser: false,
            text: firstQuestion.text,
            questionId: firstQuestion.id
          }
        ]);
      } else {
        // If no questions are set in the context, add mock questions for the prototype
        const mockQuestions = [
          { id: 'mock-1', text: 'What problem does your product solve?' },
          { id: 'mock-2', text: 'Who are your target users?' },
          { id: 'mock-3', text: 'What are the key features needed?' },
          { id: 'mock-4', text: 'What is your timeline for launch?' }
        ];
        
        setMessages(prev => [
          ...prev,
          {
            id: `q-${mockQuestions[0].id}`,
            isUser: false,
            text: mockQuestions[0].text,
            questionId: mockQuestions[0].id
          }
        ]);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [state.questions]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!currentInput.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // For prototype: If no questions in context, create mock ones
    const mockQuestions = [
      { id: 'mock-1', text: 'What problem does your product solve?' },
      { id: 'mock-2', text: 'Who are your target users?' },
      { id: 'mock-3', text: 'What are the key features needed?' },
      { id: 'mock-4', text: 'What is your timeline for launch?' }
    ];
    
    const currentQuestion = state.questions.length > 0 
      ? state.questions[currentQuestionIndex] 
      : mockQuestions[currentQuestionIndex];
    
    if (isEditing) {
      // Update an existing answer
      const updatedMessages = messages.map(msg => 
        msg.id === isEditing ? { ...msg, text: currentInput } : msg
      );
      
      setMessages(updatedMessages);
      
      // Update the answer in context
      const questionId = messages.find(m => m.id === isEditing)?.questionId;
      if (questionId) {
        try {
          await mockApi.submitAnswer(questionId, currentInput);
          updateQuestionAnswer(questionId, currentInput);
        } catch (error) {
          console.log('Mock API call for editing answer');
        }
      }
      
      setIsEditing(null);
    } else {
      // Add user's answer to messages
      const userAnswer = {
        id: `a-${currentQuestion.id}`,
        isUser: true,
        text: currentInput,
        questionId: currentQuestion.id
      };
      
      setMessages(prev => [...prev, userAnswer]);
      
      // Update the answer in context
      try {
        await mockApi.submitAnswer(currentQuestion.id, currentInput);
        updateQuestionAnswer(currentQuestion.id, currentInput);
      } catch (error) {
        console.log('Mock API call for submitting answer');
      }
      
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      const totalQuestions = state.questions.length > 0 
        ? state.questions.length 
        : mockQuestions.length;
      
      if (nextIndex < totalQuestions) {
        // Add a small delay before showing the next question
        setTimeout(() => {
          const nextQuestion = state.questions.length > 0
            ? state.questions[nextIndex]
            : mockQuestions[nextIndex];
            
          setMessages(prev => [
            ...prev,
            {
              id: `q-${nextQuestion.id}`,
              isUser: false,
              text: nextQuestion.text,
              questionId: nextQuestion.id
            }
          ]);
          setCurrentQuestionIndex(nextIndex);
        }, 800);
      } else {
        // All questions answered
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: 'completion',
              isUser: false,
              text: "Thank you for providing all the information. I'll now generate your PRD based on these details."
            }
          ]);
          
          // Notify parent that all questions have been answered
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 800);
      }
    }
    
    setCurrentInput('');
    setIsSubmitting(false);
    
    // Refocus the textarea after submission
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };
  
  const handleEdit = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message && message.isUser) {
      setIsEditing(messageId);
      setCurrentInput(message.text);
      
      // Focus the textarea after setting up edit mode
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Questions & Clarifications</h3>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {currentQuestionIndex + 1} of {state.questions.length || 4} Questions
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? 'bg-primary text-primary-foreground ml-8'
                  : 'bg-secondary/50 mr-8'
              }`}
            >
              <div className="flex items-start">
                <p className="text-sm">{message.text}</p>
                {message.isUser && (
                  <button
                    onClick={() => handleEdit(message.id)}
                    className="ml-2 p-1 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Edit response"
                  >
                    <EditIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your answer here..."
          className="min-h-[100px] pr-12 resize-none"
          disabled={currentQuestionIndex >= (state.questions.length || 4) || isSubmitting}
        />
        <button
          onClick={handleSubmit}
          disabled={!currentInput.trim() || isSubmitting}
          className="absolute right-3 bottom-3 p-2 rounded-full bg-primary/90 hover:bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Use Ctrl+Enter to send your answer
      </p>
    </div>
  );
};

export default ChatInterface;

