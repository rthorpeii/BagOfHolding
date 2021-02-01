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

import axios from 'axios'
import Alert from '@material-ui/lab/Alert';
import { Button, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    root: {
    },
    details: {
        display: "flex",
        flexDirection: "row",
    },
}));


const api = axios.create({
    baseURL: `http://localhost:8080/`
})

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
    const [selected, setSelected] = useState({})
    const [costTotal, setCostTotal] = useState([])

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const sumCost = (items) => {
        setCostTotal([items.reduce((a, b) => a + (b.Item.cost * b.count || 0), 0)])
    }

    const buyItem = () => {
        // No object has been selected yet.
        if (Object.keys(selected).length === 0 && selected.constructor === Object) {
            setErrorMessages(["Please Select an Item"])
            setIserror(true)
            return
        }
        // Purchase the selected item
        api.post("/buy/", { "item_id": selected.ID }, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                console.log(res)
                setData(res.data.data)
                setIserror(false)
                sumCost(res.data.data)
            })
    }

    const onAutofillChange = (event, values) => {
        setSelected(values)
    }

    const getItemNames = () => {
        api.get("/names/")
            .then(res => {
                setItems(res.data.items)
            })
            .catch(error => {
                setErrorMessages(["Cannot load item names"])
                setIserror(true)
            })
    }

    const getInventory = () => {
        api.get("/inventory/", {
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
    }

    const handleRowDelete = (oldData) => {
        api.post("/sell/", { "item_id": oldData.item_id }, {
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
        // Load the inventory Data
        getInventory()
        // Get item names for use in the purchase dropdown
        getItemNames()
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
            <Grid container spacing={3}>
                <Grid item xs={2} />
                <Grid item xs={4}>
                    <Card className={classes.root}>
                        <CardHeader title="Purchase an Item" />
                        <div className={classes.details}>
                            <CardContent>
                                <Autocomplete
                                    id="purchase-selection"
                                    options={items}
                                    getOptionLabel={(option) => option.Name}
                                    style={{ width: 300 }}
                                    onChange={onAutofillChange}
                                    renderInput={(params) => <TextField {...params} label="Item to purchase" variant="outlined" />}
                                />
                            </CardContent>
                            <CardContent>
                                <Button variant="contained"
                                    color="primary"
                                    onClick={buyItem}>
                                    Purchase
                                </Button>
                            </CardContent>
                        </div>
                    </Card>

                </Grid>
                <Grid item xs={4}>
                    <Card>
                        <CardHeader title="Inventory Total Cost" />
                        <div className={classes.details}>
                            <CardContent>
                                <Typography variant="h4">{costTotal}</Typography>
                            </CardContent>
                        </div>
                    </Card>
                </Grid>
                <Grid item xs={1} />
                <Grid item xs={2} />
                <Grid item xs={8}>
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