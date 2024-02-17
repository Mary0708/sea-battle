import { useNavigate, useParams } from 'react-router-dom';
import { Board } from '../models/board';
import { useEffect, useState } from 'react';
import BoardComponent from '../components/board-component/board-component';
import ActionInfo from '../components/action-info/action-info';

const wss = new WebSocket('ws://localhost:4000')

export default function GameScreen() {
    const navigate = useNavigate();

    const params = useParams();
    const [friendName, setFriendName] = useState('');
    const [shipsReady, setChipsReady] = useState(false);
    const [canShoot, setCanShoot] = useState(false);
    const gameId = Number(params.id);

    const [shipDirection, setShipDirection] = useState('horizontal');
    const [myBoard, setMyBoard] = useState(new Board());
    const [friendBoard, setFriendBoard] = useState(new Board());

    function restart() {
        const newMyBoard = new Board();
        const newFriendBoard = new Board();
        newMyBoard.initCells();
        newFriendBoard.initCells();
        setMyBoard(newMyBoard);
        setFriendBoard(newFriendBoard);
    }

    function shoot(x, y) {
        if (wss.readyState === WebSocket.OPEN) {
            wss.send(JSON.stringify({ event: 'shoot', payload: { username: localStorage.name, x, y, gameId } }));
        } else {
            console.error('WebSocket connection is not open.');
        }
    }

    useEffect(() => {
        wss.send(JSON.stringify({ event: 'connect', payload: { username: localStorage.name, gameId } }));
        restart();

        return () => {
            wss.close();
        };
    }, []);


    wss.onmessage = function (response) {
        const { type, payload } = JSON.parse(response.data)
        const { username, x, y, canStart, friendName, success } = payload;

        switch (type) {
            case 'connectToPlay':

                if (!success) {
                    return navigate('/')
                }
                setFriendName(friendName)
                break;

            case 'readyToPlay':
                if (payload.username === localStorage.name && canStart) {
                    setCanShoot(true);
                }
                break;

            case 'afterShootByMe':
                if (username !== localStorage.name) {
                    const isPerfectHit = myBoard.cells[y][x].mark?.name === 'ship'
                    changeBoardAfterShoot(myBoard, setMyBoard, x, y, isPerfectHit)
                    wss.send(JSON.stringify({ event: 'checkShoot', payload: { ...payload, isPerfectHit } }))

                    if (!isPerfectHit) {
                        setCanShoot(true)
                    }
                }
                break;
            case 'isPerfectHit':
                if (username === localStorage.name) {
                    changeBoardAfterShoot(friendBoard, setFriendBoard, x, y, payload.isPerfectHit)
                    payload.isPerfectHit ? setCanShoot(true) : setCanShoot(false)
                }
                break;

            default:
                break;
        }
    }

    function changeBoardAfterShoot(board, setBoard, x, y, isPerfectHit) {
        isPerfectHit ? board.addDamage(x, y) : board.addMiss(x, y)
        const newBoard = board.getCopyBoard()
        setBoard(newBoard)
    }

    useEffect(() => {
        if (wss.readyState === WebSocket.OPEN) {
            wss.send(JSON.stringify({ event: 'connect', payload: { username: localStorage.name, gameId } }));
            restart();
        } else {
            console.error('WebSocket connection is not open.');
        }
    }, []);


    function ready() {
        wss.send(JSON.stringify({ event: 'ready', payload: { username: localStorage.name, gameId } }))
        setChipsReady(true)
    }

    return (
        <div>
            <p>ДОБРО ПОЖАЛОВАТЬ В ИГРУ </p>
            <div className="boards-container">
                <div className="message">Расставьте свои корабли</div>
                <div className="direction">
                <p className="horiz_p">
                    <input
                        type="radio"
                        className="horiz"
                        name="direction"
                        value="Горизонтально"
                        defaultChecked
                        onChange={() => setShipDirection('horizontal')}
                    />
                    <img className='image' src="/img/1_h.png" alt="Горизонтально" />
                </p>
                <p className="vertic_p">
                    <input
                        type="radio"
                        className="vertic"
                        name="direction"
                        value="Вертикально"
                        onChange={() => setShipDirection('vertical')}
                    />
                    <img className='image' src="/img/1_v.png" alt="Вертикально" />
                </p>
            </div>

                <div>
                    <p className="name">{localStorage.name}</p>
                    <BoardComponent
                        board={myBoard}
                        setBoard={setMyBoard}
                        shipsReady={shipsReady}
                        isMyBoard
                        canShoot={false}
                        shoot={shoot} />
                </div>
                <div>
                    <p className="name">{friendName || 'Неизвестный'}</p>
                    <BoardComponent
                        board={friendBoard}
                        setBoard={setFriendBoard}
                        shipsReady={shipsReady}
                        canShoot={canShoot}
                        shoot={shoot}
                    />
                </div>
                <ActionInfo
                    ready={ready}
                    canShoot={canShoot}
                    shipsReady={shipsReady}
                />
            </div>
        </div>
    );
}
