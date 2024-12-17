import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('#form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(element) {
    element.textContent = '';
    loadInterval = setInterval(() => {
        element.textContent += '.';
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexString = randomNumber.toString(16).substring(2);
    return `id-${timestamp}-${hexString}`;
}

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

const sendInitialGreeting = () => {
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, 'What can I help with?', uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

sendInitialGreeting();

async function handleSubmit(e) {
    e.preventDefault();

    const data = new FormData(form);
    const userMessage = data.get('prompt').trim();

    if (!userMessage) return;

    chatContainer.innerHTML += chatStripe(false, userMessage);

    form.reset();

    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const messageDiv = document.getElementById(uniqueId);
    loader(messageDiv);

    try {
        const response = await fetch(' https://sajilo-ai.onrender.com/generate', {
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

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
});
