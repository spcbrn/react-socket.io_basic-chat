import React, { Component } from 'react';
import axios from 'axios';

import ChatMessage from './ChatMessage';


class ChatWindowREST extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat_messages: []
    }
  }

  componentDidMount = () => {
    this.pollServer();
    this.startPulse();
  }

  componentWillUnmount = () => {
    clearInterval(this.pulse);
  }

  submitMessage = event => {
    if (event.keyCode !== 13) return

    let newMessage = {
      user: this.refs.username.value,
      text: this.refs.input.value
    };

    axios.post('/api/newmessage', newMessage)
    .then(res => this.setState((prevState, props) => ({ chat_messages: res.data })))
    .catch(err => console.log(err));

    this.refs.input.value = '';
  }

  startPulse = () => {
    const makePulse = () => setInterval(this.pollServer, 1000);
    this.pulse = makePulse();
  }

  pollServer = () => {
    console.log('polling server...')
    axios.get('/api/messages')
    .then(res => this.setState((prevState, props) => ({ chat_messages: res.data })))
    .catch(err => console.log(err));
  }

  render() {

    const messageList = this.state.chat_messages.map((c, i) => {
      return (
        <ChatMessage key={i}
                     user={c.user}
                     text={c.text}
        />
      )
    })

    return (
      <section className="chat_window_main">
        <h3>REST Chat (polling)</h3>
        <div id="chat_window_container">
          <div id="chat_window_messages_main">
            <div id="chat_window_messages_container">
              {messageList}
            </div>
          </div>
          <div id="chat_window_new_message_container">
            <input placeholder="Username"
                   ref="username"
            />
            <input placeholder="Type a message..."
                   ref="input"
                   onKeyDown={this.submitMessage}
            />
          </div>
        </div>
      </section>
    )
  }
}

export default ChatWindowREST;
