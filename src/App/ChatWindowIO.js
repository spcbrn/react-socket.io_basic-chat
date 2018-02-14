import React, { Component } from 'react';
import io from 'socket.io-client';

import ChatMessage from './ChatMessage';


class ChatWindowIO extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chat_messages: []
    }
  }

  /*
  Open socket connection inside componentDidMount to allow socket events to execute asynchronously.
  Bind the socket channel to the component, using `this` to store the reference on a new `socket` property.
  Add your event listeners here as well.
  */
  componentDidMount = () => {
    console.log('socket connected');
    this.socket = io();
    this.socket.on('get messages', data => { console.log('new message')
                                             this.setState((prevState, props) => ({ chat_messages: data.messages })) });
  }

  /*
  Always manually close the socket channel to prevent memory leaks or other unexpected issues.
  It's good practice.
  */
  componentWillUnmount = () => {
    this.socket.close()
  }

  submitMessage = event => {
    if (event.keyCode !== 13) return

    let newMessage = {
      user: this.refs.username.value,
      text: this.refs.input.value
    };

    /*
    The `emit()` method will transport a flagged event to the server, taking in the event flag and optional data.
    (Side note: The socket.io API is extensive, and growing, and offers a plethora of methods and patterns.  Check it.)
    */
    this.socket.emit('new message', newMessage);
    this.setState((prevState, props) => ({ chat_messages: [newMessage, ...prevState.chat_messages] }));

    this.refs.input.value = '';
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

        <h3>IO Chat (component state)</h3>

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

export default ChatWindowIO;
