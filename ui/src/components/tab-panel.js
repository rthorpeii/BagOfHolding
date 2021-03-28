import { Box } from '@material-ui/core';

export default function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
}