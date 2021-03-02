import MaterialTable from "@material-table/core";

import Columns from './columns'

export default function ConsumedTable(props) {
    const columns = Columns
    return (
        <MaterialTable
            title="Items Consumed"
            columns={columns}
            data={props.consumed}
            options={{
                actionsColumnIndex: -1
            }}
        />
    )
}