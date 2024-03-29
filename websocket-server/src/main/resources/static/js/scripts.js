'use strict';

var usernamePage = document.querySelector('#username-page');
var chatPage = document.querySelector('#chat-page');
var usernameForm = document.querySelector('#usernameForm');
var messageForm = document.querySelector('#messageForm');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');

var stompClient = null; //* Será nuestro webSocket
var username = null;

var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event) {
    event.preventDefault();

    username = document.querySelector('#name').value.trim();
    if (username) {
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/web-socket');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
}

function onConnected() {
    //* Subscribirse al Topic público
    stompClient.subscribe('/topic/public', onMessageReceived);

    //* Dígale el nombre de usuario al servidor
    const payload = JSON.stringify({ sender: username, type: 'JOIN' });
    stompClient.send('/app/chat.addUser', {}, payload);

    connectingElement.classList.add('hidden');
}

function onError() {
    connectingElement.textContent = 'No se pudo conectar al servidor WebSocket. Por favor, actualiza la página e inténtalo nuevamente.';
    connectingElement.style.color = 'red';
}

function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');

    if(message.type == 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' ¡unido!';

    } else if(message.type == 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' ¡salió!';

    } else {

        messageElement.classList.add('chat-message');

        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]); //* Primera letra del remitente

        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function sendMessage(event) {
    event.preventDefault();

    var messageContent = messageInput.value.trim();
    if (messageContent && stompClient) {
        const payload = JSON.stringify({ content: messageContent, sender: username, type: 'CHAT' });
        stompClient.send('/app/chat.sendMessage', {}, payload);
        messageInput.value = '';
    }
}

function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    console.log('index: ' + index);
    return colors[index];
}

usernameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);