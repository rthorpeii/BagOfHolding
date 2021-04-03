import MaterialTable from "@material-table/core";
import { Grid, Hidden, TextField, Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useState, useEffect } from 'react';

import AuthContext from '../authcontext'
import ApiClient from '../api-client'

export default function ItemTable() {
    const [items, setItems] = useState([]);
    const [displayError, setDisplayError] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const handleRowAdd = (newItem, resolve) => {
        //validation
        let errorList = []
        if (newItem.name === undefined) {
            errorList.push("Please enter item name")
        } if (newItem.type === undefined) {
            errorList.push("Please enter item type")
        } if (newItem.rarity === undefined) {
            errorList.push("Please enter rarity")
        } if (newItem.cost === undefined || newItem.cost < 0) {
            errorList.push("Please enter a proper cost")
        } if (errorList.length < 1) {
            ApiClient.post("/items", newItem)
                .then(res => {
                    setItems(items.concat(res.data.data));
                    setDisplayError(false)
                })
                .catch(error => {
                    setErrorMessages(["Cannot add data. Server error!"])
                    setDisplayError(true)
                })
        } else {
            setErrorMessages(errorList)
            setDisplayError(true)
        }
    }

    const handleRowDelete = (oldData, resolve) => {
        ApiClient.delete("/items/" + oldData.id)
            .then(res => {
                setItems(items.filter((item) => item.id !== oldData.id));
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
                setDisplayError(true)
            })
    }

    const handleRowUpdate = (newData, oldData, resolve) => {  //validation
        let errorList = []
        if (newData.name === undefined || newData.name === "") {
            errorList.push("Please enter item name")
        } if (newData.type === undefined || newData.type === "") {
            errorList.push("Please enter item type")
        } if (newData.rarity === undefined || newData.rarity === "") {
            errorList.push("Please enter rarity")
        } if (newData.cost === undefined || newData.cost < 0  || isNaN(newData.cost)) {
            errorList.push("Please enter a proper cost")
        }
        console.log(newData.cost)
        if (errorList.length < 1) {
            ApiClient.patch("/items/" + newData.id, newData)
                .then(res => {
                    const dataUpdate = [...items];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setItems([...dataUpdate]);
                    setDisplayError(false)
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    setDisplayError(true)
                })
        } else {
            setErrorMessages(errorList)
            setDisplayError(true)
        }
    }

    useEffect(() => {
        ApiClient.get("/items")
            .then(res => {
                setItems(res.data.items)
            })
            .catch(error => {
                setErrorMessages(["Cannot load item data", error.error])
                setDisplayError(true)
            })
    }, [])

    var columns = [
        { title: "id", field: "id", hidden: true },
        {
            title: "Name", field: "name",
            render: rowData => (
                <div>{rowData.name} <br />
                    <Typography variant="caption" display="block" gutterBottom>{rowData.type}</Typography>
                </div>
            ),
            validate: (rowData) =>  {
                if (rowData.name === ''){
                    return 'Type cannot be empty'
                }
                return ''
            },
            editComponent: (props) => {
                return (
                    <div>
                        <TextField
                            label="Name"
                            size="xsmall"
                            defaultValue={props.value}
                            placeholder="Name"
                            onChange={(e) => props.onChange(e.target.value)}
                        />
                        <TextField
                            label="Type"
                            size="small"
                            defaultValue={props.rowData.type}
                            placeholder="Type"
                            onChange={(e) => props.rowData.type = e.target.value}
                        />
                    </div>

                );
            },

        },
        { title: "Type", field: "type", hidden: true },
        { title: "Rarity", field: "rarity", },
        { title: "Cost", field: "cost", type: "numeric" }
    ]

    return (
        <Grid container spacing={1}>
            <Hidden smDown>
                <Grid item md={2} />
            </Hidden>
            <Grid item xs={12} md={8}>
                <div>
                    {displayError &&
                        <Alert severity="error">
                            {errorMessages.map((msg, i) => {
                                return <div key={i}>{msg}</div>
                            })}
                        </Alert>
                    }
                </div>
                <AuthContext.Consumer>
                    {({ loggedIn }) => (
                        <MaterialTable
                            title="Defined Items"
                            columns={columns}
                            data={items}
                            editable={{
                                onRowUpdate: loggedIn ? (newData, oldData) =>
                                    new Promise((resolve) => {
                                        handleRowUpdate(newData, oldData, resolve);
                                        resolve()
                                    }) : null,
                                onRowAdd: loggedIn ? (newData) =>
                                    new Promise((resolve) => {
                                        handleRowAdd(newData)
                                        resolve()
                                    }) : null,
                                onRowDelete: loggedIn ? (oldData) =>
                                    new Promise((resolve) => {
                                        handleRowDelete(oldData, resolve)
                                        resolve()
                                    }) : null,
                            }}
                            options={{
                                actionsColumnIndex: -1,
                                pageSize: 10,
                                pageSizeOptions: [10, 25, 50,],
                            }}
                        />
                    )}
                </AuthContext.Consumer>
            </Grid>
            <Hidden smDown>
                <Grid item md={8} />
            </Hidden>
        </Grid >
    )
}