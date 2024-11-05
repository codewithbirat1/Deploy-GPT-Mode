import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import fetch from 'node-fetch'; // Make sure to install node-fetch if you haven't

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello from SajiloGPT!' });
});

// Handle Gemini requests with creator information check
app.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

        // Keywords to detect if the question is about the creator
        const creatorKeywords = [
            'who made you',
            'who made this',
            'who created',
            'creator',
            'developer',
            'your creator',
            'who developed',
            'who invented',
            'who are the creators',
            'who are the developers',
            'who designed you',
            'who designed this',
            'who is behind this',
            'who is behind you',
            'who is your creator',
            'who built you',
            'who built this',
            'who contributed to this',
            'who is responsible for this',
            'who are the people behind this',
            'who worked on you',
            'who are your developers',
            'what is your origin',
            'how were you made',
            'what are your creators\' names',
            'can you tell me about your creators',
            'who created you',
            'who programmed you',
            'who coded you',
            'what team made this',
            'who is your team',
            'what are the names of your developers'
        ];
        
        const isCreatorQuestion = creatorKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

        if (isCreatorQuestion) {
            return res.status(200).send({
                bot: `This GPT was created by Birat Pandey, Sahil Khan, and Aadarsh Banjade from Lumbini, Nepal. 
                All three are studying in grade 10 at Kalika Manavgyan Secondary School.

                **Birat Pandey**
                - Position: Co-Founder of Nexolinx | Web Developer
                - Role: Developer and Designer
                - Skills: Web development, crucial role in creating and maintaining web applications.

                **Sahil Khan**
                - Position: Web Developing Manager
                - Role: Web Development
                - Skills: 2+ years of experience in web design and development, actively managing web projects at Nexolinx.

                **Aadarsh Banjade**
                - Position: GFX Manager
                - Role: Developer and Designer
                - Skills: Specializes in graphics design, contributing to the visual aspects of projects at Nexolinx.`
            });
        }

        // Regular API request for other prompts
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "contents": [
                    { "parts": [{ "text": prompt }] }
                ]
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(500).send({ error: data.error || 'Something went wrong' });
        }

        res.status(200).send({ bot: data.candidates[0].content.parts[0].text });
    } catch (error) {
        console.error('Error in Gemini request:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
