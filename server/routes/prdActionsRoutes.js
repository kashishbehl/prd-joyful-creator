import express from 'express';
import { readPRDFiles } from '../controllers/fileController.js'; // Import your controller functions here
import { createSession, getSession } from '../services/workflow.js';

import multer from 'multer';
import { extractTextFromFile } from '../helpers/file.js';
import { handleFinalReview, handleReviewFunction, handleUpdateSection, handleWriteFunction,assemblePrd } from '../services/writer.js';
import { createDocxDocument, processContentForDocx } from '../services/download.js';
import { Packer } from 'docx';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Define your /prd-actions routes here
router.get('/process-section', (req, res) => {
  const {
    
  } = req.body; 
});

// Initiate Session - to generate system prompt from historical data

router.post('/initiate-session', upload.single('file'),  async (req, res) => {
  const prdContent = await readPRDFiles('../files');
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const response = await extractTextFromFile(file); 
  const sessionDetails = createSession({
    problemStatement: response,
    contextData: prdContent,
  })
  res.json({
    session: sessionDetails
  })
})

router.post('/write-prd', async (req, res) => {
  const { sessionId, sectionNumber, action, content, feedback } = req.body;
  console.log({
    sectionNumber,
    action
  });

  const session = getSession(sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (session.problemStatement) {
    console.log('problem statement present');
  }

  let response;

  try {

  switch(action) {
    case 'write':
      response = await handleWriteFunction(session, sectionNumber);
      break;
    case 'review':
      // Handle review action
      response = await handleReviewFunction({
        session,
        section: sectionNumber,
        content
      });
      break;
    case 'update':
      response = await handleUpdateSection({
        session,
        sectionNumber,
        content,
        feedback
      })

      break;
    
    case 'final_review':
      response = await handleFinalReview(session)
  }

  // const sectionData =  await handleWriteFunction(session, sectionNumber);
  res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error processing request' });
  }
})

router.get('/export-prd/:id', async(req, res) => {
  const { id } = req.params;
  const { assemble } = req.query;
  console.log({
    id,
    assemble
  })
  const session = getSession(id);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  if (session.status !== 'completed' && !assemble) {
    return res.status(400).json({ error: 'PRD is not yet completed' });
  }

  let consolidatedSections;

  if (assemble) {
    let response = await assemblePrd(session);
    consolidatedSections = response?.[0]?.text;
  } else {
    consolidatedSections = session.completedSections;
  }
  
  // Process the PRD content to create document structure
  const contentSections = processContentForDocx(consolidatedSections);
  
  // Create the document
  const doc = createDocxDocument(contentSections, session);
  Packer.toString(doc).then((res) => {
    console.log('string--------------')
    console.log(res);
  });
  
  // Generate buffer
  // const buffer = await doc.save();
  const buffer = await Packer.toBuffer(doc)
  console.log({
    buffer
  });
  
  // Set response headers
  res.setHeader('Content-Disposition', 'attachment; filename=Razorpay_PRD.docx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  
  // Send the document
  return res.send(buffer);
})

// Add more routes as needed
// router.post('/another-action', (req, res) => { ... });

export default router;
