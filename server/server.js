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
            'who made you',
    'who created you',
    'who is your creator',
    'who developed you',
    'who is behind this',
    'who is responsible for this',
    'who designed you',
    'who programmed you',
    'who built you',
    'who is your developer',
    'who is the creator of this AI',
    'who invented you',
    'who coded you',
    'who is the developer behind you',
    'who developed this AI',
    'who made this AI',
    'who is responsible for creating you',
    'who worked on creating you',
    'who are the people behind this AI',
    'who contributed to your creation',
    'who is the mastermind behind you',
    'who is the team behind this AI',
    'who created this technology',
    'who designed this AI system',
    'who is responsible for building you',
    'who is the team that built you',
    'who worked on your development',
    'who programmed this system',
    'who is the architect behind you',
    'who are the developers behind this AI',
    'who are the creators of this AI',
    'who worked on the AI you are based on',
    'who made the program behind you',
    'who wrote the code for you',
    'who made the software behind this AI',
    'who is behind the AI you are based on',
    'who coded the algorithm for you',
    'who developed the platform you are on',
    'who mde you',
    'who creted you',
    'who is yuor creator',
    'who dveloped you',
    'who is bhind this',
    'who is reponsible for this',
    'who desinged you',
    'who prgrammed you',
    'who bult you',
    'who is yoru develper',
    'who is teh creator of this AI',
    'who ivented you',
    'who codded you',
    'who is teh develper behind you',
    'who develped this AI',
    'who mae this AI',
    'who is resposible for creating you',
    'who wrked on creating you',
    'who are teh peple bhind this AI',
    'who contrbuted to your creation',
    'who is teh msind behind you',
    'who is teh tem bhind this AI',
    'who crated this tehnology',
    'who dsign this AI systm',
        ];
        const isCreatorQuestion = creatorKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

        if (isCreatorQuestion) {
            return res.status(200).send({
                bot: `This AI was developed by Nexolinx, a leading IT solution company based in Lumbini, Nepal. Nexolinks specializes in state-of-the-art web development, design, and digital technology services and leverages innovation into transforming ideas into efficient and modern applications. With a strong commitment to excellence, Nexolinx enables its clients to facilitate user-centric solutions that translate into meaningful advancements of technology. Additionally, This AI has also been trained on state-of-the-art, advanced machine learning frameworks provided by Google.
               
                  **Learn more about Nexolinx**: <a href="http://www.nexolinx.com" target="_blank">www.nexolinx.com</a>`
                
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
