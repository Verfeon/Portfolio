export const GridCell = {
    EMPTY: 0,
    CIRCLE: 1,
    CROSS: 2
} as const;

type GridCell = typeof GridCell[keyof typeof GridCell];

export class Grid {
    private cells: GridCell[] = [
        GridCell.EMPTY, GridCell.EMPTY, GridCell.EMPTY,
        GridCell.EMPTY, GridCell.EMPTY, GridCell.EMPTY,
        GridCell.EMPTY, GridCell.EMPTY, GridCell.EMPTY
    ];
    private turn: GridCell = GridCell.CIRCLE;
    private nbTurns = 0;
    private gameEndedEmitter : GameEndedEmitter<{winner: GridCell}> = new GameEndedEmitter();
    private gameEnded = false;
    private winner : number = GridCell.EMPTY;
    private winningIndices = [-1, -1, -1];

    private checkWinner(): boolean {
        const winPatterns = [
            [0,1,2], [3,4,5], [6,7,8], // lines
            [0,3,6], [1,4,7], [2,5,8], // columns
            [0,4,8], [2,4,6]           // diagonales
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.cells[a] !== GridCell.EMPTY &&
                this.cells[a] === this.cells[b] &&
                this.cells[a] === this.cells[c]) {
                
                this.winner = this.cells[a];
                this.winningIndices = [a, b, c];
                return true;
            }
        }

        return false;
    }
    
    constructor() {
        this.onGameEnded(() => {
            this.gameEnded = true;
        });
    }

    public selectCell(x: number, y: number) : boolean {
        const index = y * 3 + x;

        if (this.cells[index] !== GridCell.EMPTY || this.gameEnded) {
            return false;
        }

        this.cells[index] = this.turn;
        this.nbTurns++;

        if (this.checkWinner()) {
            this.gameEndedEmitter.emit({winner: this.turn});
        } else if (this.nbTurns === this.cells.length) {
            this.gameEndedEmitter.emit({winner: 0});
        }
        
        this.turn = this.turn === GridCell.CIRCLE ? GridCell.CROSS : GridCell.CIRCLE;
        return true;
    }

    public getCells() : number[] {
        return this.cells;
    }

    public reset() : void {
        this.cells.fill(GridCell.EMPTY);
        this.turn = GridCell.CIRCLE;
        this.gameEnded = false;
        this.nbTurns = 0;
        this.winner = GridCell.EMPTY;
        this.winningIndices = [-1, -1, -1];
    }

    public getWinner() {
        return this.winner;
    }

    public getWinningIndices() : number[] {
        return this.winningIndices;
    }

    public onGameEnded(handler: (e: CustomEvent) => void) {
        this.gameEndedEmitter.on(({winner}) => {
            handler(new CustomEvent("gameEnded", {detail: {winner}}));
        });
    }
}

type Listener<T> = (payload: T) => void;
class GameEndedEmitter<T> {
    private listeners : Listener<T>[] = [];

    public on(listener: Listener<T>) {
        this.listeners.push(listener);
    }

    public emit(payload: T) {
        for (const listener of this.listeners) {
            listener(payload);
        }
    }
}