import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert';
import MaterialTable from "@material-table/core";

import AuthContext from '../authcontext'
import ApiClient from '../api-client'

export default function ItemTable() {

    const [data, setData] = useState([]); //table data

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        if (newData.name === undefined) {
            errorList.push("Please enter item name")
        } if (newData.type === undefined) {
            errorList.push("Please enter item type")
        } if (newData.rarity === undefined) {
            errorList.push("Please enter rarity")
        } if (newData.cost === undefined || newData.cost < 0) {
            errorList.push("Please enter a proper cost")
        } if (errorList.length < 1) { //no error
            ApiClient.post("/items", newData)
                .then(res => {
                    let dataToAdd = [...data];
                    newData.id = res.data.data.id
                    dataToAdd.push(newData);
                    setData(dataToAdd);
                    setErrorMessages([])
                    setIserror(false)
                })
                .catch(error => {
                    setErrorMessages(["Cannot add data. Server error!"])
                    setIserror(true)
                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
        }
    }

    const handleRowDelete = (oldData, resolve) => {
        ApiClient.delete("/items/" + oldData.id)
            .then(res => {
                const dataDelete = [...data];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setData([...dataDelete]);
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
                setIserror(true)
            })
    }

    const handleRowUpdate = (newData, oldData, resolve) => {  //validation
        let errorList = []
        if (newData.name === undefined) {
            errorList.push("Please enter item name")
        } if (newData.type === undefined) {
            errorList.push("Please enter item type")
        } if (newData.rarity === undefined) {
            errorList.push("Please enter rarity")
        } if (newData.cost === undefined || newData.cost < 0) {
            errorList.push("Please enter a proper cost")
        }

        if (errorList.length < 1) {
            ApiClient.patch("/items/" + newData.id, newData)
                .then(res => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);
                    setIserror(false)
                    setErrorMessages([])
                })
                .catch(error => {
                    setErrorMessages(["Update failed! Server error"])
                    setIserror(true)
                })
        } else {
            setErrorMessages(errorList)
            setIserror(true)
        }
    }


    useEffect(() => {
        ApiClient.get("/items")
            .then(res => {
                setData(res.data.data)
            })
            .catch(error => {
                setErrorMessages(["Cannot load item data", error.error])
                setIserror(true)
            })
    }, [])

    var columns = [
        { title: "id", field: "id", hidden: true },
        { title: "Item name", field: "name" },
        { title: "Type", field: "type" },
        { title: "Rarity", field: "rarity" },
        { title: "Cost", field: "cost", type: "numeric" }
    ]

    return (
        <AuthContext.Consumer>
            {({ loggedIn }) => (
                <div className="App">
                    <Grid container spacing={1}>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={12} sm={8}>
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
                                title="Defined Items"
                                columns={columns}
                                data={data}

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
                                    pageSizeOptions: [10, 25, 50, ],
                                }}
                            />
                        </Grid>
                        <Grid item xs={3}></Grid>
                    </Grid >
                </div >
            )}
        </AuthContext.Consumer>
    )
}