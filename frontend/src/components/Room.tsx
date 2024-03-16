import Peer from "peerjs";
import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import UserVideo from "./UserVideo";
interface RoomProps {
    user: string;
    socket: Socket;
    peer: Peer;
    localStream: MediaStream;
}
function Room({user, socket, peer, localStream}: RoomProps) {
    const localRef = useRef<HTMLVideoElement>(null);
    const [remoteStreams, setRemoteStreams] = useState<Set<MediaStream>>(new Set());
    peer.on("call", call => {
        call.answer(localStream);
        call.on("stream", (remoteStream: MediaStream) => {
            console.log("RS: ", remoteStream);
            setRemoteStreams(prev => new Set([...prev, remoteStream]));
        });
    })
    function connectToNewUser(userId: string, stream: MediaStream) {
        const call = peer.call(userId, stream);
        call.on("stream", (remoteStream: MediaStream) => {
            setRemoteStreams(prev => new Set([...prev, remoteStream]));
        });
    }
    async function prepareWebRTC() {
        localRef.current!.srcObject = localStream;
        localRef.current!.play();   
        socket.on("user-connected", (userId) => {
            connectToNewUser(userId, localStream);
        })
    }
    useEffect(() => {
        prepareWebRTC();
    }, []);
    console.log(Array.from(remoteStreams));
    return (
        <div className="room">
            <h1>{user}</h1>
            <video
                ref={localRef}
                width={500}
                height={300}
                style={{backgroundColor: "black"}}
            ></video>
            {Array.from(remoteStreams).map(remoteStream => <UserVideo key={remoteStream.id} remoteStream={remoteStream} />)}
        </div>
    )
}
export default Room;