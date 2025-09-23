const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    // This is a temporary solution for a local file.
    // Vercel needs a public URL. This endpoint should take the file data directly from the server.
    const { fileData } = req.body;
    if (!fileData) {
        return res.status(400).json({ error: 'File data is required.' });
    }

    try {
        // You would typically upload this file to a cloud service to get a public URL
        // However, for this project, let's assume we get a valid URL from the frontend.
        // We will modify the frontend to send a public URL instead of a file.

        const serpAiUrl = `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(fileData)}&api_key=${process.env.SERPAI_API_KEY}`;

        const response = await axios.get(serpAiUrl);

        res.json({ result: response.data });
    } catch (error) {
        console.error('Error verifying image:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to verify image. Please check the API key and try again.' });
    }
});

module.exports = router;