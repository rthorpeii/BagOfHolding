import { Paper, Tabs, Tab } from '@material-ui/core';

import AuthContext from './authcontext'

export default function TabBar(props) {
    const { value, setValue } = props
    const handleChange = (_, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper square>
            <AuthContext.Consumer>
                {({ loggedIn }) => (
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        centered>
                        <Tab label="Items" />
                        <Tab label="Inventory" disabled={!loggedIn} />
                        <Tab label="Characters" disabled={!loggedIn} />
                    </Tabs>
                )}
            </AuthContext.Consumer>
        </Paper>
    )
}