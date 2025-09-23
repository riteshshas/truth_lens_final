const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text input is required.' });
    }

    try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const prompt = `Analyze the following text and determine if it appears to be genuine or AI-generated. Provide a brief explanation. Text: "${text}"`;
        
        const response = await axios.post(geminiUrl, {
            contents: [{ parts: [{ text: prompt }] }]
        });
        
        const verificationResult = response.data.candidates[0].content.parts[0].text;
        res.json({ result: verificationResult });
    } catch (error) {
        console.error('Error verifying text:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to verify text. Please check the API key and try again.' });
    }
});

module.exports = router;