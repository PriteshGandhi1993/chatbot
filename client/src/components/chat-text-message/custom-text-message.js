import { LitElement, html } from "lit";
import style from "./custom-text-message.css.js";
import socketService from "../../service/socket-service.js";

export class CustomTextMessage extends LitElement {
	static get properties() {
		return {
			messageId: { type: String },
			messageText: { type: String },
			name: { type: String },
			initials: { type: String },
			userId: { type: String },
			timestamp: { type: String },
			color: { type: String },
		};
	}
	constructor() {
		super();
		this.repliesTemplate = [];
		socketService.getSocket().on("addUpVote", (msg) => {
			this.addUpVote(JSON.parse(msg));
		});
		
		socketService.getSocket().on("addDownVote", (msg) => {
			this.addDownVote(JSON.parse(msg));
		});
	}

	static styles = [style];

	render() {
		let id = localStorage.getItem(this.name);
		var minutes = new Date(this.timestamp).getMinutes();
		var hour = new Date(this.timestamp).getHours();
		if (this.userId == id) {
			return html` <div
				class="message-container"
				style="justify-content: flex-end;"
			>
				<div class="message-box" style="margin: 0px 0px 8px 48px;">
					<div class="name-time-div" style="justify-content: flex-end;">
						<div class="time-text">${hour + ":" + minutes}</div>
					</div>
					<div class="message-text">${this.messageText}</div>
					<div
						style="display:flex; flex-direction: row; width: 100%; justify-content: flex-end;"
					>
						<button
							id="reply-button"
							class="collapsible-btn"
							@click="${() => this.seeReplies()}"
						>
							See Replies
						</button>
					</div>
					<div id="replies" class="replies-container">
						<div class="divider"></div>
						<div id="reply-messages">${this.repliesTemplate}</div>
						<button
							class="reply-btn"
							@click="${() => this.replyToQuestion(this.messageId)}"
						>
							Reply
						</button>
					</div>
				</div>
			</div>`;
		} else {
			return html` <div class="message-container">
				<div class="name-icon" style="background-color: ${this.color}">
					<p class="name-initials">${this.initials}</p>
				</div>
				<div class="message-box" style="margin: 0px 48px 8px 0px;">
					<div class="name-time-div">
						<div class="name-text">${this.name}</div>
						<div class="time-text">${hour + ":" + minutes}</div>
					</div>
					<div class="message-text">${this.messageText}</div>
					<div
						style="display:flex; flex-direction: row; width: 100%; justify-content: flex-end;"
					>
						<button
							id="reply-button"
							class="collapsible-btn"
							@click="${() => this.seeReplies()}"
						>
							See Replies
						</button>
					</div>
					<div id="replies" class="replies-container">
						<div class="divider"></div>
						<div id="reply-messages">${this.repliesTemplate}</div>
						<button
							class="reply-btn"
							@click="${() => this.replyToQuestion(this.messageId)}"
						>
							Reply
						</button>
					</div>
				</div>
			</div>`;
		}
	}

	seeReplies(e) {
		if (
			this.shadowRoot
				.getElementById("replies")
				.classList.contains("reply-active")
		) {
			this.shadowRoot
				.getElementById("replies")
				.classList.remove("reply-active");
			this.shadowRoot.getElementById("replies").style.height = 0;
			this.shadowRoot.getElementById("reply-button").textContent =
				"See Replies";
			this.shadowRoot.getElementById("reply-button").style.backgroundColor =
				"#005DE8";
		} else {
			this.shadowRoot.getElementById("replies").classList.add("reply-active");
			this.shadowRoot.getElementById("replies").style.height =
				this.shadowRoot.getElementById("replies").scrollHeight + "px";
			this.shadowRoot.getElementById("reply-button").textContent =
				"Close Replies";
			this.shadowRoot.getElementById("reply-button").style.backgroundColor =
				"#000000";
		}

		this.requestUpdate();
	}

	replyToQuestion(id) {
		const event = new CustomEvent("ReplyClicked", {
			detail: {
				messageId: this.messageId,
				message: this.messageText,
				userName: this.name,
			},
			bubbles: true,
			composed: true,
		});
		this.dispatchEvent(event);
	}

	addReply(messageObj, isBot = false) {
		let message = this.shadowRoot.getElementById(messageObj.messageId);
		if(!message) {
		console.log("Add reply", messageObj);
		let minutes = new Date(messageObj.timestamp).getMinutes();
		let hour = new Date(messageObj.timestamp).getHours();
		const templateToAppend = html` <div style="padding-top:18px;"  id="${messageObj.messageId}">
			<div
				style="display:flex;flex-direction: column;"
				@mouseover="${() => this.hoverInTextBox(messageObj.messageId)}"
				@mouseout="${() => this.hoverOutTextBox(messageObj.messageId)}"
			>
				<div id="emoticon-group-${messageObj.messageId}" class="emoticon-group">
					<span
						style="color: mediumseagreen;margin-right: 12px;cursor: pointer;"
						@click="${() => this.upvote(messageObj)}"
						>&#10003;</span
					><span
						style="color:red;cursor: pointer;"
						@click="${() => this.downvote(messageObj)}"
						>&#10006;</span
					>
				</div>
				<div class="single-reply-conatiner">
					<div
						class="reply-name-icon"
						style="background-color: ${messageObj.color}"
					>
						<p class="reply-name-initials">${messageObj.initials}</p>
					</div>
					<div class="reply-box">
						<div class="reply-name-time-div">
							<div class="reply-name-text">${messageObj.name}</div>
							<div class="reply-time-text">${hour + ":" + minutes}</div>
						</div>
						<div class="reply-message-text">${messageObj.messageText}</div>
					</div>
				</div>
				<div
					id="emoticon-group-selected-${messageObj.messageId}"
					class="emoticon-group-selected"
				>
					<span
						id="emoticon-upvote-${messageObj.messageId}"
						style="color: mediumseagreen;margin-right: 3px;margin-left: 3px;display: none;"
						>&#10003;</span
					><span>${messageObj.accepted}</span>
					<span
						id="emoticon-downvote-${messageObj.messageId}"
						style="color:red;margin-right: 3px;margin-left: 3px;display: none;"
						>&#10006;</span
					><span>${messageObj.rejected}</span>
				</div>
			</div>
		</div>`;
		if(isBot) {
			this.repliesTemplate.unshift(templateToAppend);
		} else {
			this.repliesTemplate.push(templateToAppend);
		}
		this.requestUpdate();
		requestAnimationFrame(() => {
			if (
				this.shadowRoot
					.getElementById("replies")
					.classList.contains("reply-active")
			) {
				this.shadowRoot.getElementById("replies").style.height =
					this.shadowRoot.getElementById("replies").scrollHeight + "px";
			}
		});
	}
	}

	upvote(message) {
		let customMessage = {
			messageId: message.messageId,
		};
		socketService.getSocket().emit("upVote", JSON.stringify(customMessage));
	}

	downvote(message) {
		let customMessage = {
			messageId: message.messageId,
		};
		socketService.getSocket().emit("downVote", JSON.stringify(customMessage));
	}

	hoverInTextBox(messageId) {
		let element = this.shadowRoot.getElementById("emoticon-group-" + messageId);
		element.style.display = "block";
	}

	hoverOutTextBox(messageId) {
		let element = this.shadowRoot.getElementById("emoticon-group-" + messageId);
		element.style.display = "none";
	}

	addUpVote(message) {
		console.log("msg: ", message);
		let parentElement = this.shadowRoot.getElementById(
			"emoticon-group-selected-" + message.messageId
		);
		if (parentElement)
			parentElement.style.display = "flex";
		let element = this.shadowRoot.getElementById(
			"emoticon-upvote-" + message.messageId
		);
		if (element) {
		element.style.display = "block";
		element.innerHTML =
			'&#10003;<span style="color: black; margin-left: 2px;">' +
			(message.upVote + 1) +
			"</span>";
		}
		requestAnimationFrame(() => {
			if (
				this.shadowRoot
					.getElementById("replies")
					.classList.contains("reply-active")
			) {
				this.shadowRoot.getElementById("replies").style.height =
					this.shadowRoot.getElementById("replies").scrollHeight + "px";
			}
		});
	}

	addDownVote(message) {
		let parentElement = this.shadowRoot.getElementById(
			"emoticon-group-selected-" + message.messageId
		);
		if (parentElement)
			parentElement.style.display = "flex";
		console.log("downvote parent: ", parentElement);
		let element = this.shadowRoot.getElementById(
			"emoticon-downvote-" + message.messageId
		);
		console.log("downvote element: ", element);
		if (element) {
			element.style.display = "block";
			element.innerHTML =
				'&#10006;<span style="color:black; margin-left: 2px">' +
				(message.downVote + 1) +
				"</span>";
		}
		requestAnimationFrame(() => {
			if (
				this.shadowRoot
					.getElementById("replies")
					.classList.contains("reply-active")
			) {
				this.shadowRoot.getElementById("replies").style.height =
					this.shadowRoot.getElementById("replies").scrollHeight + "px";
			}
		});
	}
}

window.customElements.define("custom-text-message", CustomTextMessage);
