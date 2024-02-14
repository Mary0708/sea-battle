import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [invitationGame, setInvitationGame] = useState();
    const [gameId, setGameId] = useState('')
    const [name, setName] = useState('')

    const navigate = useNavigate()

    const startPlay = (e) => {
        e.preventDefault()
        if (name && gameId) {
            localStorage.name = name;
            navigate('/game/' + gameId)
        }
    }

    return (
        <div>
            <h2>Авторизация</h2>
            <form onSubmit={startPlay}>
                <div className="field-group">
                    <div><label htmlFor="name">Ваше имя</label></div>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className='field-group'>
          <p>
            <input
              type='radio'
              name='typeEnter'
              id='gen'
              checked={!invitationGame}
              onChange={() => setInvitationGame(false)}
            />
          </p>
          <p>
            <label htmlFor='gen'>Создать игру</label>
            <input
              type='radio'
              name='typeEnter'
              id='ingame'
              checked={invitationGame}
              onChange={() => setInvitationGame(true)}
            />
            <label htmlFor='ingame'>Войти в игру по Id</label>
          </p>
        </div>
        <div className='field-group'>
          {invitationGame ? (
            <>
              <div>
                <label htmlFor='gameId'>Введите Id игры
                </label>
              </div>
              <input
                type='text'
                name='gameId'
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
              />
            </>
          ) : (
            <>
              <button
                className='btn-gen'
                onClick={(e) => {
                  e.preventDefault();
                  setGameId(Date.now());
                }}
              >
                Сгенерировать ID игры
              </button>
              <p>{gameId}</p>
            </>
          )}
        </div>
        <button type="submit" className="btn-ready">Играть</button> 
            </form>
        </div>
    )
}