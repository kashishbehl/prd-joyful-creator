
import { Document, Paragraph, TextRun, HeadingLevel } from 'docx';

export function processContentForDocx(content) {
  // This is a simplified parser - in a real app, you'd need a more robust parser
  // to properly interpret the sections and format from the AI response
  
  const sections = [];
  const lines = content.split('\n');
  
  let currentSection = { title: '', content: [], level: 0 };
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('# ')) {
      // Main section header
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { 
        title: trimmedLine.substring(2), 
        content: [],
        level: 1
      };
    } else if (trimmedLine.startsWith('## ')) {
      // Sub-section header
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { 
        title: trimmedLine.substring(3), 
        content: [],
        level: 2
      };
    } else if (trimmedLine.startsWith('### ')) {
      // Sub-sub-section header
      if (currentSection.title) {
        sections.push({ ...currentSection });
      }
      currentSection = { 
        title: trimmedLine.substring(4), 
        content: [],
        level: 3
      };
    } else if (trimmedLine) {
      // Content line
      currentSection.content.push(trimmedLine);
    }
  });
  
  // Add the last section
  if (currentSection.title) {
    sections.push(currentSection);
  }
  
  return sections;
}

export function createDocxDocument(sections, session) {
  const children = [];
  
  // Add title
  children.push(
    new Paragraph({
      text: "Razorpay Product Requirement Document",
      heading: HeadingLevel.TITLE
    })
  );
  
  // Add metadata
  children.push(
    new Paragraph({
      text: `Created: ${new Date().toLocaleDateString()}`,
      spacing: {
        after: 200
      }
    })
  );
  
  // Add sections
  sections.forEach(section => {
    // Add section title
    let headingLevel;
    switch(section.level) {
      case 1: headingLevel = HeadingLevel.HEADING_1; break;
      case 2: headingLevel = HeadingLevel.HEADING_2; break;
      case 3: headingLevel = HeadingLevel.HEADING_3; break;
      default: headingLevel = HeadingLevel.HEADING_1;
    }
    
    children.push(
      new Paragraph({
        text: section.title,
        heading: headingLevel,
        spacing: {
          before: 300,
          after: 120
        }
      })
    );
    
    // Add section content
    section.content.forEach(contentLine => {
      children.push(
        new Paragraph({
          text: contentLine,
          spacing: {
            after: 100
          }
        })
      );
    });
  });
  
  // Add review scores if available
  if (session.finalReview) {
    children.push(
      new Paragraph({
        text: "PRD Review Scores",
        heading: HeadingLevel.HEADING_1,
        spacing: {
          before: 400,
          after: 120
        }
      })
    );
    
    children.push(
      new Paragraph({
        text: session.finalReview,
        spacing: {
          after: 100
        }
      })
    );
  }
  
  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });
  
  return doc;
}