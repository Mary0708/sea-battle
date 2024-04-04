import React, { useState } from "react";
import CellComponent from "../cell-component/cell-component";

export default function BoardComponent({ board, setBoard, shipsReady, isMyBoard, canShoot, shoot }) {
    const boardClasses = ['board'];

    const [occupiedCells, setOccupiedCells] = useState([]);
    const [shipDirection, setShipDirection] = useState('horizontal');
    const [soundEnabled, setSoundEnabled] = useState(true);

    function toggleSound() {
        setSoundEnabled(!soundEnabled);
    }

    function playExplosionSound() {
        if (soundEnabled) {
            const audio = new Audio();
            audio.src = '../../public/sounds/animeWowSound.mp3'
            audio.play();
        }
    }

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
        console.log('shipDirection:', shipDirection);
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
            playExplosionSound()
        }

        updateBoard();
    }

    function placeShip(x, y, length) {
        const isHorizontal = shipDirection === 'horizontal';

        // Проверка на перекрытие позиций и выход за границы доски
        for (let i = 0; i < length; i++) {
            const currentX = isHorizontal ? x + i : x;
            const currentY = isHorizontal ? y : y + i;

            if (
                !board.cells[currentX] ||
                !board.cells[currentX][currentY] ||
                occupiedCells.includes(`${currentX}-${currentY}`)
            ) {
                // Есть перекрывающийся корабль или выход за границы доски
                console.log('Невозможно разместить корабль. Перекрывающаяся позиция или выход за границы.');

                // Вывести предупреждение пользователю и выйти из функции
                alert('Невозможно разместить корабль в этой позиции.');
                return;
            }
        }

        // Если нет перекрытий, выхода за границы и пересечения кораблей, разместите корабль
        const newBoard = board.getCopyBoard();

        if (isHorizontal) {
            for (let i = 0; i < length; i++) {
                newBoard.addShip(x + i, y);
                setOccupiedCells(prevCells => [...prevCells, `${x + i}-${y}`]);
            }
        } else {
            for (let i = 0; i < length; i++) {
                newBoard.addShip(x, y + i);
                setOccupiedCells(prevCells => [...prevCells, `${x}-${y + i}`]);
            }
        }

        // Обновление remainingShips
        setRemainingShips(prevState => ({
            ...prevState,
            [String(length)]: prevState[length] - 1
        }));

        // Обновление доски после успешного размещения
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
