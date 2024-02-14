import React from 'react';

interface CellProps {
    x: number;
    y: number;
    mark: string | null;
}

class Cell extends React.Component<CellProps> {
    render() {
        const { x, y, mark } = this.props;
        return (
            <div className="cell">
                {mark}
            </div>
        );
    }
}

export default Cell;
