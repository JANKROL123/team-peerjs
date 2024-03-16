import { useEffect, useRef } from "react";

interface UserVideoProps {
    remoteStream: MediaStream;
}
function UserVideo({remoteStream}: UserVideoProps) {
    const remoteRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (remoteStream) {
            remoteRef.current!.srcObject = remoteStream;
            remoteRef.current!.play();
        }
    }, []);
    return (
        <video
            ref={remoteRef}
            width={500}
            height={300}
            style={{backgroundColor: "black"}}
        ></video>
    )
}
export default UserVideo;