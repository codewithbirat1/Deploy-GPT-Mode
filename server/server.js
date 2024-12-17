import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Ensure node-fetch is installed

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => res.status(200).send({ message: 'Hello from GyanAI!' }));

// Handle Gemini requests with creator information check
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

        // Detect if prompt is asking about creators using regex
        const creatorRegex = /\b(who (made|created|developed|built|invented|designed|programmed|coded|wrote|engineered|crafted|assembled|conceived) you|your (creator|developer|team|architect|designer|engineer|author|inventor|develop))\b/i;

        const isCreatorQuestion = creatorRegex.test(prompt);

        if (isCreatorQuestion) {
            return res.status(200).send({
                bot: `This AI was developed by Nexolinx for educational purpose for GyanJyoti, a leading IT solution company based in Lumbini, Nepal. Nexolinx specializes in state-of-the-art web development, design, and digital technology services. With a strong commitment to excellence, Nexolinx creates user-centric solutions for modern applications. 

Learn more about Nexolinx: [www.nexolinx.com](http://www.nexolinx.com)`
            });
        }

        // Regular API request for other prompts
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('GEMINI_API_KEY is not set in the environment variables');

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(`API Error: ${error.message || 'Unknown error'}`);
        }

        const data = await response.json();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response available';

        res.status(200).send({ bot: reply });
    } catch (error) {
        console.error('Error in /generate:', error.message);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`AI server started on http://localhost:${PORT}`));
