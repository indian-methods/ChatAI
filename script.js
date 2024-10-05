// Save theme settings in localStorage
function saveThemeSettings(theme) {
    localStorage.setItem("themeSettings", JSON.stringify(theme));
}

// Load theme settings from localStorage
function loadThemeSettings() {
    const theme = JSON.parse(localStorage.getItem("themeSettings"));
    if (theme) {
        document.body.style.backgroundColor = theme.bodyColor;
        document.getElementById("chat-container").style.backgroundColor = theme.chatContainerColor;
        document.body.style.color = theme.textColor;
        document.getElementById("chat-output").style.backgroundColor = theme.chatOutputColor;
        document.getElementById("user-input").style.backgroundColor = theme.questionInputColor;
    }
}

// Load text settings from localStorage
function loadTextSettings() {
    const customTitle = localStorage.getItem("customTitle");
    const customDescription = localStorage.getItem("customDescription");
    if (customTitle) {
        document.getElementById("custom-title").innerText = customTitle;
    }
    if (customDescription) {
        document.getElementById("custom-description").innerText = customDescription;
    }
}

// Default theme colors
const defaultTheme = {
    bodyColor: "#181818",
    chatContainerColor: "#282828",
    textColor: "#ffffff",
    chatOutputColor: "#333",
    questionInputColor: "#222"
};

// Load settings when the page loads
window.onload = () => {
    loadThemeSettings();
    loadTextSettings();
};

// Event listeners for sending messages
document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault(); // Prevent default action (new line)
    }
});

// Function to send a message
function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatOutput = document.getElementById("chat-output");

    if (userInput.trim() === "") return; // Ignore empty input

    // Add the user's question in a styled box
    chatOutput.innerHTML += `<div class="user-message-box">${userInput}</div>`;
    
    // Show typing indicator
    const typingIndicator = document.createElement("div");
    typingIndicator.className = "gpt-message typing"; 
    typingIndicator.innerHTML = "Typing...";
    chatOutput.appendChild(typingIndicator);
    
    // Using the provided API endpoint
    const apiUrl = `https://bj-tricks.serv00.net/BJ_Coder-Apis/gpt4o.php?question=${encodeURIComponent(userInput)}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Data received:", data);
            
            // Check if message exists in the response
            const message = data.message ? data.message : "No response available.";
            const formattedMessage = message.replace(/\n/g, '<br>').replace(/\. /g, '.<br>'); // Add line breaks
            
            // Replace typing indicator with response
            chatOutput.innerHTML = chatOutput.innerHTML.replace(typingIndicator.outerHTML, `<div class="gpt-message">${formattedMessage}</div>`); 
            document.getElementById("user-input").value = ''; // Clear input
            chatOutput.scrollTop = chatOutput.scrollHeight; // Auto scroll to bottom
        })
        .catch(error => {
            console.error('Error:', error);
            // Replace typing indicator with error message
            chatOutput.innerHTML = chatOutput.innerHTML.replace(typingIndicator.outerHTML, `<div class="gpt-message">Error occurred while fetching response.</div>`); 
        });

    // Clear the input field after sending
    document.getElementById("user-input").value = ''; 
}

// Theme switching functionality
document.getElementById("settings-icon").addEventListener("click", () => {
    const themeOptions = document.getElementById("theme-options");
    themeOptions.style.display = themeOptions.style.display === "none" ? "block" : "none";
});

document.getElementById("pink-theme").addEventListener("click", () => {
    const theme = {
        bodyColor: "#ffcccb",
        chatContainerColor: "#ffb6c1",
        textColor: "#000000",
        chatOutputColor: "#ffcccb",
        questionInputColor: "#ffb6c1"
    };
    saveThemeSettings(theme);
    loadThemeSettings();
});

document.getElementById("blue-theme").addEventListener("click", () => {
    const theme = {
        bodyColor: "#b3cde0",
        chatContainerColor: "#6497b1",
        textColor: "#000000",
        chatOutputColor: "#b3cde0",
        questionInputColor: "#6497b1"
    };
    saveThemeSettings(theme);
    loadThemeSettings();
});

document.getElementById("custom-theme").addEventListener("click", () => {
    const customOptions = document.getElementById("custom-theme-options");
    customOptions.style.display = customOptions.style.display === "none" ? "block" : "none";
});

// Apply custom theme colors
document.getElementById("apply-custom-theme").addEventListener("click", () => {
    const bodyColor = document.getElementById("background-color").value;
    const chatContainerColor = document.getElementById("chat-container-color").value;
    const textColor = document.getElementById("text-color").value;
    const chatOutputColor = document.getElementById("chat-output-color").value;
    const questionInputColor = document.getElementById("question-input-color").value;

    // Set the colors
    const theme = {
        bodyColor,
        chatContainerColor,
        textColor,
        chatOutputColor,
        questionInputColor
    };
    
    saveThemeSettings(theme);
    loadThemeSettings();
});

// Apply custom text for title and description
document.getElementById("apply-text").addEventListener("click", () => {
    const titleInput = document.getElementById("title-input").value;
    const descriptionInput = document.getElementById("description-input").value;

    if (titleInput) {
        localStorage.setItem("customTitle", titleInput);
    }
    if (descriptionInput) {
        localStorage.setItem("customDescription", descriptionInput);
    }
    loadTextSettings();
});

// Reset theme button functionality
document.getElementById("reset-theme").addEventListener("click", () => {
    localStorage.removeItem("themeSettings");
    localStorage.removeItem("customTitle");
    localStorage.removeItem("customDescription");
    loadThemeSettings();
    loadTextSettings();
});
