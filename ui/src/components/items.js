import { IconButton, Card, CardActionArea, CardContent, Paper, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Delete from '@material-ui/icons/Delete';

import React from 'react'
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cost: {
        display: 'flex',
    },
    delete: {
        display: 'flow',
    }

}));

export default function ItemCard({ items }) {
    const classes = useStyles();
    return (
        <Paper>
            <center><h1>Item List</h1></center>
            {items.map((item) => (
                <Card className={classes.root} variant="outlined">
                    <div className={classes.header}>
                        <CardActionArea href={item.link}>
                            <CardContent className={classes.content}>
                                <Typography component="h5" variant="h5">{item.name}</Typography>
                                <Typography variant="subtitle1">{item.rarity}</Typography>

                            </CardContent>
                        </CardActionArea>
                    </div>
                    <CardContent className={classes.cost}>
                        <Typography variant="h5">
                            {item.cost} gp
                        </Typography>
                    </CardContent>

                    <div className={classes.delete}>
                        <IconButton>
                            <Delete></Delete>
                        </IconButton>
                    </div>
                </Card>
            ))}
        </Paper>
    )
}