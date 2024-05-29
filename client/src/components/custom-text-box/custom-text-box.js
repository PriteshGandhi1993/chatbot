import {LitElement, html} from 'lit';
import style from './custom-text-box.css.js';

export class CustomTextBox extends LitElement {
	
	static get properties() {
		return {
			addMessage: {type: Function}
		}
	}

	constructor() {
		super();
		this.message = null;
	}

	static styles = [style];


	render() {
		console.log(typeof this.addMessage);
		console.log(this.addMessage);
		// let var
		return html`
			<div class="message-container">
				<input type="text" class="message-text-box" value="${this.message}"
				@change=${this.messageChange}>
				<button type="button" class="message-button" @click="${() => this.addMessage(this.message)}"></button>
			</div>`;
	}

	messageChange(e) {
		this.message = e.srcElement.value;
	}
}

window.customElements.define('custom-text-box', CustomTextBox);
