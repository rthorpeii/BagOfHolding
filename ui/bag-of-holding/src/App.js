import React, { Component } from 'react';
import { Box, Tabs, Tab, Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import ItemTable from './components/itemtable/itemtable';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});



export default function App() {




  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props; return (
      <div {...other}>
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  }
  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Items" />
          <Tab label="Inventory" />
          <Tab label="Item Three" />
        </Tabs>

      </Container>
      <TabPanel value={value} index={0}>
        <ItemTable></ItemTable>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
        </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
        </TabPanel>
    </ThemeProvider>
  )
}
