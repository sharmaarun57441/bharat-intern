const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');

let localStream;
let remoteStream;
let peerConnection;

startButton.addEventListener('click', startCall);
stopButton.addEventListener('click', endCall);

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;

    peerConnection = new RTCPeerConnection();

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.ontrack = (event) => {
        remoteStream = event.streams[0];
        remoteVideo.srcObject = remoteStream;
    };


    chatInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            const message = chatInput.value.trim();
            if (message !== '') {
                sendMessage(message);
                chatInput.value = '';
            }
        }
    });

    startButton.disabled = true;
    stopButton.disabled = false;
}

function endCall() {
    if (peerConnection) {
        peerConnection.close();
    }
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    chatInput.disabled = true;
    startButton.disabled = false;
    stopButton.disabled = true;
}

function sendMessage(message) {
    const chatMessage = document.createElement('div');
    chatMessage.textContent = `You: ${message}`;
    chatMessages.appendChild(chatMessage);
}