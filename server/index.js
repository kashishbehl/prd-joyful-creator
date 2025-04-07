import express from 'express';
import multer from 'multer';

const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Files will be stored in the 'uploads' directory

// Middleware to parse JSON (if needed for other endpoints)
app.use(express.json());

// File upload endpoint
app.post('/api/analyze-file', upload.single('file'), (req, res) => {
  try {
    console.log('File received:', req.file); // Log file details
    // Perform analysis or processing on the uploaded file
    res.status(200).json({ message: 'File uploaded successfully', file: req.file });
  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
