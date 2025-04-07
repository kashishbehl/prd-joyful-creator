import { reviewerPrompts, workerPrompts } from '../constants.js';
import { handleClaudService } from './claudService.js';
import { updateSectionContent, updateSession } from './workflow.js';

export const handleFinalReview = async (session) => {
    const finalContent = await assemblePrd(session);

    // Get final review feedback
    const finalReview = await getFinalReviewResponse(
        finalContent,
        session.systemPrompt,
        session.scoringCriteria
    );

    if (finalReview?.error) {
        return {
            error: finalReview?.error
        };
    }


    // Update session with consolidated PRD and final review
    updateSession(session.id, {
        consolidatedPrd: finalContent?.[0]?.text,
        finalReview,
        status: 'completed'
    });

    return {
        sessionId: session.id,
        content: finalContent,
        feedback: finalReview,
        status: 'completed'
      };
}

async function getFinalReviewResponse(prdContent, systemPrompt, scoringCriteria) {
    const finalReviewPrompt = `
  Review the complete PRD document below:
  
  ${prdContent}
  
  ${scoringCriteria ? `Use the following scoring criteria: ${scoringCriteria}` : ''}
  
  Please provide an overall assessment of the PRD quality, with scores for each section and an overall score on a scale of 1-10.
  `;
  
    return handleClaudService({
        prompt: finalReviewPrompt,
        systemPrompt
    });
  }

export async function assemblePrd(session) {
    const sectionCOnsolidated = Object.entries(session.completedSections)
    .map(([sectionNumber, content]) => `Section ${sectionNumber}: ${content}`)
    .join('\n\n');

    // Create a prompt for the worker to assemble the full PRD
    const assemblePrompt = `
  Your task is to assemble the complete PRD document by collecting all sections you've created.
  
  Here are all the sections:
  ${sectionCOnsolidated}
  
  Please assemble these into a single, cohesive PRD document following Razorpay's PRD format.
  `;

  
    const prdContent = await getWorkerResponse(
      'final',
      assemblePrompt,
      session.systemPrompt,
      session.problemStatement
    );
    
    return prdContent;
  }

export const handleUpdateSection = async({
    session,
    sectionNumber,
    content,
    feedback
}) => {
    const workerPrompt = workerPrompts[sectionNumber];
    // Create a prompt for the worker to update the section based on feedback
    const updatePrompt = `
        ${workerPrompt}

        Your previously wrote this content for section ${sectionNumber}:
        ${content}

        The reviewer provided this feedback:
        ${feedback}

        Please update the section based on this feedback.
    `;

    const updatedContent = await getWorkerResponse({
        prompt: updatePrompt,
        systemPrompt: session.systemPrompt,
        section: sectionNumber,
        problemStatement: session.problemStatement,
    });

    if (updatedContent?.error) {
        return {
            error: updatedContent?.error
        }
    }

    updateSectionContent(session.id, sectionNumber, updatedContent?.[0].text);

    const updatedSections = session.sections.map(section => {
        if (section.id === sectionNumber) {
            return { ...section, status: 'completed' };
        }
        return section;
    });

    const updatedSession = updateSession(session.id, { sections: updatedSections });
  
  // Determine next action
  let nextAction, nextSectionNumber;
  
  if (sectionNumber < updatedSession.sections.length) {
    nextAction = 'write';
    nextSectionNumber = sectionNumber + 1;
  } else {
    nextAction = 'assemble_prd';
    nextSectionNumber = null;
  }

  console.log({
    sectionNumber,
    nextAction
  })
  
  return {
    sessionId: session.id,
    sectionNumber,
    content: updatedContent,
    nextAction,
    nextSectionNumber
  };

}

export const handleReviewFunction = async ({
    session,
    section,
    content
}) => {
    const reviewerPrompt = reviewerPrompts[section];
    const reviewFeedback = await getReviewerResponse({
        sectionNumber: section,
        sectionContent: content,
        prompt: reviewerPrompt,
        systemPrompt: session.systemPrompt,
        scoringCriteria: session.scoringCriteria
    });

    if (reviewFeedback?.error) {
        return {
            error: reviewFeedback?.error
        };
    }

    return {
        sessionId: session.id,
        sectionNumber: section,
        feedback: reviewFeedback,
        nextAction: 'update',
        nextSectionNumber: section
    }

}

export const handleWriteFunction = async (session, section) => {
    // const workerPrompt = `Your task is to write a detailed PRD doc for Razorpay based on this draft ${session.problemStatement}.`;
    const workerPrompt = workerPrompts[section];
    const content =  await getWorkerResponse({
        prompt: workerPrompt,
        systemPrompt: session.systemPrompt,
        section,
        problemStatement: session.problemStatement
    })

    if (content?.error) {
        return {
            error: content?.error
        };
    }

    
    // Update section status
    const sectionNumber = section + 1;
    const updatedSections = session.sections.map(section => {
        if (section.id === sectionNumber) {
            return { ...section, status: 'in_progress' };
        }
        return section;
    });
    
    updateSession(session.id, { sections: updatedSections });
    return {
        sessionId: session.id,
        sectionNumber,
        content,
        nextAction: 'review',
        nextSectionNumber: section
    };
}

const getWorkerResponse = ({
    prompt,
    systemPrompt,
    section,
    problemStatement
}) => {
    const workerprompt = `${prompt}. Please write a section ${section} for problem statement ${problemStatement}, of the PRD based on the information`;
    return handleClaudService({
        prompt: workerprompt,
        systemPrompt,
    })
    // console.log(workerprompt);
}

const getReviewerResponse = ({
    sectionNumber, sectionContent, prompt, systemPrompt, scoringCriteria
}) => {
    const reviewerPrompt = `
    ${prompt}
    
    Here is the content for section ${sectionNumber}:
    
    ${sectionContent}
    
    ${scoringCriteria ? `Use the following scoring criteria: ${scoringCriteria}` : ''}
    
    Please review this section and provide feedback along with a score on a scale of 1-10.
    `;

    return handleClaudService({
        prompt: reviewerPrompt,
        systemPrompt,
    })
}