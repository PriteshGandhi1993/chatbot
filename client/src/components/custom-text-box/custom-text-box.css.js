import {css} from 'lit';

export default css`
:host {
    border: solid 1px gray;
    padding: 16px;
    /* top: 87%; */
    height: 7%;
    align-content: center;
}

.message-container {
    display: flex;
    flex-direction: row;
}

.message-text-box {
    appearance: none;
    /* border: 0; */
    width: 100%;
    border-radius: 32px;
    padding-left: 12px;
}

.message-button {
    background: url(./resources/img/send-message.svg) no-repeat;
    border: none;
    background-position: center;
    padding: 3%;
    border-radius: 50%; 
    background-color: #555555;
    margin-left: 8px;
}`;
