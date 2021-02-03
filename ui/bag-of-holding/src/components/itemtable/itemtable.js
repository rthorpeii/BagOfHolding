import React, { useState, useContext, useEffect } from 'react';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid'

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
import AuthContext from '../authcontext'

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
        ApiClient.get("/items", {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                setData(res.data.data)
            })
            .catch(error => {
                setErrorMessages(["Cannot load item data"])
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
            {({ loggedIn, setLoggedIn }) => (
                <div className="App">
                    <Grid container spacing={1}>
                        <Grid item xs={1}></Grid>
                        <Grid item xs={10}>
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
                                icons={tableIcons}

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
                                    actionsColumnIndex: -1
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