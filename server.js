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

// Configure Multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// New endpoint for image uploads
app.post('/api/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image file uploaded.' });
    }
    // Now pass the image data directly to the verification API
    // Note: Vercel needs a public URL. This is just for local testing.
    res.json({ fileData: req.file.buffer, mimetype: req.file.mimetype });
});

app.use('/api/verify-text', textRouter);
app.use('/api/verify-image', imageRouter);

// The 'uploads' folder is no longer needed
// app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});