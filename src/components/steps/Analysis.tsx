
import React, { useEffect, useState } from 'react';
import { FileTextIcon, Loader } from 'lucide-react';
import { usePRD } from '../../context/PRDContext';
import ChatInterface from '../ChatInterface';
import { mockApi } from '../../utils/mockApi';
import { fetchWrapper } from '@/utils/fetchWrapper';

interface AnalysisProps {
  onNext: () => void;
}

const Analysis = ({ onNext }: AnalysisProps) => {
  const { state, setCurrentStep } = usePRD();
  const [analyzing, setAnalyzing] = useState(true);
  const [chatReady, setChatReady] = useState(false);
  const [section, setSection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('');
  const [currentFeedback, setFeedback] = useState('');
  const [currentAction, setCurrentAction] = useState('write');
  const [isError, setIsError] = useState(false);
  
  useEffect(() => {
    // Simulate document analysis with a brief delay for the prototype
    const analysisTimer = setTimeout(() => {
      setAnalyzing(false);
      setChatReady(true);
    }, 3000);
    
    return () => clearTimeout(analysisTimer);
  }, []);

  useEffect(() => {
    generatePRD();
  }, [currentAction]);

  const getSectionName = (sectionNumber) => {
    const sectionNames = [
      "How will we announce this offering to the world?",
      "What problem are we solving",
      "Is there any alternate solution to this problem?",
      'Is this solved by any of our competitors?',
      'How will we solve this problem?',
      'How will we measure impact?',
      'Are any approvals needed and do we have those?',
      'Other Solutions Evaluated',
      'Are we making any assumptions?',
    ];
    
    return sectionNames[sectionNumber] || `Section ${sectionNumber}`;
  };

  const handleFinalReview = async () => {
    setIsLoading(true);
    const res = await fetchWrapper('/prd/write-prd', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: state.session_id,
        action: 'final-review',
      })
    })

    const { error } = res;

    if (error) {
      setIsError(true);
    }

    onNext();
  }

  const generatePRD = async () => {
    setIsLoading(true);
    console.log({
      sessionId: state.session_id,
      sectionNumber: section,
      action: currentAction,
    })
    const res = await fetchWrapper('/prd/write-prd', {
      method: 'POST',
      body: JSON.stringify({
        sessionId: state.session_id,
        sectionNumber: section,
        action: currentAction,
        content: currentSection,
        feedback: currentFeedback,
      })
    })

    const { content, feedback, nextSectionNumber, nextAction, error } = res;

    if (error) {
      setIsError(true);
    }

    if (nextAction === 'assemble_prd') {
      handleFinalReview();
      return;
    }

    if (content) {
      setCurrentSection(content[0]?.text);
    }

    if (feedback) {
      setFeedback(feedback[0]?.text);
    }

    if (nextSectionNumber) {
      setSection(nextSectionNumber);
    }

    // Lets not automatically change the action once the user has seen the feedback
    if (nextSectionNumber === section) {
      setTimeout(() => {
        setCurrentAction(nextAction);
      }, 5000)
    }
    setIsLoading(false);
  }
  
  const handleChatComplete = () => {
    // Wait a bit to let the user read the final message
    setTimeout(() => {
      onNext();
    }, 2000);
  };
  
  const handleBack = () => {
    setCurrentStep(1);
  };

  const handleReview = () => {
    setCurrentAction('review');
  }

  const renderCurrentStep = () => {
    switch(currentAction) {
      case 'write':
        return (
          <>
            <p>AI is creating content for: {getSectionName(section)}</p>
            {
              isLoading ? (
                <p>Writing content</p>
              ) : <div>
                    <div  className='h-full max-h-[500px] overflow-y-scroll'>
                        <pre>
                          {currentSection}
                        </pre>
                    </div>
                <button onClick={() => {
                  handleReview();
                }} className='w-full py-3 px-4 mt-4 rounded-lg text-center font-medium transition-all duration-300 glass-button'>Submit for review</button>
              </div>
            }
          </>
        )

        case 'review':
         return (
            <>
            <p>AI is reviewing Section: {getSectionName(section)}</p>
              {
                isLoading ? (
                  <p>Reviewing content...</p>
                ) : <div>
                      <div className='h-full max-h-[500px] overflow-y-scroll'>
                          <pre>
                            {currentFeedback}
                          </pre>
                      </div>
                  <button onClick={() => {
                    // handleReview();
                    setCurrentAction('update');
                  }} className='w-full py-3 mt-4 px-4 rounded-lg text-center font-medium transition-all duration-300 glass-button'>
                    Implement Feedback
                  </button>
                </div>
              }
            </>
          )

          case 'update':
            return (
              <>
                <p>AI is updating: {getSectionName(section)}</p>
                {
                isLoading ? (
                  <p>Updating content...</p>
                ) : <div>
                      <p>Updated Content</p>
                      <div className='h-full max-h-[500px] overflow-y-scroll'>
                          <pre>
                            {currentSection}
                          </pre>
                      </div>
                  <button onClick={() => {
                    // handleReview();
                    setTimeout(() => {
                      setCurrentAction('write');
                    }, 4000);
                  }} className='w-full py-3 mt-4 px-4 rounded-lg text-center font-medium transition-all duration-300 glass-button'>
                    Continue to next section
                  </button>
                </div>
              }
              </>
            )
    }
  }
  
  return (
    <div className="step-card animate-fade-in h-[700px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium">Document Analysis - {state.session_id}</h2>
      </div>
      {isError ? (
        <div>
          <p>Token Limit Exceeded</p>
          <button
            className='w-full py-3 mt-4 px-4 rounded-lg text-center font-medium transition-all duration-300 glass-button'
            onClick={() => {
              setIsError(false);
              setIsLoading(true);
              setTimeout(() => {
                generatePRD();
              }, 5000)
            }}
          >Resume generation from current section</button>
          {section > 0 &&
          <button
          className='w-full py-3 mt-4 px-4 rounded-lg text-center font-medium transition-all duration-300 glass-button'
          onClick={() => {
            onNext();
          }}
          >Generate PRD (till now)</button>
        }
        </div>
      ) : (
        <>
          {renderCurrentStep()}
        </>
      )}
    </div>
  );
};

export default Analysis;
