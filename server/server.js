import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Ensure node-fetch is installed

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => res.status(200).send({ message: 'Hello from SajiloGPT!' }));

// Handle Gemini requests with creator information check
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

        // Detect if prompt is asking about creators
        const creatorKeywords = [
            'who made you', 'who created', 'creator', 'developer', 'your creator', 
            'who developed', 'who is behind this', 'who is responsible for this'
        ];
        const isCreatorQuestion = creatorKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

        if (isCreatorQuestion) {
            return res.status(200).send({
                bot: `This AI was developed by Nexolinx, an IT solutions company based in Lumbini, Nepal. Nexolinx specializes in top-notch web development, design, and digital technology services, transforming ideas into efficient, modern applications. With a commitment to innovation and quality, Nexolinx empowers clients with user-centered solutions that meaningfully advance technology.
        
        Visit Nexolinx: [www.nexolinx.com](http://www.nexolinx.com)`
            });
        }
        

        // Regular API request for other prompts
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "contents": [{ "parts": [{ "text": prompt }] }] })
        });

        if (!response.ok) throw new Error('Failed to fetch response from API');

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response available';

        res.status(200).send({ bot: reply });
    } catch (error) {
        console.error('Error in Gemini request:', error.message);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start server
app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
