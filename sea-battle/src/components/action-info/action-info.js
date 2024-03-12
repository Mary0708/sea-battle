export default function ActionInfo( {shipsReady, canShoot, ready, opponentsReady}) {
    
        if (!shipsReady) {
            return <button className="btn-ready" onClick={ready}>Корабли готовы</button>
        } else if (!opponentsReady) {
            return <p>Ждем соперника</p>
        }
        
        return (
            <div>
                {
                    canShoot ?
                    <p>Стреляй</p> :
                    <p>Выстрел соперника</p>
                }
            </div>
    );
}