import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractTextFromFile } from '../helpers/file.js';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzeFileHandler = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const response = await extractTextFromFile(file);

    res.json({ text: response });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to analyze file' });
  }
};

export const readPRDFiles = async (relativeDirectoryPath) => {
  try {
    const directoryPath = path.resolve(__dirname, relativeDirectoryPath);
    const files = await readdir(directoryPath);
    const docxFiles = files.filter(file => file.endsWith('.docx')).slice(0, 4);

    const fileContents = [];
    for (const file of docxFiles) {
      const filePath = path.join(directoryPath, file);
      const fileBuffer = fs.readFileSync(filePath); // Read file as a buffer
      const fileObject = {
        buffer: fileBuffer,
        originalname: file,
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      };
      const text = await extractTextFromFile(fileObject);
      fileContents.push({ fileName: file, content: text });
    }

    return fileContents;
  } catch (error) {
    console.error('Error reading PRD files:', error);
    throw new Error('Failed to read PRD files');
  }
};