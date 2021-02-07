import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import EmojiFoodBeverageIcon from '@material-ui/icons/EmojiFoodBeverage';

import ApiClient from '../api-client'
import Alert from '@material-ui/lab/Alert';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
    },
    top: {
        display: "flex",
        flexDirection: "row"
    },
    mergecard: {
        flexDirection: "column",
        height: "100%",
    },
    gold: {
        paddingTop: '10px',
    }
}));


export default function InventoryTable() {

    const classes = useStyles();

    const [data, setData] = useState([]); //table data
    const [consumed, setConsumed] = useState([]); //table data
    const [items, setItems] = useState([])    // Item data for predicting item fill
    const [characters, setCharacters] = useState([])
    const [selectedItem, setSelectedItem] = useState({})
    const [selectedCharacter, setSelectedCharacter] = useState({})
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

    const buyItem = () => {
        if (Object.keys(selectedItem).length === 0 && selectedItem.constructor === Object) {
            setErrorMessages(["Please Select an Item"])
            setIserror(true)
            return
        }
        if (Object.keys(selectedCharacter).length === 0 && selectedCharacter.constructor === Object) {
            setErrorMessages(["Please Select a Character"])
            setIserror(true)
            return
        }
        // No object has been selected yet.
        var payload = {
            "character_id": selectedCharacter.id,
            "item_id": selectedItem.ID
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

    const onItemAutofillChange = (event, values) => {
        setSelectedItem(values)
    }

    const onCharAutofillChange = async (event, values) => {
        setSelectedCharacter(values)
    }

    const getItemNames = () => {
        ApiClient.get("/names/")
            .then(res => {
                setItems(res.data.items)
            })
            .catch(error => {
                setErrorMessages(["Cannot load item names"])
                setIserror(true)
            })
    }

    const getCharacters = () => {
        ApiClient.get("/characters/", {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                setCharacters(res.data.data)
                setSelectedCharacter(res.data.data[0])
            })
            .catch(error => {
                setErrorMessages(["Cannot load character names"])
                setIserror(true)
            })
    }

    // Handles selling an item
    const removeItem = (oldData, consume) => {
        // Inconsistency in data fromt the inventory and the selected character
        if (oldData.character_id !== selectedCharacter.id) {
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
        if (selectedCharacter == null || (Object.keys(selectedCharacter).length === 0 && selectedCharacter.constructor === Object)) {
            setErrorMessages(["Please Select a Character"])
            setIserror(true)
            return
        }
        ApiClient.get("/inventory/" + selectedCharacter.id, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                updateItems(res.data.data)
            })
            .catch(error => {
                setErrorMessages(["Cannot load inventory data"])
                setIserror(true)
            })
    }, [selectedCharacter])
    useEffect(() => {
        let mounted = true
        if (mounted) {
            setIserror(false)
        }
        setErrorMessages([])
        // Get item names for use in the purchase dropdown
        getItemNames()
        // Get the characters
        getCharacters()
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
                    <Card className={classes.mergecard}>
                        <CardContent>
                            <Autocomplete
                                id="character-selection"
                                value={selectedCharacter}
                                options={characters}
                                getOptionLabel={(option) => option.name}
                                onChange={onCharAutofillChange}
                                renderInput={(params) => <TextField {...params} label="Character" variant="outlined" />}
                            />
                            <Typography variant="h5" className={classes.gold}>
                                Inventory Cost: {costTotal} gp
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card className={classes.root}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={7}>
                                    <Autocomplete
                                        id="purchase-selection"
                                        options={items}
                                        getOptionLabel={(option) => option.Name}
                                        onChange={onItemAutofillChange}
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