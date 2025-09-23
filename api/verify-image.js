const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required.' });
    }

    try {
        const serpAiUrl = `https://serpapi.com/search.json?engine=google_lens&url=${encodeURIComponent(imageUrl)}&api_key=${process.env.SERPAI_API_KEY}`;
        
        const response = await axios.get(serpAiUrl);

        // The exact structure of SerpAI's response for a specific task may vary.
        // You can log the response to see what to parse.
        // For now, we'll return the full response.
        res.json({ result: response.data });
    } catch (error) {
        console.error('Error verifying image:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to verify image. Please check the API key and try again.' });
    }
});

module.exports = router;