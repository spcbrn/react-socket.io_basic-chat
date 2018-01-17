import React from 'react';

const ChatMessage = props => {
  return (
    <article id='message_wrap'>
      <p>{props.user}:</p>
      <p>{props.text}</p>
    </article>
  )
}

export default ChatMessage;
