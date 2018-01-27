import { observable } from 'mobx';
import io from 'socket.io-client';

export const appState = observable({
  chat_messages: []
});

appState.openWebSocket = async () => { appState.socket = await io()
                                       addListeners(appState.socket)
                                       console.log('mobx web socket opened') };
appState.closeWebSocket = () => { appState.socket.close()
                                  console.log('mobx web socket closed') };
appState.updateMessages = messages => appState.chat_messages = messages;
appState.submitMessage = (prevMsgs, newMsg) => { appState.socket.emit('new message', newMsg)
                                                 appState.chat_messages = [newMsg, ...prevMsgs] };


const addListeners = socket => {
  socket.on('get messages', data => appState.updateMessages(data.messages));
}
