import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import { v4 } from "uuid";
interface HomeProps {
    user: string;
    socket: Socket;
    rooms: string[];
}
function Home({user, socket, rooms}: HomeProps) {
    const navigate = useNavigate();
    function createRoom() {
        const roomId = v4();
        socket.emit("new-room", roomId);
        socket.emit("join-room", roomId, user);
        navigate(`/room/${roomId}`);
    }
    function joinRoom(roomId: string) {
        socket.emit("join-room", roomId, user);
        navigate(`/room/${roomId}`);
    }
    return (
        <div className="home">
            <h1>{user}</h1>
            <div><button onClick={() => createRoom()}>Create room</button></div>
            <h3>Available rooms: </h3>
            <ul>
                {rooms.map(room => <li key={room}>
                    {room}
                    <button onClick={() => joinRoom(room)}>Join</button>
                </li>)}
            </ul>
        </div>
    )
}
export default Home;