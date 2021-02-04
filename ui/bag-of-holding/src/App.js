import React from 'react';
import { Box, Tabs, Tab, Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import ItemTable from './components/itemtable/itemtable';
import { createMuiTheme } from '@material-ui/core/styles';
import InventoryTable from './components/inventory/inventory';
import Header from './components/header'
import CharacterTable from './components/character-table';
import AuthContext from './components/authcontext'

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
            <Header />
            <Container>
                <AuthContext.Consumer>
                    {({ loggedIn}) => (
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Items" />
                            <Tab label="Inventory" disabled={!loggedIn} />
                            <Tab label="Characters" disabled={!loggedIn} />
                        </Tabs>
                    )}
                </AuthContext.Consumer>
            </Container>
            <TabPanel value={value} index={0}>
                <ItemTable></ItemTable>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <InventoryTable></InventoryTable>
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CharacterTable />
            </TabPanel>
        </ThemeProvider>
    )
}
