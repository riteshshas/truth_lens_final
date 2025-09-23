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
app.use(express.static(path.join(__dirname, 'public')));

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// New endpoint for image uploads
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }
    // Return the temporary file path to the frontend
    res.json({ imageUrl: `http://localhost:${PORT}/${req.file.path}` });
});

app.use('/api/verify-text', textRouter);
app.use('/api/verify-image', imageRouter);

// Serve the 'uploads' directory as a static resource
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});