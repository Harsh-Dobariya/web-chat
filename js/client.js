const socket = io.connect('http://localhost:8000');

// Play audio on receiving message
const audio = new Audio("data/music/music_1.mp3");

// Play audio on sending message
const sent = new Audio("data/music/sent.mp3");

// Get DOM elements in respective Js variables
const form = document.getElementById("sender");
const messageInput = document.getElementById("messageInput");
const messageContainer = document.querySelector(".container");
const button = document.getElementById("button");
const conatiner = document.getElementById("container");

// Function which will add event into the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
  if (position == "left" || position == "center") {
    audio.play();
  } else if (position == "right") {
    sent.play();
  }
};

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
  append(`${name} joined`, 'center')
})

// If server sends a message, receive it
socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left')
})

// If a user leaves the chat, append the info to the container
socket.on('left', name => {
  append(`${name} left`, 'center')
})

// Function to check input type for showing send button
setInterval(() => {
  if (messageInput.value != "") {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
  conatiner.style.height = (window.screen.height - 195) + "px";
}, 0);

// If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message != "") {
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
  }
});
