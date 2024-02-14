import { useParams } from 'react-router-dom';
import { Board } from '../models/board';
import { useEffect, useState } from 'react';
import BoardComponent from '../components/board-component/board-component';

export default function GameScreen() {
  const params = useParams();
  const [friendName, setFriendName] = useState('');
  const [shipsReady, setChipsReady] = useState(false);
  const [canShoot, setCanShoot] = useState(false);

  const gameId = Number(params.id);

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

  }

  useEffect(() => {
    restart();
  }, []);

  return (
    <div>
      <p>ДОБРО ПОЖАЛОВАТЬ В ИГРУ </p>
      <div className="boards-container">
      </div>

      <div>
        <p className="name">{localStorage.name}</p>
        <BoardComponent board={myBoard} setBoard={setMyBoard} shipsReady={shipsReady} isMyBoard canShoot={false} shoot={shoot} />
      </div>
      <div>
        <p className="name">{friendName || 'Неизвестный'}</p>
        <BoardComponent board={friendBoard} setBoard={setFriendBoard} shipsReady={shipsReady} isMyBoard={undefined} canShoot={canShoot} shoot={shoot} />
      </div>
    </div>
  );
}
