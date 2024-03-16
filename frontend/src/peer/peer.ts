import Peer from "peerjs";

const peerConnection = new Peer({
    host: "/",
    port: 8000
});

export default peerConnection;