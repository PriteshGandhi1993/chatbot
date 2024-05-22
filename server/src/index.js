import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();

app.use(cors());
const http =  httpServer.createServer(app);

http.listen(3000, () => {
    console.log('listening on *:3000');
});

const io = new Server(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.get('/', (req, res) => {
    res.send('Hello World!')
});

io.on('connection', (socket) => {
    console.log('new connection');
    io.emit('new connection', 'new connection');
    socket.on("sendMessage", (messageObject) => {
        console.log("sendMessage: ", messageObject);
        //save message to db
        //check with bot
        let parsedObj = JSON.parse(messageObject);
        parsedObj.messageId = uuidv4();
        io.emit("message", JSON.stringify(parsedObj));
    });

    socket.on("sendReply", (messageObject) => {
        console.log("sendReply: ", messageObject);
        //save message to db
        //check with bot
        io.emit("reply", messageObject);
    });
});
