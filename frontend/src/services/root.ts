import axios from "axios";
class RootService {
    private url = "http://localhost:5000";
    async getRooms() {
        const rooms = await axios.get(`${this.url}/rooms`);
        return rooms.data;
    }
}
export default new RootService();