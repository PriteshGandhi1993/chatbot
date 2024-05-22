import { css } from "lit";

export default css`
  :host {
    // width: 50%;
    // height: 100%;
    // margin: 16px;
  }

  .chat-window {
    border: solid 1px gray;
    padding: 16px 8px;
    overflow: auto;
    flex: 1 1 auto;
    background-color: #FAFAFA;
    position: relative;
    z-index: 1;
  }

  .chat-window-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    background-color: #FAFAFA;
  }

  .message-container {
    display: flex;
    flex-direction: row;
    border: solid 1px gray;
    padding: 16px 8px;
    /* top: 87%; */
    align-items: center;
    flex: 0 0 auto;
    background-color: #FAFAFA;
    z-index: 1;
  }

  .message-text-box {
    appearance: none;
    /* border: 0; */
    width: 100%;
    border-radius: 32px;
    padding: 12px;
    font-size: 16px;
  }

  .message-button {
    background: url(./resources/img/send-message.svg) no-repeat;
    border: none;
    background-position: center;
    border-radius: 50%;
    background-color: #005DE8;
    margin-left: 8px;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
  }

  .message-button:hover {
    background-color: black;
    border: none;
    color: white;
    transition: 0.5s;
}

  ::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  .reply-div {
    background-color: #E8E8E8;
    display: none;
    flex-direction: row;
    padding: 8px 16px;
    border: black solid 1px;
    justify-content: space-between;
    height: 64px;
  }

  .divider-left {
    width: 0;
    height: 100%;
    border: black solid 1px;
  }

  .reply-icon {
    background: url(./resources/img/reply-icon.svg) no-repeat;
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }

  .reply-close {
    background: url(./resources/img/cross-icon.svg) no-repeat;
    border: none;
    background-position: center;
    border-radius: 50%;
    align-self: center;
    margin-left: 8px;
    width: 24px;
    height: 24px;
    flex: 0 0 auto;
  }
`;
