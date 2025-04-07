import pdfParse from 'pdf-parse';
import { readFileSync } from 'fs';
import { extractRawText } from 'mammoth'; // Install via `npm install mammoth`

export async function extractTextFromFile(file) {
  if (file.mimetype === 'application/pdf') {
    const pdfData = await pdfParse(file.buffer);
    return pdfData.text;
  } else if (file.mimetype.startsWith('text/')) {
    return file.buffer.toString('utf-8');
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await extractRawText({ buffer: file.buffer });
    return result.value;
  } else {
    throw new Error('Unsupported file type');
  }
}
