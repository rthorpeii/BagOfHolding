import React, { useState, useEffect } from 'react';
import { Card, CardContent, makeStyles, TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ApiClient from '../api-client'

const useStyles = makeStyles((_) => ({
    mergecard: {
        flexDirection: "column",
        height: "100%",
    },
    gold: {
        paddingTop: '10px',
    }
}));

export default function CharacterCard(props) {
    const classes = useStyles();
    const [characters, setCharacters] = useState([])
    const [selected, setSelected] = useState({})

    const getCharacters = () => {
        ApiClient.get("/characters/", {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                setCharacters(res.data.data)
                setSelected(res.data.data[0])
            })
            .catch(error => {
                console.log("Cannot load character names")
            })
    }
    
    useEffect(() => {
        props.onChange(selected)
    }, [selected])

    useEffect(() => {
        getCharacters()
    }, [])

    return (
        <Card className={classes.mergecard}>
            <CardContent>
                <Autocomplete
                    id="character-selection"
                    value={selected}
                    options={characters}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => { setSelected(value) }}
                    renderInput={(params) => <TextField {...params} label="Character" variant="outlined" />}
                />
                <Typography variant="h5" className={classes.gold}>
                    Inventory Cost: {props.costTotal} gp
                </Typography>
            </CardContent>
        </Card>
    )
}