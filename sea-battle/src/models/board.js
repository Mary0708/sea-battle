import React from 'react';
import Cell from './cell.tsx';

interface CellData {
    x: number;
    y: number;
    mark: string | null;
}

class Board extends React.Component<{}, { size: number; cells: CellData[][] }> {
    constructor(props: {}) {
        super(props);
        this.state = {
            size: 10,
            cells: this.initCells(10),
        };
    }

    initCells(size: number): CellData[][] {
        const cells: CellData[][] = [];
        for (let i = 0; i < size; i++) {
            const row: CellData[] = [];
            for (let j = 0; j < size; j++) {
                row.push({ x: j, y: i, mark: null });
            }
            cells.push(row);
        }
        return cells;
    }

    render() {
        return (
            <div className="board">
                {this.state.cells.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, cellIndex) => (
                            <Cell
                                key={cellIndex}
                                x={cell.x}
                                y={cell.y}
                                mark={cell.mark}
                            />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}

export default Board;
