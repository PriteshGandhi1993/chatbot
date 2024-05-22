import {css} from 'lit';

export default css`
:host {
    width: 50%;
    height: 100%;
    align-content: center;
}
.login-window-container {
    width: 80%;
    border-radius: 8px;
    border: 1px solid gray;
    display: flex;
    flex-direction: column;
    padding: 16px;
    align-items: center;
    background-color: #FDFDFD;
    position: relative;
    z-index: 1;
}

.name-container {
    display: flex;
    flex-direction: row;
    margin: 8px;
    width: 75%;
}

.name-input {
    font-size: 16px;
    height: 36px;
    width: 100%;
    border-radius: 16px;
    padding-left: 16px;
}

.login-button {
    margin: 24px 16px;
    padding: 12px;
    width: 32%;
    border-radius: 32px;
    background-color: #005DE8;
    border: none;
    color: white;
    transition: all 0.5s ease 0s;
    box-shadow: rgb(158, 158, 158) 0px 2px 4px;
}

.login-button:hover {
    background-color: black;
    border: none;
    color: white;
    transition: 0.5s;
}

.title-div {
    font-size: 24px;
    margin-bottom: 8px;
    font-weight: 550;
    margin-top: 16px;
    text-align: left;
}

.sub-title-div {
    margin-bottom: 24px;
}`;
