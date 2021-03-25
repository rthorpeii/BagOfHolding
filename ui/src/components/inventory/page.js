import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert';

import ApiClient from '../api-client'
import CharacterCard from './character-card'
import ConsumedTable from './consumed-table'
import PurchaseCard from './purchase-card';
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

    const theme = useTheme();
    var sizeMatches = useMediaQuery(theme.breakpoints.down("xs"))
    const Columns = [
        { title: "id", field: "id", hidden: true },
        { title: "user_id", field: "user_id", hidden: true },
        { title: "item_id", field: "user_id", hidden: true },
        { title: "Name", field: "Item.name" },
        { title: "Rarity", field: "Item.rarity", hidden: sizeMatches },
        { title: "Cost", field: "Item.cost", type: "numeric" },
        { title: "Count", field: "count", type: "numeric" },
    ]

    // Validates that a character is selected
    const validateCharacter = () => {
        if (Object.keys(character).length === 0 && character.constructor === Object) {
            setErrorMessages(["Please Select a Character"])
            setIserror(true)
            return false
        }
        return true
    }

    // Handles purchasing an item
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
        // Purchase the selected item
        ApiClient.post("/buy/", payload)
            .then(res => {
                setOwned(res.data.owned)
                setConsumed(res.data.consumed)
                setIserror(false)
            }).catch(error => {
                setErrorMessages(["Cannot purchase Item"])
                setIserror(true)
            })
    }

    // Handles selling an item
    const removeItem = (oldData, consume) => {
        var payload = {
            "character_id": oldData.character_id,
            "item_id": oldData.item_id
        }
        // What endpoint should we post to
        var endpoint = "/sell/"
        if (consume === true) {
            endpoint = "/consume/"
        }
        ApiClient.post(endpoint, payload)
            .then(res => {
                setOwned(res.data.owned)
                setConsumed(res.data.consumed)
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

    // Set the error message to false on init
    useEffect(() => {
        let mounted = true
        if (mounted) {
            setIserror(false)
            setErrorMessages([])
        }
        return () => mounted = false;
    }, [])

    // Update the cost of the inventory when owned/consumed is updated
    useEffect(() => {
        console.log(owned)
        let mounted = true
        var ownedCost = [owned.reduce((a, b) => a + (b.Item.cost * b.count || 0), 0)]
        var consumedCost = [consumed.reduce((a, b) => a + (b.Item.cost * b.count || 0), 0)]
        if (mounted) {
            setCostTotal(Number(ownedCost) + Number(consumedCost))
        }
        return () => mounted = false;
    }, [owned, consumed])

    return (
        <div className="App">
            <Grid container spacing={1}>
                <Grid item sm={12} md={2} />
                <Grid item xs={12} sm={6} md={4}>
                    <CharacterCard
                        onChange={setCharacter}
                        costTotal={costTotal} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <PurchaseCard
                        buyItem={buyItem} />
                </Grid>
                <Grid item sm={1} />
                <Grid item sm={1} md={2} />
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
                <Grid item xs={1}></Grid>
                <Grid item sm={1} md={2} />
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