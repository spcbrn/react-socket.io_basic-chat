import React, { Component } from 'react';
import { observer } from 'mobx-react';

import ChatMessage from './ChatMessage';



const ChatWindowMobX = observer(class ChatWindowMobX extends Component {

  /*
  Open socket connection inside componentDidMount to allow socket events to execute asynchronously.
  Bind the socket channel to the component, using `this` to store the reference on a new `socket` property.
  Add your event listeners here as well.
  */
  componentDidMount = () => {
    let { store } = this.props;
    return store.socket ? null : store.openWebSocket();
  }

  /*
  Always manually close the socket channel to prevent memory leaks or other unexpected issues.
  It's good practice.
  */
  componentWillUnmount = () => {
    let { store } = this.props;
    store.closeWebSocket();
  }

  submitMessage = event => {
    if (event.keyCode !== 13) return

    let { store } = this.props;
    let newMessage = {
      user: this.refs.username.value,
      text: this.refs.input.value
    };

    /*
    The `emit()` method will transport a flagged event to the server, taking in the event flag and optional data.
    (Side note: The socket.io API is extensive, and growing, and offers a plethora of methods and patterns.  Check it.)
    */
    store.submitMessage(store.chat_messages, newMessage);

    this.refs.input.value = '';
  }

  render() {
    let { store } = this.props;

    const messageList = store.chat_messages.map((c, i) => {
      return (
        <ChatMessage key={i}
                     user={c.user}
                     text={c.text}
        />
      )
    })

    return (
      <section className="chat_window_main">
        <h3>IO Chat</h3>
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
})

export default ChatWindowMobX;
