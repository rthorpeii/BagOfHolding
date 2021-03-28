import { Box, Container, CssBaseline, ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { useContext, useEffect, useState } from 'react';

import AuthContext from './components/authcontext'

import CharacterTable from './components/character-table';
import Header from './components/header'
import InventoryPage from './components/inventory/page';
import ItemTable from './components/itemtable/itemtable';
import TabBar from './components/tabbar';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
    },
});

theme.shadows = []

export default function App() {
    const [value, setValue] = useState(0);
    const { loggedIn } = useContext(AuthContext)

    function TabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div {...other}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    }

    // Return to the items tab if logged out
    useEffect(()=> {
        if (!loggedIn) {
            setValue(0)
        }
    }, [loggedIn])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <Container>
                <TabBar value={value} setValue={setValue} />
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
