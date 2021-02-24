import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ApiClient from '../api-client'

const useStyles = makeStyles((_) => ({
    root: {
        height: "100%",
    }
}));

export default function PurchaseCard(props) {
    const classes = useStyles();
    const [items, setItems] = useState([])    // Item data for predicting item fill
    const [selected, setSelected] = useState({})

    const buyItem = () => {
        props.buyItem(selected)
    }

    useEffect(() => {
        ApiClient.get("/names/")
            .then(res => {
                setItems(res.data.items)
            })
            .catch(error => {
                console.log("Cannot load item names")
            })
    }, [])

    return (
        <Card className={classes.root}>
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={7}>
                        <Autocomplete
                            id="purchase-selection"
                            options={items}
                            getOptionLabel={(option) => option.Name}
                            onChange={(_, value) => { setSelected(value) }}
                            renderInput={(params) => <TextField {...params} label="Item to purchase" variant="outlined" />}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={5}>
                        <Button variant="contained"
                            onClick={buyItem}>
                            Purchase
                        </Button>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}