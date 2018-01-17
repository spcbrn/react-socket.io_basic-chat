import React, { Component } from 'react';

import ChatWindowREST from './ChatWindowREST';
import ChatWindowIO from './ChatWindowIO';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      active_chat: 'rest'
    }
  }

  toggleChat = (flag) => this.setState({ active_chat: flag })

  render() {

    const renderChat = flag => flag === 'rest' ? <ChatWindowREST /> : <ChatWindowIO />;

    return (
      <main className="App">
        <h1>Choose an interface:</h1>
        <button disabled={this.state.active_chat === 'rest'}
                onClick={() => this.toggleChat('rest')}>REST</button>
        <button disabled={this.state.active_chat === 'io'}
                onClick={() => this.toggleChat('io')}>IO</button>
        <br /><br />
        {renderChat(this.state.active_chat)}
      </main>
    )
  }
};

export default App;
