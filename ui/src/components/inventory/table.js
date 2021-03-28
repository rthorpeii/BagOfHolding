import MaterialTable from "@material-table/core";
import { useTheme } from '@material-ui/core/styles';

export default function Table(props) {
    const { owned, removeItem, columns } = props
    const theme = useTheme();

    const onRemove = (oldData, consumed) => {
        removeItem(oldData, consumed)
    }
    return (
        <MaterialTable
            title="Owned Items"
            columns={columns}
            data={owned}
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
                    tooltip: 'Consume',
                    onClick: (_, rowData) => new Promise((resolve) => {
                        onRemove(rowData, true)
                        resolve()
                    }),
                }
            ]}
            options={{
                actionsColumnIndex: -1,
                paging: false,
                rowStyle: (rowData, index) => {
                    if ((index + 1) % 2) {
                        return { backgroundColor: theme.palette.action.hover }
                    }
                },
                search: false,
            }}
        />
    )
}