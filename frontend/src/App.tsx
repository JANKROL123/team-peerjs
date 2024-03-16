import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home";
import Room from "./components/Room";
import socketConnection from "./socket/socketConnection";
import { useEffect, useState } from "react";
import rootService from "./services/root";
import peerConnection from "./peer/peer";
function App() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peer, _setPeer] = useState(peerConnection);
  const [socket, _setSocket] = useState(socketConnection);
  const [rooms, setRooms] = useState<string[]>([]);
  const [user, setUser] = useState<string>("");
  peer.on("open", (userId) => {
    setUser(userId);
  })
  socket.on("new-room", (rooms: string[]) => {
    setRooms(rooms);
  });
  async function fetchRooms() {
    const rooms = await rootService.getRooms();
    setRooms(rooms);
  }
  useEffect(() => {
    fetchRooms();
    navigator.mediaDevices.getUserMedia({audio: true, video: true}).then(stream => {
      setLocalStream(stream);
    });
  }, []);
  return (
    <Router>
      {localStream ? <Routes>
        <Route path="/" element={<Home user={user} socket={socket} rooms={rooms} />} />
        <Route path="/room/:roomId" element={<Room user={user} socket={socket} peer={peer} localStream={localStream} />} />
      </Routes> : null}
    </Router>
  )
}

export default App
