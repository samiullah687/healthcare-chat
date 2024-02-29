function showOptions(options, stage, delay) {
  setTimeout(() => {
    const chatBox = document.getElementById("chat-box");
    const optionsContainer = document.createElement("div");
    optionsContainer.id = "options-container";
    optionsContainer.style.display = "flex";
    optionsContainer.style.justifyContent = "center";
    optionsContainer.style.padding = "10px";
    optionsContainer.style.width = "max-content";
    optionsContainer.style.margin = "10px 0 10px 55px";
    optionsContainer.style.borderRadius = "0.5rem";
    optionsContainer.style.background = "#E5E7EB";

    // Check if there are three options and apply column direction
    if (options.length === 3) {
      optionsContainer.style.flexDirection = "column";
      optionsContainer.style.alignItems = "center";
    } else {
      optionsContainer.style.flexDirection = "row"; // Default to row if not three options
    }

    // Styling for individual option buttons
    const buttonStyle = {
      background: "#FFFFFF",
      border: "1px solid #E0E0E0",
      borderRadius: "5px",
      margin: "5px",
      padding: "10px 20px",
      cursor: "pointer",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
    };

    options.forEach((option) => {
      let optionElement;

      if (option === "0800 - 99 23232") {
        // Create an anchor element for the phone number
        optionElement = document.createElement("a");
        optionElement.href = `tel:${option.replace(/\s/g, "08009923232")}`;
        optionElement.textContent = option;
        optionElement.classList.add("option-button");
        optionElement.style.textDecoration = "none";
        // Style the link as a button
        Object.assign(optionElement.style, buttonStyle);
      } else {
        // Create a button for other options
        optionElement = document.createElement("button");
        optionElement.textContent = option;
        optionElement.classList.add("option-button");
        // Apply the button styles
        Object.assign(optionElement.style, buttonStyle);
        optionElement.onclick = () => {
          document.getElementById("options-container").remove(); // Remove options from chat
          handleResponse(option, stage);
        };
      }

      optionsContainer.appendChild(optionElement);
    });

    chatBox.appendChild(optionsContainer);
    chatBox.scrollTop = chatBox.scrollHeight; // Scroll to show the options
  }, delay);
}

// Function to handle the user's response
function handleResponse(response, stage) {
  addMessage("user", "images/user.png", response);
  switch (stage) {
    case "initial":
      if (response === "Yes") {
        addMessage(
          "bot",
          "images/avatar.webp",
          "Okay, let me ask you a couple quick questions.",
          2000
        );
        addMessage(
          "bot",
          "images/avatar.webp",
          "Do you make less than $60,000/year? Tap Yes or No.",
          3000
        );
        showOptions(["Yes", "No"], "income", 4000);
      } else {
        endChat(4000);
      }
      break;
    case "income":
      if (response === "Yes" || "No") {
        addMessage(
          "bot",
          "images/avatar.webp",
          "Are you over or under 65?",
          2000
        );
        showOptions(["Over 65", "Under 65"], "age", 4000);
      } else {
        endChat(4000);
      }
      break;
    case "age":
      if (response === "Over 65") {
        addMessage(
          "bot",
          "images/avatar.webp",
          "Do you have Medicare parts A and B?",
          2000
        );
        showOptions(["Yes", "No"], "medicare", 4000);
      } else if (response === "Under 65") {
        addMessage(
          "bot",
          "images/avatar.webp",
          "Are you on Medicaid or Medicare?",
          2000
        );
        showOptions(["Medicare", "Medicaid", "No"], "healthInsurance", 4000);
      }
      break;
    case "healthInsurance":
      if (response === "Medicare") {
        addMessage(
          "bot",
          "images/avatar.webp",
          "Do you have Medicare parts A and B?",
          2000
        );
        showOptions(["Yes", "No"], "medicare", 4000);
      } else if (response === "Medicaid") {
        addMessage("bot", "images/avatar.webp", "Great News! 🎉", 2000);
        addMessage(
          "bot",
          "images/avatar.webp",
          "Although you don't qualify for the health insurance subsidy, this new program can allow you increase your credit score quickly.",
          3000
        );
        showOptions(["Increase my credit score!"], "medicare", 4000);
      } else if (response === "No") {
        addMessage("bot", "🎉 Congratulations! 🎁", 2000);
        addMessage(
          "bot",
          "images/avatar.webp",
          "You or your family may qualify for up to a $6,400 subsidy as a Healthcare Tax Credit",
          3000
        );
        addMessage(
          "bot",
          "images/avatar.webp",
          "Tap the number button below to call now to see if you qualify, the initial call only takes a few minutes.",
          4000
        );
        showOptions(["0800 - 99 23232"], "medicare", 4000);
      }
      break;
    case "medicare":
      if (response === "Yes" || response === "No") {
        addMessage("bot", "images/avatar.webp", "Great News! 🎉", 1000);
        addMessage(
          "bot",
          "images/avatar.webp",
          "Although you aren’t qualified for a Health Subsidy, agencies are now offering Medicare Advantage coverage in your area.",
          2000
        );
        addMessage(
          "bot",
          "images/avatar.webp",
          "Call the number below to learn more about what you could qualify for:",
          3000
        );
        response === "Yes"
          ? showOptions(["0800 - 99 23232"], "medicare", 4000)
          : showOptions(["Get My Free Phone!"], "medicare", 4000);
      } else {
        endChat(4000);
      }
      break;
  }
}

let lastSender = null;

function addMessage(sender, avatar, text, delay, isInitialMessage = false) {
  if (sender === "bot" && !isInitialMessage) {
    // Add a loading message before the actual message for bot messages, except the first message
    insertLoadingMessage("images/dots-loadings.gif", delay - 1000); // Show loading gif 500ms before the message
  }

  setTimeout(() => {
    const chatBox = document.getElementById("chat-box");

    // If there's a loading gif, replace it with the actual message
    removeLoadingMessage();

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", `${sender}-container`);
    messageContainer.style.display = "flex";
    messageContainer.style.alignItems = "center";
    messageContainer.style.justifyContent = "flex-start";
    messageContainer.style.flexDirection =
      sender === "user" ? "row-reverse" : "inhit";

    // Avatar container
    const avatarDiv = document.createElement("div");
    avatarDiv.style.width = "40px";
    avatarDiv.style.height = "40px";
    avatarDiv.style.borderRadius = "50%";
    avatarDiv.style.flexShrink = "0";
    avatarDiv.style.marginRight = sender === "bot" ? "10px" : "0";
    avatarDiv.style.marginLeft = sender === "user" ? "10px" : "0";
    avatarDiv.style.background = "transparent";

    if (sender !== lastSender || isInitialMessage) {
      // Only add the avatar image if the sender changes or it's the first message
      const img = document.createElement("img");
      img.src = avatar;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      img.style.borderRadius = "50%";
      img.style.background = "transparent";
      avatarDiv.appendChild(img);
    }

    messageContainer.appendChild(avatarDiv);

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", `${sender}-message`);
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    msgDiv.appendChild(textSpan);

    messageContainer.appendChild(msgDiv);
    chatBox.appendChild(messageContainer);
    lastSender = sender;

    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, delay);
}

function insertLoadingMessage(avatar, delay) {
  setTimeout(() => {
    removeLoadingMessage();

    const chatBox = document.getElementById("chat-box");
    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading-container";
    loadingContainer.classList.add("message-container", "bot-container");
    loadingContainer.style.display = "flex";
    loadingContainer.style.alignItems = "center";
    loadingContainer.style.justifyContent = "flex-start";
    loadingContainer.style.backgroundColor = "#ffffff"; // Apply background color
    loadingContainer.style.padding = "0.75rem";
    loadingContainer.style.position = "relative"; // Needed for absolute positioning of ::after content

    const loadingMessage = document.createElement("img");
    loadingMessage.src = avatar;
    loadingMessage.id = "loading-gif";
    loadingMessage.style.width = "40px";
    loadingMessage.style.marginLeft = "40px";
    loadingMessage.style.height = "40px";

    loadingContainer.appendChild(loadingMessage);
    chatBox.appendChild(loadingContainer);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

    // Apply ::after styles through JavaScript since ::after cannot be directly used with JavaScript
    const afterElement = document.createElement("div");
    afterElement.classList.add("loadng-bg");
    afterElement.style.position = "absolute";
    afterElement.style.top = "20";
    afterElement.style.height = "38px";
    afterElement.style.width = "66px";
    afterElement.style.left = "54px";
    afterElement.style.backgroundColor = "#E5E7EB";
    afterElement.style.borderRadius = "6px";
    afterElement.style.maxBlendMode = "hard-light";
    loadingContainer.appendChild(afterElement); // Append the pseudo ::after element to the loading container
  }, delay);
}

function removeLoadingMessage() {
  const loadingContainer = document.getElementById("loading-container");
  if (loadingContainer) {
    loadingContainer.remove();
  }
}

// Usage example
document.addEventListener("DOMContentLoaded", () => {
  lastSender = null; // Reset on chat start
  startChat();
});

// Modify your startChat function calls to use the isInitialMessage flag for the first message
function startChat() {
  addMessage("bot", "images/avatar.webp", "Hi 👋", 0, true); // true to indicate it's the first message
  addMessage(
    "bot",
    "images/avatar.webp",
    "I'm Emily from Health Benefits",
    1000
  );
  addMessage(
    "bot",
    "images/avatar.webp",
    "Want to find out if you or your family qualify for up to a $6,400 subsidy as a Healthcare Tax Credit? Tap Yes if so! 😊",
    2000
  );
  showOptions(["Yes"], "initial", 3000);
}
