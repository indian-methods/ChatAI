// Existing code for sending messages
document.getElementById("send-button").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault(); // Prevent default action (new line)
    }
});

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