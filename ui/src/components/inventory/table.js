import MaterialTable from "@material-table/core";

import Columns from './columns'

export default function Table(props) {
    const columns = Columns
    const {owned, removeItem} = props
    
    const onRemove = (oldData, consumed) => {
        removeItem(oldData, consumed)
    }
    return (
        <MaterialTable
            title="Items Owned"
            columns={columns}
            data={owned}
            // icons={tableIcons}
            editable={{
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        onRemove(oldData, false)
                        resolve()
                    }),
            }}
            actions={[
                {
                    icon: 'emoji_food_beverage',
                    tooltip: 'Consume Item',
                    onClick: (_, rowData) => new Promise((resolve) => {
                        onRemove(rowData, true)
                        resolve()
                    }),
                }
            ]}
            options={{
                actionsColumnIndex: -1
            }}
        />
    )
}