import React from "react";
import CellComponent from "../cell-component/cell-component";
import { useState } from "react";
export default function BoardComponent({ board, setBoard, shipsReady, isMyBoard, canShoot, shoot }) {

    const boardClasses = ['board']
    const [shipDirection, setShipDirection] = useState('horizontal');
    console.log(board)

    if (canShoot) {
        boardClasses.push('active-shoot')
    }

    function addMark(x, y) {
        if (!shipsReady && isMyBoard) {
            // Используйте выбранное направление для расстановки кораблей
            if (shipDirection === 'horizontal') {
                board.addShip(x, y);
                board.addShip(x + 1, y);
                board.addShip(x + 2, y);
                board.addShip(x + 3, y);
            } else {
                board.addShip(x, y);
                board.addShip(x, y + 1);
                board.addShip(x, y + 2);
                board.addShip(x, y + 3);
            }
        } else if (canShoot && !isMyBoard) {
            shoot(x, y);
        }

        updateBoard();
    }

function updateBoard() {
    const newBoard = board.getCopyBoard()

    setBoard(newBoard)
}

    return (
        <div className={boardClasses.join(' ')}>
            {board.cells.map((row, index) => (
                <React.Fragment key={index}>
                    {row.map((cell) => (
                        <CellComponent key={cell.id} cell={cell} addMark={addMark} />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );
}
