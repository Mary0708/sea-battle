import React from "react";
import CellComponent from "../cell-component/cell-component";

export default function BoardComponent({ board, setBoard, shipsReady, isMyBoard, canShoot, shoot }) {

    const boardClasses = ['board']

    if (canShoot) {
        boardClasses.push('active-shoot')
    }
    function addMark(x, y) {

    }

    return (
        <div className={boardClasses.join(' ')}>
            {board.cells.map((row, index) => {
                <React.Fragment key={index}>
                    {row.map((cell) =>
                        <CellComponent key={cell.id} cell={cell} addMark={addMark} />)}
                </React.Fragment>;
            })}
        </div>
    );
}
