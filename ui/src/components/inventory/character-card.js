import { useState, useEffect } from 'react';
import { makeStyles, TextField, Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import ApiClient from '../api-client'

const useStyles = makeStyles((_) => ({
    mergecard: {
        flexDirection: "column",
        height: "100%",
    },
    costText: {
        paddingTop: '10px',
    }
}));

export default function CharacterCard(props) {
    const classes = useStyles();

    const { costTotal, onChange } = props
    const [characters, setCharacters] = useState([])
    const [selected, setSelected] = useState({})

    const getCharacters = () => {
        ApiClient.get("/characters/")
            .then(res => {
                setCharacters(res.data.characters)
                if (res.data.characters.length > 0) {
                    setSelected(res.data.characters[0])
                }
            })
            .catch(error => {
                console.log("Cannot load character names")
            })
    }

    // When the selected value is updated, alert the parent
    useEffect(() => {
        onChange(selected)
    }, [selected, onChange])

    // On init load the characters
    useEffect(() => {
        getCharacters()
    }, [])

    return (
        <div className={classes.mergecard}>
                <Autocomplete
                    id="character-selection"
                    value={selected}
                    options={characters}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => { setSelected(value) }}
                    renderInput={(params) => <TextField {...params} label="Character" variant="outlined" />}
                />
                <Typography variant="h6" className={classes.costText}>
                    Inventory Cost: {costTotal} gp
                </Typography>
        </div>
    )
}