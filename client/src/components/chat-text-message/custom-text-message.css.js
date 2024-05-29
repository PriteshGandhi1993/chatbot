import {css} from 'lit';

export default css`

.message-container {
    display: flex;
    flex-direction: row;
    margin: 8px 0px 8px 0px;
}

.name-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin: 4px;
    flex: 0 0 auto;
}

.name-text {
    font-weight: 600;
    margin-bottom: 3px;
}

.name-initials {
    text-align: center;
    font-weight: 550;
    padding: 0;
    color: white;
    margin-top: 9px;
}

.message-box {
    align-content: center;
    background-color: #EEEEEE;
    padding: 12px 16px;
    border-radius: 16px;
    font-size: 16px;
    width: 100%;
}

.name-time-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.time-text {
    font-size: 12px;
    color: #808080;
}

.collapsible-btn {
    background-color: #005DE8;
    cursor: pointer;
    align-content: center;
    margin-top: 8px;
    padding: 8px;
    border-radius: 16px;
    font-size: 12px;
    float: right;
    border: none;
    color: white;
}

.replies-container {   
    margin-top: 8px;
    height: 0;
    overflow: hidden;
    transition: height 1s ease;
}

.divider {
    background-color: gray;
    height: 1px;
}

.single-reply-conatiner {
    display: flex;
    flex-direction: row;
    box-shadow: 0px 2px 1px #BDBDBD;
    background-color: white;
    padding: 8px 4px;
    border-radius: 16px;
}

.reply-message-container {
    display: flex;
    flex-direction: row;
    margin: 8px 0px 8px 0px;
}

.reply-name-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    margin: 4px;
    flex: 0 0 auto;
}

.reply-name-text {
    font-weight: 600;
    margin-bottom: 3px;
}

.reply-name-initials {
    text-align: center;
    font-weight: 550;
    padding: 0;
    color: white;
    margin-top: 8px;
    font-size: 12px;
}

.reply-box {
    align-content: center;
    padding-left: 4px;
    padding-right: 4px;
    border-radius: 16px;
    font-size: 12px;
    width: 100%;
}

.reply-name-time-div {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.reply-time-text {
    font-size: 12px;
    color: #808080;
}

.reply-btn {
    width: 100%;
    border-radius: 16px;
    padding: 4px;
    color: white;
    background-color: #005DE8;
    margin-top: 16px;
    box-shadow: 0px 2px 1px #BDBDBD;
    border: unset;
    margin-bottom: 8px;
}

.emoticon-group {
    position: absolute;
    padding: 2px 12px;
    background-color: white;
    margin-right: 4px;
    margin-top: -18px;
    z-index: 2;
    align-self: flex-end;
    color: mediumseagreen;
    font-size: 14px;
    font-weight: bold;
    border-radius: 23px;
    box-shadow: 1px 1px 8px #BDBDBD;
    cursor: pointer;
    display: none
}

.emoticon-group-selected {
    padding: 2px 12px;
    background-color: white;
    margin-top: -4px;
    margin-left: 8px;
    align-self: flex-start;
    color: mediumseagreen;
    font-size: 12px;
    font-weight: bold;
    border-radius: 23px;
    box-shadow: 1px 1px 8px #BDBDBD;
    display: none;
}

.emoticon-btn {
    border: none;
    background: none;
    padding: unset;
    font-size: 14px;
}`;

