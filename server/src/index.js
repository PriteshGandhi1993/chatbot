import express from 'express';
import httpServer from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import elasticClient from './elastic-client.js';
import eventHandler from './EventHandler.js';

const app = express();
const userSocket = new Map();
app.use(cors());
const http =  httpServer.createServer(app);

http.listen(3000, () => {
	console.log('listening on *:3000');
	elasticClient.checkConnection();
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
	io.emit('new connection', 'new connection');
	socket.on("join", async (userData) => {
		userSocket.set(userData.userId, socket.id);
		io.emit("new-joiner", JSON.stringify(userData));
	});
	socket.on("sendMessage", async (messageObject) => {
		let parsedObj = JSON.parse(messageObject);
		parsedObj.messageId = uuidv4();
		elasticClient.searchQuestion(parsedObj);
		await elasticClient.createQuestion(parsedObj);
		io.emit("message", JSON.stringify(parsedObj));
	});

	socket.on("sendReply", async (messageObject) => {
		let parsedObj = JSON.parse(messageObject);
		parsedObj.messageId = uuidv4();
		await elasticClient.addAnswer(parsedObj);
		io.emit("reply", JSON.stringify(parsedObj));
	});

	socket.on("upVote", async (messageObject) => {
		let resp = await elasticClient.updateVote(JSON.parse(messageObject), true);
		io.emit("addUpVote", JSON.stringify(resp.hits.hits[0]._source));
	});

	socket.on("downVote", async (messageObject) => {
		let resp = await elasticClient.updateVote(JSON.parse(messageObject), false);
		io.emit("addDownVote", JSON.stringify(resp.hits.hits[0]._source));
	});
	
	eventHandler.on('questionSearchCompleted', function(message){
		console.log("message received: ",message);
		io.emit("botAnswer", JSON.stringify(message));
	});
});
