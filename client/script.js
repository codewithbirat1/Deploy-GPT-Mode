import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
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

    let interval = setInterval(() => {
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
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class='wrapper ${isAi && 'ai'}'>
            <div class='chat'>
                <div class='profile'>
                    <img 
                      src='${isAi ? bot : user}' 
                      alt='${isAi ? 'bot' : 'user'}' 
                    />
                </div>
                <div class='message' id='${uniqueId}'>${value}</div>
            </div>
        </div>
        `
    );
}

// Function to send an initial greeting message
const sendInitialGreeting = () => {
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, 'What can I help with?', uniqueId);

    // Scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

// Call the initial greeting function when the page loads
sendInitialGreeting();

const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);

    // User's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    // Clear the textarea input
    form.reset();

    // Bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, ' ', uniqueId);

    // Scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Specific message div
    const messageDiv = document.getElementById(uniqueId);

    // Loader while waiting for bot's response
    loader(messageDiv);

    const response = await fetch('https://sajilo-ai.onrender.com/generate', { // Updated endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = ' ';

    if (response.ok) {
        const responseData = await response.json();
        const parsedData = responseData.bot.trim();

        typeText(messageDiv, parsedData);
    } else {
        const err = await response.text();
        messageDiv.innerHTML = 'Something went wrong';
        alert(err);
    }
};

form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});
