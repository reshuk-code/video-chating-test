// static/video.js

// Ensure PeerJS library is loaded
if (typeof Peer === 'undefined') {
    console.error('PeerJS library is not loaded.');
}

var peer = new Peer();
var localStream;
var currentCall;

peer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

peer.on('call', function(incomingCall) {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(function(stream) {
            localStream = stream;
            document.getElementById('local-video').srcObject = stream;
            incomingCall.answer(stream); // Answer the call with your own video stream
            incomingCall.on('stream', function(remoteStream) {
                document.getElementById('remote-video').srcObject = remoteStream;
            });
        })
        .catch(function(err) {
            console.error('Failed to get local stream', err);
        });
});

function startCall() {
    var peerId = prompt("Enter the peer ID of the user you want to call:");
    if (peerId) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(function(stream) {
                localStream = stream;
                document.getElementById('local-video').srcObject = stream;
                var call = peer.call(peerId, stream);
                call.on('stream', function(remoteStream) {
                    document.getElementById('remote-video').srcObject = remoteStream;
                });
                call.on('close', function() {
                    document.getElementById('remote-video').srcObject = null;
                });
                currentCall = call;
            })
            .catch(function(err) {
                console.error('Failed to get local stream', err);
            });
    }
}

function endCall() {
    if (currentCall) {
        currentCall.close();
    }
    document.getElementById('local-video').srcObject = null;
    document.getElementById('remote-video').srcObject = null;
}
