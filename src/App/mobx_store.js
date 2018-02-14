import { observable } from 'mobx';
import io from 'socket.io-client';

export const mobxState = observable({
  chat_messages: []
});

mobxState.openWebSocket = async () => { mobxState.socket = await io()
                                       addListeners(mobxState.socket)
                                       console.log('mobx web socket opened') };
mobxState.closeWebSocket = () => { mobxState.socket.close()
                                  console.log('mobx web socket closed') };
mobxState.updateMessages = messages => mobxState.chat_messages = messages;
mobxState.submitMessage = (prevMsgs, newMsg) => { mobxState.socket.emit('new message', newMsg)
                                                 mobxState.chat_messages = [newMsg, ...prevMsgs] };


const addListeners = socket => {
  socket.on('get messages', data => mobxState.updateMessages(data.messages));
}
