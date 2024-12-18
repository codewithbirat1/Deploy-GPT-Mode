import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('#form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

// Loader function to show "..." while waiting for a response
function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 400);
}

// Function to type text character by character with faster typing
function typeText(element, text) {
    let index = 0;
    function typeChar() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeChar, 30); // Reduced delay for faster typing
        }
    }
    typeChar();
}

// Function to generate a unique ID for each chat message
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexString = randomNumber.toString(16).substring(2);
    return `id-${timestamp}-${hexString}`;
}

// Function to generate the chat stripe HTML for both AI and User
function chatStripe(isAi, value, uniqueId) {
    return `
        <div class='wrapper ${isAi ? 'ai' : ''}'>
            <div class='chat'>
                <div class='profile'>
                    <img src='${isAi ? bot : user}' alt='${isAi ? 'bot' : 'user'}' />
                </div>
                <div class='message' id='${uniqueId}'>${value}</div>
            </div>
        </div>`;
}

// Function to send an initial greeting when the page loads
const sendInitialGreeting = () => {
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, 'What can I help with?', uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

sendInitialGreeting();

// Function to handle form submission and send messages to the server
async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData(form);
    const userMessage = data.get('prompt').trim();

    if (!userMessage) return;

    // Display user message in the chat container
    chatContainer.innerHTML += chatStripe(false, userMessage);

    form.reset();

    // Create a new unique ID for the bot's response and display an empty message
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    // Determine the appropriate API URL for the environment (local or production)
    const apiUrl = process.env.NODE_ENV === 'production'
        ? 'https://sajilo-ai.onrender.com/generate'  // Production URL
        : 'http://localhost:5000/generate';         // Local URL for development

    try {
        // Fetch the bot's response from the server
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userMessage }),
        });

        clearInterval(loadInterval);
        messageDiv.textContent = '';

        if (response.ok) {
            const responseData = await response.json();
            const parsedData = responseData.bot.trim();
            typeText(messageDiv, parsedData);
        } else {
            const errorData = await response.json();
            messageDiv.textContent = errorData.message || 'Something went wrong. Please try again.';
        }
    } catch (error) {
        clearInterval(loadInterval);
        messageDiv.textContent = 'Network error. Check your connection.';
    }

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Event listener to handle form submission
form.addEventListener('submit', handleSubmit);

// Event listener to handle pressing Enter to submit the form
form.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
});
