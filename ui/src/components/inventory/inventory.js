import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
<<<<<<< HEAD
||||||| bff9ccb
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

=======
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
>>>>>>> da4e5a665b1963f4555f25d212ed8aaf003cf483
import MaterialTable from "material-table";

import ApiClient from '../api-client'
import CharacterCard from './character-card'
import Alert from '@material-ui/lab/Alert';
import PurchaseCard from './purchase-card';


export default function InventoryTable() {
    const [data, setData] = useState([]); //table data
    const [consumed, setConsumed] = useState([]); //table data
    const [character, setCharacter] = useState({})
    const [costTotal, setCostTotal] = useState([])

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const sumCost = (owned, consumed) => {
        var ownedCost = [owned.reduce((a, b) => a + (b.Item.cost * b.count || 0), 0)]
        var consumedCost = [consumed.reduce((a, b) => a + (b.Item.cost * b.count || 0), 0)]
        setCostTotal(Number(ownedCost) + Number(consumedCost) / 2)
    }

    // updateItems takes the full inventory returned from the backend and
    // splits it between items currently owned (data) and items consumed (consumed)
    const updateItems = (items) => {
        var tempConsumed = []
        var tempOwned = []
        for (var i = 0; i < items.length; i++) {
            var item = items[i]
            if (item.consumed) {
                tempConsumed.push(item)
            } else {
                tempOwned.push(item)
            }
        }
        setData(tempOwned)
        setConsumed(tempConsumed)
        sumCost(tempOwned, tempConsumed)
    }

    const buyItem = (item) => {
        if (Object.keys(item).length === 0 && item.constructor === Object) {
            setErrorMessages(["Please Select an Item"])
            setIserror(true)
            return
        }
        if (Object.keys(character).length === 0 && character.constructor === Object) {
            setErrorMessages(["Please Select a Character"])
            setIserror(true)
            return
        }
        var payload = {
            "character_id": character.id,
            "item_id": item.ID
        }
        // Purchase the selected item
        ApiClient.post("/buy/", payload, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                updateItems(res.data.data)
                setIserror(false)
            }).catch(error => {
                setErrorMessages(["Cannot purchase Item"])
                setIserror(true)
            })
    }

    // Handles selling an item
    const removeItem = (oldData, consume) => {
        // Inconsistency in data fromt the inventory and the selected character
        if (oldData.character_id !== character.id) {
            setErrorMessages(["Delete failed! Character ID doesn't match Inventory ID"])
            setIserror(true)
            return
        }
        var payload = {
            "character_id": oldData.character_id,
            "item_id": oldData.item_id
        }
        // What endpoint should we post to
        var endpoint = ""
        if (consume === true) {
            endpoint = "/consume/"
        } else {
            endpoint = "/sell/"
        }
        ApiClient.post(endpoint, payload, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                if (consume) {
                    updateItems(res.data.data)
                    setIserror(false)
                } else {
                    const dataDelete = [...data];
                    oldData.count--
                    if (oldData.count === 0) {
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        updateItems([...dataDelete]);
                    }
                }
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error", error.error])
                setIserror(true)
            })
    }

    useEffect(() => {
        if (character == null || (Object.keys(character).length === 0 && character.constructor === Object)) {
            setErrorMessages(["Please Select a Character"])
            setIserror(true)
            return
        }
        ApiClient.get("/inventory/" + character.id, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                updateItems(res.data.data)
                setIserror(false)
            })
            .catch(error => {
                setErrorMessages(["Cannot load inventory data"])
                setIserror(true)
            })
    }, [character])
    useEffect(() => {
        let mounted = true
        if (mounted) {
            setIserror(false)
        }
        setErrorMessages([])
        return () => mounted = false;
    }, [])

    var columns = [
        { title: "id", field: "id", hidden: true },
        { title: "user_id", field: "user_id", hidden: true },
        { title: "item_id", field: "user_id", hidden: true },
        { title: "Item Name", field: "Item.name" },
        { title: "Cost", field: "Item.cost", type: "numeric" },
        { title: "Count", field: "count", type: "numeric" }
    ]

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
                <Grid item sm={12} md={8}>
                    <div>
                        {iserror &&
                            <Alert severity="error">
                                {errorMessages.map((msg, i) => {
                                    return <div key={i}>{msg}</div>
                                })}
                            </Alert>
                        }
                    </div>
                    <MaterialTable
                        title="Items Owned"
                        columns={columns}
                        data={data}
                        // icons={tableIcons}
                        editable={{
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    removeItem(oldData, false)
                                    resolve()
                                }),
                        }}
                        actions={[
                            {
                                icon: 'emoji_food_beverage',
                                tooltip: 'Consume Item',
                                onClick: (event, rowData) => new Promise((resolve) => {
                                    removeItem(rowData, true)
                                    resolve()
                                }),
                            }
                        ]}
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item sm={1} md={2} />
                <Grid item sm={12} md={8}>
                    <MaterialTable
                        title="Items Consumed"
                        columns={columns}
                        data={consumed}
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                </Grid>
            </Grid >
        </div >
    )
}