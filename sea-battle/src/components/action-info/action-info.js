export default function ActionInfo( {shipsReady, canShoot, ready}) {
    
        if (!shipsReady) {
            return <button className="btn-ready" onClick={ready}>Корабли готовы</button>
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