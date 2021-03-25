import MaterialTable from "@material-table/core";

import Columns from './columns'

export default function ConsumedTable(props) {
    const columns = Columns
    const { consumed, removeItem } = props

    const onRemove = (oldData, consumed) => {
        removeItem(oldData, consumed)
    }
    return (
        <MaterialTable
            title="Items Consumed"
            columns={columns}
            data={consumed}
            actions={[
                {
                    icon: 'restore',
                    tooltip: 'Undo consume',
                    onClick: (_, rowData) => new Promise((resolve) => {
                        onRemove(rowData, true)
                        resolve()
                    }),
                }
            ]}
            options={{
                actionsColumnIndex: -1,
                rowStyle: (rowData, index) => {
                    if (index % 2) {
                        return { backgroundColor: "#333333" }
                    }
                }
            }}
        />
    )
}