import MaterialTable from "material-table";

import Columns from './columns'

export default function ConsumedTable(props) {
    return (
        <MaterialTable
            title="Items Consumed"
            columns={Columns}
            data={props.consumed}
            options={{
                actionsColumnIndex: -1
            }}
        />
    )
}