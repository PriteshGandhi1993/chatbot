import { LitElement, html } from "lit";
import style from "./login-window.css.js";
import { v4 as uuidv4 } from "uuid";
import socketService from "../../service/socket-service.js";

export class LoginWindow extends LitElement {
  static get properties() {
    return {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.firstName = localStorage.getItem("firstName");
    this.lastName = localStorage.getItem("lastName");
  }

  static styles = [style];

  render() {
    if (
      this.firstName &&
      this.lastName &&
      localStorage.getItem(this.firstName + " " + this.lastName)
    ) {
      return html`<chat-window></chat-window>`;
    } else {
      return html`
        <div class="login-window-container">
          <div class="title-div">Welcome</div>
          <div class="sub-title-div">
            Please enter the details below to login !
          </div>
          <div class="name-container">
            <input
              value="${this.firstName}"
              @change=${this.updateFirstName}
              type="text"
              placeholder="First Name"
              class="name-input"
            />
          </div>
          <div class="name-container">
            <input
              value="${this.lastName}"
              @change=${this.updateLastName}
              type="text"
              placeholder="Last Name"
              class="name-input"
            />
          </div>
          <button type="button" class="login-button" @click="${this.login}">
            LOGIN
          </button>
        </div>
      `;
    }
  }

  login() {
    if (this.firstName?.length && this.lastName?.length) {
      localStorage["firstName"] = this.firstName;
      localStorage["lastName"] = this.lastName;
      let id = uuidv4();
      localStorage[this.firstName + " " + this.lastName] = id;
      // localStorage['color'] = this.getRandomColor();
      socketService.getSocket().emit("join", {
        firstName: this.firstName,
        lastName: this.lastName,
        userId: id,
      });
      document.getElementById("particles-js").style.display = "none";
      document.body.style.backgroundColor = "#ffffff";
      this.requestUpdate();
    }
  }

  updateFirstName(e) {
    this.firstName = e.srcElement.value;
  }

  updateLastName(e) {
    this.lastName = e.srcElement.value;
  }
}

window.customElements.define("login-window", LoginWindow);
