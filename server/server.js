import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import OpenAI from 'openai';

// Load environment variables from .env file
dotenv.config();

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.status(200).send({ message: 'Hello from SajiloGPT!' });
});

// Handle OpenAI requests
app.post('/', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
            temperature: 0.7,
        });

        res.status(200).send({ bot: response.choices[0].message.content });
    } catch (error) {
        console.error('Error in OpenAI request:', error);
        res.status(500).send({ error: 'Something went wrong' });
    }
});

// Start the server
app.listen(5000, () => console.log('AI server started on http://localhost:5000'));
