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

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};


export default function InventoryTable() {

    const classes = useStyles();

    const [data, setData] = useState([]); //table data
    const [items, setItems] = useState([])    // Item data for predicting item fill
    const [characters, setCharacters] = useState([])
    const [selectedItem, setSelectedItem] = useState({})
    const [selectedCharacter, setSelectedCharacter] = useState({})
    const [costTotal, setCostTotal] = useState([])

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const sumCost = (items) => {
        setCostTotal([items.reduce((a, b) => a + (b.Item.cost * b.count || 0), 0)])
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
                console.log(res)
                setData(res.data.data)
                setIserror(false)
                sumCost(res.data.data)
            }).catch(error => {
                setErrorMessages(["Cannot purchase Item"])
                setIserror(true)
            })
    }

    const onItemAutofillChange = (event, values) => {
        setSelectedItem(values)
    }

    const onCharAutofillChange = async (event, values) => {
        console.log("Character selected: ", values)
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


    const handleRowDelete = (oldData) => {
        // No object has been selected yet.
        var payload = {
            "character_id": selectedCharacter.id,
            "item_id": selectedItem.ID
        }
        ApiClient.post("/sell/", payload, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                console.log("made it")
                const dataDelete = [...data];
                oldData.count--
                if (oldData.count === 0) {
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);
                }
                console.log("Finished?")
                sumCost(dataDelete)
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
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
                setData(res.data.data)
                sumCost(res.data.data)
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
                    <Card className={classes.root}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12} md={6}>
                                    <Autocomplete
                                        id="purchase-selection"
                                        options={items}
                                        getOptionLabel={(option) => option.Name}
                                        onChange={onItemAutofillChange}
                                        renderInput={(params) => <TextField {...params} label="Item to purchase" variant="outlined" />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
                                    <Button variant="contained"
                                        color="primary"
                                        onClick={buyItem}>
                                        Purchase
                                </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
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
                                Cost: {costTotal} gp
                            </Typography>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={false} sm={0} />
                <Grid item xs={false} sm={0} md={2} />
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
                        icons={tableIcons}
                        editable={{
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    handleRowDelete(oldData)
                                    resolve()
                                }),
                        }}
                        options={{
                            actionsColumnIndex: -1
                        }}
                    />
                </Grid>
                <Grid item xs={1}></Grid>
            </Grid >
        </div >
    )
}