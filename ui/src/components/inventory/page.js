import { useState, useEffect } from 'react';
import { Grid, Hidden } from '@material-ui/core/';
import Alert from '@material-ui/lab/Alert';

import ApiClient from '../api-client'
import CharacterCard from './character-card'
import ConsumedTable from './consumed-table'
import BuyItemCard from './buy-item-card';
import Table from './table';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';


export default function InventoryPage() {
    const [owned, setOwned] = useState([]); // owned items
    const [consumed, setConsumed] = useState([]); // consumed items
    const [character, setCharacter] = useState({})
    const [costTotal, setCostTotal] = useState(0)

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    // Validates that a character is selected
    const validateCharacter = () => {
        console.log("Character: ", character)
        if (character === null || (character.constructor === Object && Object.keys(character).length === 0)) {
            setErrorMessages(["Please select a character. If you have no characters, add one in the Characters tab"])
            setIserror(true)
            return false
        }
        return true
    }

    // Handles buying an item
    const buyItem = (item) => {
        if (Object.keys(item).length === 0 && item.constructor === Object) {
            setErrorMessages(["Please Select an Item"])
            setIserror(true)
            return
        }
        if (!validateCharacter()) {
            return
        }
        var payload = {
            "character_id": character.id,
            "item_id": item.ID
        }
        // Buy the selected item
        ApiClient.post("/buy/", payload)
            .then(res => {
                setOwned(res.data.owned)
                setConsumed(res.data.consumed)
                setCostTotal(res.data.cost)
                setIserror(false)
            }).catch(error => {
                setErrorMessages(["Cannot Buy Item"])
                setIserror(true)
            })
    }

    // Handles selling an item
    const removeItem = (oldData, consume) => {
        var payload = {
            "character_id": oldData.character_id,
            "item_id": oldData.item_id
        }
        ApiClient.post(consume ? "/consume/" : "/sell/", payload)
            .then(res => {
                setOwned(res.data.owned)
                setConsumed(res.data.consumed)
                setCostTotal(res.data.cost)
                setIserror(false)
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error", error.error])
                setIserror(true)
            })
    }

    const unconsumeItem = (oldData, consume) => {
        var payload = {
            "character_id": oldData.character_id,
            "item_id": oldData.item_id
        }
        ApiClient.post("/unconsume/", payload)
            .then(res => {
                setOwned(res.data.owned)
                setConsumed(res.data.consumed)
                setCostTotal(res.data.cost)
                setIserror(false)
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error", error.error])
                setIserror(true)
            })
    }

    // Update the inventory when a character is selected
    useEffect(() => {
        let mounted = true
        if (mounted) {
            if (!validateCharacter()) {
                return
            }
        }
        ApiClient.get("/inventory/" + character.id)
            .then(res => {
                if (mounted) {
                    setOwned(res.data.owned)
                    setConsumed(res.data.consumed)
                    setCostTotal(res.data.cost)
                    setIserror(false)
                }
            })
            .catch(error => {
                if (mounted) {
                    setErrorMessages(["Cannot load inventory data"])
                    setIserror(true)
                }
            })

        return () => mounted = false;
    }, [character])

    // Columns used in the tables
    const theme = useTheme();
    var sizeMatches = useMediaQuery(theme.breakpoints.down("xs"))
    const Columns = [
        { title: "id", field: "id", hidden: true },
        { title: "user_id", field: "user_id", hidden: true },
        { title: "item_id", field: "user_id", hidden: true },
        { title: "Name", field: "Item.name" },
        { title: "Rarity", field: "Item.rarity", hidden: sizeMatches },
        {
            title: "Cost",
            field: "Item.cost",
            type: "numeric",
            cellStyle: { padding: 1 },
            headerStyle: { padding: 1 },

        },
        { title: "Qty", field: "count", type: "numeric", },
    ]

    return (
        <div className="App">
            <Grid container spacing={1}>
                <Hidden smDown>
                    <Grid item md={2} />
                </Hidden>
                <Grid item xs={12} sm={6} md={4}>
                    <CharacterCard
                        onChange={setCharacter}
                        costTotal={costTotal} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <BuyItemCard
                        buyItem={buyItem} />
                </Grid>
                <Hidden smDown>
                    <Grid item md={1} />
                    <Grid item md={2} />
                </Hidden>
                <Grid item xs={12} md={8}>
                    <div>
                        {iserror &&
                            <Alert severity="error">
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>
                                })}
                            </Alert>
                        }
                    </div>
                    <Table
                        owned={owned}
                        removeItem={removeItem}
                        columns={Columns} />
                </Grid>
                <Hidden smDown>
                    <Grid item md={1}></Grid>
                    <Grid item md={2} />
                </Hidden>
                <Grid item xs={12} md={8}>
                    <ConsumedTable
                        consumed={consumed}
                        removeItem={unconsumeItem}
                        columns={Columns} />
                </Grid>
            </Grid >
        </div >
    )
}