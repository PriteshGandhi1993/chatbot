import { LitElement, html } from "lit";
import style from "./custom-text-message.css.js";

/**
 * An example element.
 */
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
  }

  static styles = [style];

  render() {
    let id = localStorage.getItem(this.name);
    var minutes = new Date(this.timestamp).getMinutes();
    var hour = new Date(this.timestamp).getHours();
    console.log("self: ", typeof this.self, this.self);
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
            <button class="collapsible-btn" @click="${() => this.seeReplies()}">
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
      //   return html` <div class="message-container" style="justify-content: flex-end;">
      //     <div class="message-box">
      //       <div class="name-text">${this.name}</div>
      //       <div class="message-text">${this.messageText}</div>
      //     </div>
      // 	<div
      //       class="name-icon"
      //       style="background-color: ${this.getRandomColor()}"
      //     >
      //       <p class="name-initials">${this.initials}</p>
      //     </div>
      //   </div>`;
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
    // let repliesDiv = this.shadowRoot.getElementById('replies'); // not null
    // console.log(this.shadowRoot);
    // console.log(repliesDiv);
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

    // var minutes = new Date(this.timestamp).getMinutes();
    // var hour = new Date(this.timestamp).getHours();
    // const templateToAppend = html` <div class="single-reply-conatiner">
    //   <div class="reply-name-icon" style="background-color: ${this.color}">
    //     <p class="reply-name-initials">${this.initials}</p>
    //   </div>
    //   <div class="reply-box">
    //     <div class="reply-name-time-div">
    //       <div class="reply-name-text">${this.name}</div>
    //       <div class="reply-time-text">${hour + ":" + minutes}</div>
    //     </div>
    //     <div class="reply-message-text">${this.messageText}</div>
    //   </div>
    // </div>`;
    // this.repliesTemplate.push(templateToAppend);
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

  addReply(messageObj) {
    console.log("Add reply", messageObj);
    let minutes = new Date(messageObj.timestamp).getMinutes();
    let hour = new Date(messageObj.timestamp).getHours();
    const templateToAppend = html` <div class="single-reply-conatiner">
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
    </div>`;
    this.repliesTemplate.push(templateToAppend);
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

window.customElements.define("custom-text-message", CustomTextMessage);
