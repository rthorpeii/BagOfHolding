import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, Card, CardContent, CardHeader, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        flexDirection: "row",
    }
}));

export default function CharacterForm() {
    const classes = useStyles();

    return (
        <Grid container spacing={3}>
            <Grid item xs={3} />
            <Grid item xs={6}>
                <Card >
                    <CardHeader title="Create a Character" />
                    <div className={classes.card}>
                        <CardContent >
                            <form noValidate autoComplete="off">
                                <TextField id="create-character-name" label="Character Name" />
                            </form>
                        </CardContent>
                        <CardContent >
                            <Button variant="outlined">Create!</Button>
                        </CardContent>
                    </div>

                </Card>
            </Grid>
        </Grid>
    );
}