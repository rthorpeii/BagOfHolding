import { AppBar, Toolbar, Typography } from "@material-ui/core";
import AuthButton from "./authbutton";


export default function Header() {
    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">Bag of Holding</Typography>
                <AuthButton/>
            </Toolbar>
        </AppBar>
    )
}
