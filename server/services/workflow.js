// services/sessionService.js
import { v4 as uuidv4} from 'uuid';

const sessions = new Map();

export function createSession({problemStatement, contextData, scoringCriteria}) {
  const sessionId = uuidv4();
  
  sessions.set(sessionId, {
    id: sessionId,
    systemPrompt: generateSystemPrompt(contextData, problemStatement),
    problemStatement,
    scoringCriteria,
    currentSection: 1,
    status: 'in_progress',
    sections: initializeSections(),
    completedSections: {},
    consolidatedPrd: null,
    overallScore: null,
    createdAt: new Date(),
    lastUpdated: new Date()
  });
  
  return sessionId;
}

export function getSession(sessionId) {
  return sessions.get(sessionId);
}

export function updateSession(sessionId, updates) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');
  
  Object.assign(session, updates, { lastUpdated: new Date() });
  return session;
}

export function updateSectionContent(sessionId, sectionNumber, content) {
  const session = sessions.get(sessionId);
  if (!session) throw new Error('Session not found');
  
  session.completedSections[sectionNumber] = content;
  console.log(session);
  session.lastUpdated = new Date();
  return session;
}

function initializeSections() {
  return[{
    id: 1,
    name: "Describe the problem in detail",
    status: "pending"
  }, {
    id: 2,
    name: "Who are we solving the problem for?",
    status: "pending"
  }, {
    id: 3,
    name: "How many such customers exist?",
    status: "pending"
  }, {
    id: 4,
    name: "Any quantification of the problem?",
    status: "pending"
  }, {
    id: 5,
    name: "Is this solved by any of our competitors?",
    status: "pending"
  }, {
    id: 6,
    name: "Our proposed solution and the various phases/ milestones involved",
    status: "pending"
  }, {
    id: 7,
    name: "How will we drive adoption?",
    status: "pending"
  }, {
    id: 8,
    name: "How will we extend this launch (in the future)",
    status: "pending"
  }, {
    id: 9,
    name: "What will success look like for this project?",
    status: "pending"
  }, {
    id: 10,
    name: "Which OKR will this influence if outcomes are achieved?",
    status: "pending"
  }, {
    id: 11,
    name: "How would we know if the solution is working?",
    status: "pending"
  }];
}

function generateSystemPrompt(contextData, problemStatement) {
  // Process all the uploaded documents to create a comprehensive system prompt
  let systemPrompt = `You are an expert in creating Product Requirement Documents (PRDs) for Razorpay. 
  Your task is to assist in writing high-quality PRDs following Razorpay's format and standards.
  Consider the context universe for writing the PRD as the PM Input that has been added. The historical PRDs provided should help you with the writing style, clarity and the way of curating the PRD.
  Consider this problem statement ${problemStatement} as the input for writing the PRD.
  
  Historical context about Razorpay's PRD process and expectations:
  `;
  
  // Add context from the uploaded files
  contextData.forEach(doc => {
    systemPrompt += `\n\n${doc.title}:\n${doc.content}`;
  });
  
  return systemPrompt;
}