import { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert';
import MaterialTable from "@material-table/core";

import ApiClient from './api-client'

export default function CharacterTable() {
    const [data, setData] = useState([]); //table data

    //for error handling
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const handleRowAdd = (newData, resolve) => {
        //validation
        let errorList = []
        if (newData.name === undefined) {
            errorList.push("Please enter character name")
        } if (errorList.length < 1) { //no error
            ApiClient.post("/characters/", newData, {
                headers: {
                    authorization: "bearer " + window.localStorage.getItem('authToken')
                }
            })
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
        ApiClient.delete("/characters/" + oldData.id, {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
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

    useEffect(() => {
        ApiClient.get("/characters/", {
            headers: {
                authorization: "bearer " + window.localStorage.getItem('authToken')
            }
        })
            .then(res => {
                setData(res.data.data)
            })
            .catch(error => {
                setErrorMessages(["Cannot load character data"])
                setIserror(true)
            })
    }, [])

    var columns = [
        { title: "id", field: "id", hidden: true },
        { title: "Character name", field: "name" },
    ]

    return (
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
                        title="Your Characters"
                        columns={columns}
                        data={data}
                        editable={{
                            onRowAdd: (newData) =>
                                new Promise((resolve) => {
                                    handleRowAdd(newData)
                                    resolve()
                                }),
                            onRowDelete: (oldData) =>
                                new Promise((resolve) => {
                                    handleRowDelete(oldData, resolve)
                                    resolve()
                                }),
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            search: false
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    
                </Grid>
            </Grid >
        </div >
    )
}