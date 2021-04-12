import { MTableToolbar } from "@material-table/core";
import { Grid, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((_) => ({
    title: {
        paddingLeft: '20px',
        paddingTop: '10px'
    },
}));

export default function Toolbar(props) {
    const classes = useStyles();

    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={6} >
                    <Typography variant="h6" className={classes.title}>Campaign Items</Typography>
                </Grid>
                <Grid item xs={12} sm={6} >
                    <MTableToolbar {...props} />
                </Grid>
            </Grid>
        </div>
    )
}