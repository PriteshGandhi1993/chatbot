import { LitElement, html } from "lit";
import style from "./chat-window.css.js";
import socketService from "../../service/socket-service.js";

export class ChatWindow extends LitElement {
	constructor() {
		super();
		this.messages = [];
		this.inputMessage = null;
		this.color = this.getRandomColor();
		this.toReplyContent = {
			userName: "",
			message: "",
		};
		let firstName = localStorage.getItem("firstName");
		let lastName = localStorage.getItem("lastName");
		let id = localStorage.getItem(firstName + " " + lastName);
		socketService.getSocket().on("new connection", console.log);
		socketService.getSocket().on("message", (msg) => {
			console.log("message: " + msg);
			this.addMessage(JSON.parse(msg));
		});
		socketService.getSocket().on("reply", (msg) => {
			console.log("reply: " + msg);
			this.addReply(JSON.parse(msg), false);
		});
		socketService.getSocket().on("botAnswer", (msg) => {
			console.log("botAnswer: " + msg);
			this.addReply(JSON.parse(msg), true);
		});
		document.getElementById("particles-js").style.display = "none";
		document.body.style.backgroundColor = "#ffffff";
		this.addEventListener("ReplyClicked", function (e) {
			console.log(e);
			this.showReplyDiv(e);
		});
	}

	static styles = [style];

	render() {
		return html`
			<div class="chat-window-container">
				<div class="chat-window">${this.messages}</div>
				<div>
					<div id="reply-div" class="reply-div">
						<div
							style="display:flex; flex-direction: column; justify-content: space-between;overflow: hidden;
						margin-right: 4px;
						text-overflow: ellipsis;"
						>
							<div style="display: flex">
								<div class="reply-icon"></div>
								You are replying to
							</div>
							<div style="display:flex; flex-direction:row; margin-top:8px;">
								<div class="divider-left"></div>
								<div
									style="display: flex;
								flex-direction: column; margin-left: 8px;"
								>
									<div style="width:100%" class="reply-to-username">
										${this.toReplyContent.userName}
									</div>
									<div
										style="width:100%; text-overflow: ellipsis;
										white-space: nowrap;
										overflow: hidden;"
										class="reply-to-message"
									>
										${this.toReplyContent.message}
									</div>
								</div>
							</div>
						</div>
						<button class="reply-close" @click=${this.closeReply}></button>
					</div>
					<div class="message-container">
						<input
							id="message-input-id"
							type="text"
							class="message-text-box"
							value="${this.inputMessage}"
							@change=${this.messageChange}
						/>
						<button
							type="button"
							class="message-button"
							@click="${() => this.sendMessageEvent(this.inputMessage)}"
						></button>
					</div>
				</div>
			</div>
		`;
	}

	messageChange(e) {
		this.inputMessage = e.srcElement.value;
	}

	sendMessageEvent(message) {
		if (message != "" && message != undefined && message != null) {
			let firstName = localStorage.getItem("firstName");
			let lastName = localStorage.getItem("lastName");
			// let color = localStorage.getItem('color');
			let id = localStorage.getItem(firstName + " " + lastName);

			let messageObj = {
				message: message,
				firstName: firstName,
				lastName: lastName,
				userId: id,
				timestamp: new Date(),
				color: this.color,
			};
			if (
				this.toReplyContent?.messageId != "" &&
				this.toReplyContent?.messageId != undefined &&
				this.toReplyContent?.messageId != null
			) {
				console.log("replyContent: ", this.toReplyContent);
				messageObj.replyMessage = true;
				messageObj.questionId = this.toReplyContent?.messageId;
				console.log("Reply Message: ", messageObj);
				socketService.getSocket().emit("sendReply", JSON.stringify(messageObj));
			} else {
				socketService
					.getSocket()
					.emit("sendMessage", JSON.stringify(messageObj));
			}
			this.shadowRoot.getElementById("message-input-id").value = "";
			this.inputMessage = "";
			this.toReplyContent = {};
			this.shadowRoot.getElementById("reply-div").style.display = "none";
		}
	}

	addReply(messageData, isBot) {
		messageData.name = messageData.firstName + " " + messageData.lastName;
		messageData.initials = messageData.initials ? messageData.initials :
			messageData.firstName?.[0] + messageData.lastName?.[0];
		messageData.messageText = messageData.message;
		console.log("add reply messageData: ", messageData);
		let messageUi = this.shadowRoot.getElementById("" + messageData?.questionId);
		console.log(messageUi);
		if(isBot) {
			messageUi?.addReply(messageData, isBot);
		} else {
			messageUi?.addReply(messageData, isBot);
		}

		this.requestUpdate();
	}

	addMessage(messageData) {
		console.log(messageData);
		const templateToAppend = html` <custom-text-message
			id=${messageData.messageId}
			messageId=${messageData.messageId}
			name=${messageData.firstName + " " + messageData.lastName}
			initials=${messageData.firstName?.[0] + messageData.lastName?.[0]}
			messageText=${messageData.message}
			userId=${messageData.userId}
			timestamp=${messageData.timestamp}
			color=${messageData.color}
		>
		</custom-text-message>`;
		if (this.messages?.length == 100) {
			this.messages.unshift();
		}
		console.log(this.messages);
		this.messages.push(templateToAppend);

		this.requestUpdate();
	}
	getRandomColor() {
		var letters = "0123456789ABCDEF";
		var color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		let id = localStorage.getItem(firstName + " " + lastName);
		socketService.getSocket().emit("close-connection", { userId: id });
	}

	showReplyDiv(e) {
		console.log(e);

		this.toReplyContent.userName = e?.detail?.userName;
		this.toReplyContent.message = e?.detail?.message;
		this.toReplyContent.messageId = e?.detail?.messageId;
		this.toReplyContent.questionId = e?.detail?.messageId;
		console.log(this.toReplyContent);
		this.shadowRoot.getElementById("reply-div").style.display = "flex";
		e.srcElement.requestUpdate();
	}

	closeReply() {
		this.shadowRoot.getElementById("reply-div").style.display = "none";
		this.toReplyContent = {};
	}
}

window.customElements.define("chat-window", ChatWindow);
