import elasticSearch, { events } from "@elastic/elasticsearch";
import config from "config";
const elasticConfig = config.get("elastic");
import { HfInference } from "@huggingface/inference";
import eventHandler from "./EventHandler.js";
import { v4 as uuidv4 } from "uuid";

const HF_TOKEN = "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";

const inference = new HfInference(HF_TOKEN);

let client;

class ElasticClient {
	constructor() {
		client = new elasticSearch.Client({
			cloud: {
				id: elasticConfig.cloudID,
			},
			auth: {
				username: elasticConfig.username,
				password: elasticConfig.password,
			},
		});
	}

	async checkConnection() {
		client
			.info()
			.then((response) => console.log(response))
			.catch((error) => console.error(error));
	}

	async createIndices() {
		if (!(await client.indices.exists({ index: "question" }))) {
			await client.indices.create({
				index: "question",
			});
			await client.indices.putMapping({
				index: "question",
				body: {
					properties: {
						question: { type: "text" },
						messageId: { type: "text" },
						question_vector: {
							type: "dense_vector",
						},
					},
				},
			});
		}
		if (await client.indices.exists({ index: "answer" })) {
			await client.indices.create({
				index: "answer",
			});
			client.indices.putMapping({
				index: "answer",
				body: {
					properties: {
						questionId: { type: "text" },
						messageId: { type: "text" },
						message: {
							type: "string",
						},
					},
				},
			});
			return false;
		}
	}

	async createQuestion(messageObj) {
		const vector = await inference.featureExtraction({
			model: "intfloat/e5-small-v2",
			inputs: messageObj?.message,
		});
		const doc = await client
			.index({
				index: "question",
				id: messageObj.messageId,
				document: {
					messageId: messageObj.messageId,
					question: messageObj.message,
					question_vector: vector,
					answerIds: [],
				},
			})
			.catch((error) => {
				console.log(error);
			});
		return doc;
	}

	async addAnswer(messageObj) {
		const doc = await client
			.index({
				index: "answer",
				id: messageObj.messageId,
				document: {
					messageId: messageObj.messageId,
					answer: messageObj.message,
					questionId: messageObj.questionId,
					upVote: 0,
					downVote: 0,
				},
			})
			.catch((error) => {
				console.log("Error adding answer: ", error);
			});
		return client
			.update({
				index: "question",
				id: messageObj.questionId,
				body: {
					script: {
						lang: "painless",
						source:
							"if (ctx._source.containsKey('answerIds')) ctx._source.answerIds.add(params.id);",
						params: {
							id: messageObj.messageId,
						},
					},
				},
			})
			.catch((error) => {
				console.log("Error to update: ", error);
			});
	}

	async getQuestion(messageId) {
		return client.search({
			query: {
				match: {
					id: "messageId",
				},
			},
		});
	}

	async searchQuestion(message) {
		const questionVector = await inference.featureExtraction({
			model: "intfloat/e5-small-v2",
			inputs: message.message,
		});
		let scriptQuery = {
			script_score: {
				query: {
					match_all: {},
				},
				script: {
					source:
						"cosineSimilarity(params.query_vector, 'question_vector') + 1.0",
					params: { query_vector: questionVector },
				},
			},
		};
		try {
			const response = await client.search({
				index: "question",
				body: {
					query: scriptQuery,
				},
			});
			let answerIds = [];
			response?.hits.hits.map((ques) => {
				if (ques._score > 1.9) {
					return answerIds.push(...ques._source.answerIds);
				}
			});
			let botAnswer = await this.searchAnswer(answerIds);
			let objToSend = {
				message: botAnswer,
				firstName: "AutoBot",
				lastName: " ",
				initials: "AB",
				userId: "1",
				timestamp: new Date(),
				color: "#000000",
				questionId: message.messageId,
				messageId: uuidv4(),
			};
			this.addAnswer(objToSend);
			eventHandler.emit("questionSearchCompleted", objToSend);
		} catch (error) {
			console.log(error);
		}
	}

	async searchAnswer(answerId) {
		try {
			const response = await client.search({
				index: "answer",
				body: {
					query: {
						ids: {
							values: answerId,
						},
					},
				},
			});

			return response?.hits?.hits?.[0]?._source?.answer;
		} catch (error) {
			console.log(error);
		}
	}
	async updateVote(messageObj, isUpVote) {
		let scriptQuery;
		if (isUpVote) {
			scriptQuery = {
				lang: "painless",
				source: "ctx._source.upVote += params.upVote",
				params: {
					upVote: 1,
				},
			};
		} else {
			scriptQuery = {
				lang: "painless",
				source: "ctx._source.downVote += params.downVote",
				params: {
					downVote: 1,
				},
			};
		}
		return await client
			.update({
				index: "answer",
				id: messageObj.messageId,
				body: {
					script: scriptQuery,
				},
			})
			.catch((error) => {
				console.log("Error to update vote: ", error);
			})
			.then(async (msg) => {
				return await client
					.search({
						query: {
							bool: {
								filter: {
									term: { _id: messageObj.messageId },
								},
							},
						},
					})
					.catch((error) => {
						console.log("Error to fetch vote: ", error);
					})
					.then((data) => {
						return data;
					});
			});
	}
}

let elasticService = Object.freeze(new ElasticClient());

export default elasticService;
