import React, { Component } from 'react';
import Main from './main/Main.jsx';
import BuildSnapshot from './main/BuildSnapshot.jsx';
import 'antd/dist/antd.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Main />
        {/* <BuildSnapshot /> */}
      </div>
    );
  }
}

export default App;
