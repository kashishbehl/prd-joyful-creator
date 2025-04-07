import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { analyzeFileHandler } from './controllers/fileController.js'; // Import the route handler
import prdActionsRoutes from './routes/prdActionsRoutes.js'; // Import the /prd-actions routes


const app = express();

app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

const port = 3000; // Use the same port for both BE and FE

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON requests
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'dist'))); // Adjust 'dist' to your frontend build folder

// Example API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

// Catch-all route to serve the frontend for unknown routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Adjust 'dist' to your frontend build folder
// });

app.post('/analyze-file', upload.single('file'), analyzeFileHandler);

// All routes for prd actions
app.use('/prd', prdActionsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
