
import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, EditIcon } from 'lucide-react';
import { usePRD } from '../context/PRDContext';
import { mockApi } from '../utils/mockApi';

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
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [state.questions]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
  };
  
  const handleSubmit = async () => {
    if (!currentInput.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    const currentQuestion = state.questions[currentQuestionIndex];
    
    if (isEditing) {
      // Update an existing answer
      const updatedMessages = messages.map(msg => 
        msg.id === isEditing ? { ...msg, text: currentInput } : msg
      );
      
      setMessages(updatedMessages);
      
      // Update the answer in context
      const questionId = messages.find(m => m.id === isEditing)?.questionId;
      if (questionId) {
        await mockApi.submitAnswer(questionId, currentInput);
        updateQuestionAnswer(questionId, currentInput);
      }
      
      setIsEditing(null);
    } else {
      // Add user's answer to messages
      setMessages(prev => [
        ...prev,
        {
          id: `a-${currentQuestion.id}`,
          isUser: true,
          text: currentInput,
          questionId: currentQuestion.id
        }
      ]);
      
      // Update the answer in context
      await mockApi.submitAnswer(currentQuestion.id, currentInput);
      updateQuestionAnswer(currentQuestion.id, currentInput);
      
      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < state.questions.length) {
        // Add a small delay before showing the next question
        setTimeout(() => {
          const nextQuestion = state.questions[nextIndex];
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
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Questions & Clarifications</h3>
        <div className="badge badge-blue">
          {currentQuestionIndex + 1} of {state.questions.length} Questions
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
                  : 'glass-card mr-8'
              }`}
            >
              <div className="flex items-start">
                <p className="text-sm">{message.text}</p>
                {message.isUser && (
                  <button
                    onClick={() => handleEdit(message.id)}
                    className="ml-2 p-1 opacity-70 hover:opacity-100 transition-opacity"
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
        <textarea
          value={currentInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your answer here..."
          className="input-field w-full min-h-[100px] pr-12 resize-none"
          disabled={currentQuestionIndex >= state.questions.length || isSubmitting}
        />
        <button
          onClick={handleSubmit}
          disabled={currentQuestionIndex >= state.questions.length || !currentInput.trim() || isSubmitting}
          className="absolute right-3 bottom-3 p-2 rounded-full bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
