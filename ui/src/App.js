import { useState } from 'react';
import { Box, Tabs, Tab, Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';

import AuthContext from './components/authcontext'
import CharacterTable from './components/character-table';
import Header from './components/header'
import InventoryPage from './components/inventory/page';
import ItemTable from './components/itemtable/itemtable';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

theme.shadows = []

export default function App() {
    const [value, setValue] = useState(0);
    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
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
                    {({ loggedIn }) => (
                        <Tabs value={value} onChange={handleChange}>
                            <Tab label="Items" />
                            <Tab label="Inventory" disabled={!loggedIn} />
                            <Tab label="Characters" disabled={!loggedIn} />
                        </Tabs>
                    )}
                </AuthContext.Consumer>
            </Container>
            <TabPanel value={value} index={0}>
                <ItemTable />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <InventoryPage />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CharacterTable />
            </TabPanel>
        </ThemeProvider>
    )
}
