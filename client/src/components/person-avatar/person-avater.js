import {LitElement, html} from 'lit';
import style from './person-avatar.css.js';

/**
 * An example element.
 */
export class PersonAvatar extends LitElement {
  
    constructor() {
      super();
    }
  
    static styles = [style];
  
  
    render() {
      return html`
        <div>Hi, this is a demo element!</div>`;
    }
  }
  
  window.customElements.define('person-avatar', PersonAvatar);
  