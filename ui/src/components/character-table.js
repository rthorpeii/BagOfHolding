import Grid from '@material-ui/core/Grid'
import Alert from '@material-ui/lab/Alert';
import MaterialTable from "@material-table/core";
import { useState, useEffect } from 'react';

import ApiClient from './api-client'

export default function CharacterTable() {
    const [characters, setCharacters] = useState([]);
    const [iserror, setIserror] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    const handleRowAdd = (newCharacter, resolve) => {
        if (newCharacter.name === undefined) {
            setErrorMessages(["Please enter character name"])
            setIserror(true)
            return
        }
        ApiClient.post("/characters/", newCharacter)
            .then(res => {
                setCharacters(characters.concat(res.data.character));
                setIserror(false)
            })
            .catch(error => {
                setErrorMessages(["Cannot add data. Server error!" + error])
                setIserror(true)
            })
    }

    const handleRowDelete = (oldData, resolve) => {
        ApiClient.delete("/characters/" + oldData.id)
            .then(res => {
                const dataDelete = [...characters];
                const index = oldData.tableData.id;
                dataDelete.splice(index, 1);
                setCharacters([...dataDelete]);
                setErrorMessages([])
            })
            .catch(error => {
                setErrorMessages(["Delete failed! Server error"])
                setIserror(true)
            })
    }

    useEffect(() => {
        ApiClient.get("/characters/")
            .then(res => {
                setCharacters(res.data.characters)
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
                        data={characters}
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
                            paging: false,
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