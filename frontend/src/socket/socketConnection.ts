import { connect } from "socket.io-client";

const socketConnection = connect("http://localhost:5000",{});

export default socketConnection;