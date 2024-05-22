import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";

let instance;
let socket;
class SocketConnection {
  constructor() {
    if (instance) {
      throw new Error("New instance cannot be created!!");
    }
    socket = io("http://localhost:3000", {
        extraHeaders: {
          "Access-Control-Allow-Origin": "*",
        },
    });
    instance = this;
  }

  send(event, data) {
    socket.emit(event, data);
  }

  getSocket() {
    return socket;
  }
}

let socketService = Object.freeze(new SocketConnection());

export default socketService;