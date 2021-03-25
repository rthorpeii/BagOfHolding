const Columns = [
    { title: "id", field: "id", hidden: true },
    { title: "user_id", field: "user_id", hidden: true },
    { title: "item_id", field: "user_id", hidden: true },
    { title: "Name", field: "Item.name" },
    { title: "Rarity", field: "Item.rarity" },
    { title: "Cost", field: "Item.cost", type: "numeric" },
    { title: "Count", field: "count", type: "numeric" },
]

export default Columns