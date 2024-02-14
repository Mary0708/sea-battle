export default function CellComponent({cell, addMark }):  {
    const cellClasses = ['cell']

    cellClasses.push(cell?.mark?.color)

    return (
        <div className={cellClasses.join(' ')} onClick={() => addMark(cell.x, cell.y)}>

        </div>
    )
}
