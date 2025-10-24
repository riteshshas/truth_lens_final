const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');

dotenv.config();

const textRouter = require('./api/verify-text');
const imageRouter = require('./api/verify-image');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Place API route handlers before the static file middleware
app.use('/api/verify-text', textRouter);

// The image verification endpoint now handles the upload directly.
// This simplifies the frontend, as it only needs to make one call.
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }
    // Return the temporary file path to the frontend
    res.json({ imageUrl: `http://localhost:${PORT}/${req.file.path}` });
});

app.use('/api/verify-image', imageRouter);

// The static file middleware should be last to act as a fallback
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});