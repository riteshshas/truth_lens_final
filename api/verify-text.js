const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).json({ error: 'Text input is required.' });
    }

    try {
        const geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
        const geminiApiKey = process.env.GEMINI_API_KEY;

        const headers = {
            'Content-Type': 'application/json',
            'X-goog-api-key': geminiApiKey
        };

        const prompt = `Analyze the following text for factual accuracy and credibility. Provide a clear, brief answer, and then assign a credibility score from 0 to 10 based on your analysis. Your response should be structured like this: 
Analysis: [Your breif analysis here.]
Credibility Score: [A number from 0 to 10.]
Text to analyze: "${text}"`;

        const response = await axios.post(geminiUrl, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        }, { headers: headers });

        const verificationResult = response.data.candidates[0].content.parts[0].text;
        res.json({ result: verificationResult });
    } catch (error) {
        console.error('Gemini API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to verify text. Please check the API key and try again.' });
    }
});

module.exports = router;