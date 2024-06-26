import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Board } from "../models/board";
import { useEffect } from "react";
import BoardComponent from "../components/board-component/board-component";
import ActionInfo from "../components/action-info/action-info";

const wss = new WebSocket('ws://192.168.0.110:4000');

export default function GameScreen() {
    const navigate = useNavigate();
    const [friendName, setFriendName] = useState('');
    const [shipsReady, setShipsReady] = useState(false);
    const [canShoot, setCanShoot] = useState(false);
    const [opponentsReady, setOpponentsReady] = useState(false);
    const gameId = useParams();
    const [myBoard, setMyBoard] = useState(new Board());
    const [friendBoard, setFriendBoard] = useState(new Board());
    const [myShips, setMyShips] = useState([]);

    function restart() {
        const newMyBoard = new Board();
        const newFriendBoard = new Board();
        newMyBoard.initCells();
        newFriendBoard.initCells();
        setMyBoard(newMyBoard);
        setFriendBoard(newFriendBoard);
    }

    function shoot(x, y) {
        if (opponentsReady) {
            wss.send(
                JSON.stringify({
                    event: "shoot",
                    payload: { username: localStorage.name, x, y, gameId },
                })
            );
        } else {
            console.log("Нельзя стрелять, противник не готов");
        }
    }

    function updateShips(x, y) {
        setMyShips(prevShips => [...prevShips, { x, y }]);
    }

    useEffect(() => {
        wss.send(
            JSON.stringify({
                event: 'connect',
                payload: { username: localStorage.name, gameId },
            })
        );
        restart();
    }, []);

    wss.onmessage = function (response) {
        const { type, payload } = JSON.parse(response.data);
        const { username, x, y, canStart, friendName, success } = payload;

        switch (type) {
            case 'connectToPlay':
                if (!success) {
                    return navigate('/');
                }
                setFriendName(friendName);
                break;

            case 'readyToPlay':
                if (payload.username !== localStorage.name) {
                    setOpponentsReady(canStart);
                } else if (canStart) {
                    setCanShoot(true);
                }
                break;

            case 'afterShootByMe':
                if (username !== localStorage.name) {
                    const isPerfectHit = myBoard.cells[y][x].mark?.name === 'ship';
                    changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit);
                    updateShips(x, y);
                    wss.send(
                        JSON.stringify({
                            event: 'checkShoot',
                            payload: { ...payload, isPerfectHit },
                        })
                    );

                    if (!isPerfectHit) {
                        setCanShoot(true);
                    }
                }
                break;

            case 'isPerfectHit':
                if (username === localStorage.name) {
                    changeBoardAfterShoot(
                        friendBoard,
                        setFriendBoard,
                        x,
                        y,
                        payload.isPerfectHit
                    );
                    payload.isPerfectHit
                        ? setCanShoot(true)
                        : setCanShoot(false);
                }
                break;
            // case 'gameOver':
            //     console.log('Game over message received:', payload); // Добавим проверку в консоль
            //     if (payload.username === localStorage.name) {
            //         alert('К сожалению, вы проиграли.');
            //     } else {
            //         alert('Поздравляем! Вы выиграли!');
            //     }
            //     break;

            default:
                break;
        }
    };

    function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
        isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y);
        const newBoard = board.getCopyBoard();
        setBoard(newBoard);
    }

    function ready() {
        wss.send(
            JSON.stringify({
                event: 'ready',
                payload: { username: localStorage.name, gameId },
            })
        );
        setShipsReady(true);
    }

    return (
        <div className="fon">
            <p>ДОБРО ПОЖАЛОВАТЬ В ИГРУ </p>
            <div className="boards-container">
                <div className="message">Расставьте свои корабли</div>
                <div className="direction">
                    <p className="horiz_p">
                        <label>
                            <input
                                type="radio"
                                name="direction"
                                value="horizontal"
                            />
                            <img className='image' src="/img/1_h.png" alt="Горизонтально" />
                        </label>
                    </p>
                </div>
                <div className="boards-wrapper">
                    <div className="board-container large-board">
                        <p className="name">{localStorage.name}</p>
                        <BoardComponent
                            board={myBoard}
                            setBoard={setMyBoard}
                            shipsReady={shipsReady}
                            isMyBoard
                            canShoot={false}
                        />
                    </div>
                    <div className="board-container large-board">
                        <p className="name">{friendName ? friendName : 'Неизвестный'}</p>
                        <BoardComponent
                            board={friendBoard}
                            setBoard={setFriendBoard}
                            shipsReady={shipsReady}
                            canShoot={canShoot}
                            shoot={shoot}
                        />
                    </div>
                </div>
                <ActionInfo
                    ready={ready}
                    canShoot={canShoot && opponentsReady}
                    shipsReady={shipsReady}
                    opponentsReady={opponentsReady}
                />
            </div>
        </div>
    );
}
