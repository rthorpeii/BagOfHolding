import React, { Component } from 'react';
import { Button, Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import ItemCard from './components/items';
import ItemTable from './components/itemtable/itemtable';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
      <CssBaseline/>
        <Container>
          <header className="App-header">
            <ItemCard items={this.state.items} />
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
          <ItemTable></ItemTable>
        </Container>
      </ThemeProvider>
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
