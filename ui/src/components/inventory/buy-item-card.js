import { useState, useEffect } from 'react';
import { Button, makeStyles, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ApiClient from '../api-client'

const useStyles = makeStyles((_) => ({
    outerCard: {
        flexDirection: "column",
        height: "100%",
    },
    itemDropdown: {
        paddingBottom: "10px",
    }
}));

export default function BuyItemCard(props) {
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
        <div className={classes.outerCard}>
            <Autocomplete
                className={classes.itemDropdown}
                options={items}
                getOptionLabel={(option) => option.Name}
                onChange={(_, value) => { setSelected(value) }}
                renderInput={(params) => <TextField {...params} label="Item to buy" variant="outlined" />}
            />
            <Button variant="contained"
                onClick={buyItem}>
                Buy Item
                </Button>
        </div>
    )
}