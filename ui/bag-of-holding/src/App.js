import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import Items from './components/items';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Items items={this.state.items} />
          <Button variant="contained" color="primary">Hello World</Button>
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    )
  }

  state = {
    items: []
  };

  componentDidMount() {
    fetch('http://localhost:8080/items')
      .then(res => res.json())
      .then((data) => {
        console.log('STUFF: ' + JSON.stringify(data))
        this.setState({ items: data.data })
      })
      .catch(console.log)
  }
}
export default App;
