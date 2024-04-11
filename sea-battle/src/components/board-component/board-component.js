import React, { useState } from "react";
import CellComponent from "../cell-component/cell-component";

export default function BoardComponent({ board, setBoard, shipsReady, isMyBoard, canShoot, shoot, handleDirectionChange }) {
    const boardClasses = ['board'];

    const [occupiedCells, setOccupiedCells] = useState([]);
    const [shipDirection, setShipDirection] = useState('horizontal');

    const [remainingShips, setRemainingShips] = useState({
        '4': 1,
        '3': 2,
        '2': 3,
        '1': 4
    });

    if (canShoot) {
        boardClasses.push('active-shoot');
    }

    function addMark(x, y) {
        if (!shipsReady && isMyBoard) {
            if (remainingShips['4'] > 0) {
                placeShip(x, y, 4);
            } else if (remainingShips['3'] > 0) {
                placeShip(x, y, 3);
            } else if (remainingShips['2'] > 0) {
                placeShip(x, y, 2);
            } else if (remainingShips['1'] > 0) {
                placeShip(x, y, 1);
            }
        } else if (canShoot && !isMyBoard) {
            shoot(x, y);
        }

        updateBoard();
    }

    function placeShip(x, y, length) {
        const isHorizontal = shipDirection === 'horizontal';
        const isVertical = shipDirection === 'vertical';
    
        for (let i = 0; i < length; i++) {
            const currentX = isHorizontal ? x + i : x;
            const currentY = isVertical ? y + i : y;
    
            if (
                !board.cells[currentX] ||
                !board.cells[currentX][currentY] ||
                occupiedCells.includes(`${currentX}-${currentY}`)
            ) {
                console.log('Невозможно разместить корабль. Перекрывающаяся позиция или выход за границы.');
                alert('Невозможно разместить корабль в этой позиции.');
                return;
            }
        }
    
        const newBoard = board.getCopyBoard();
    
        for (let i = 0; i < length; i++) {
            const currentX = isHorizontal ? x + i : x;
            const currentY = isVertical ? y + i : y;
            newBoard.addShip(currentX, currentY);
            setOccupiedCells(prevCells => [...prevCells, `${currentX}-${currentY}`]);
        }
    
        setRemainingShips(prevState => ({
            ...prevState,
            [String(length)]: prevState[length] - 1
        }));
    
        setBoard(newBoard);
    }    

    function updateBoard() {
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
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
