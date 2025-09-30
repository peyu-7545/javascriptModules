class Reversi {
    board = new Uint8Array(64);
    currentTurn;
    placedCells;
    isGaming = false;
    preWinner = null;

    init() {

        this.board.fill(0);
        this.board[28] = 1;
        this.board[35] = 1;
        this.board[27] = 2;
        this.board[36] = 2;

        this.currentTurn = 1;
        this.placedCells = 4;
        this.index = 0;
        this.isGaming = true;
    }

    move(x, y) {

        if (this.board[y * 8 + x]) return;

        const reversibles = this.getReversibles(x, y);

        if (!reversibles.length) return;

        this.board[y * 8 + x] = this.currentTurn;
        reversibles.forEach(e => this.board[e] = this.currentTurn);

        this.currentTurn = 3 - this.currentTurn;

        if (++this.placedCells == 64) {
            this.isGaming = false;
            this.gameEnd();
            return;
        }

        if (this.isPath()) {
            this.currentTurn = 3 - this.currentTurn;

            if (this.isPath()) {
                this.isGaming = false;
                this.gameEnd();
                return;
            }
        }
    }

    getReversibles(x, y) {

        const reversibles = [];
        let index = 0;

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {

                if (!dx && !dy) continue;

                const temp = index;

                let cx = x + dx;
                let cy = y + dy;

                while (true) {

                    if (cx < 0 || 7 < cx || cy < 0 || 7 < cy) {
                        index = temp;
                        break;
                    }

                    const currentValue = this.board[cy * 8 + cx];

                    if (currentValue == this.currentTurn) {
                        break;
                    } else if (currentValue == 3 - this.currentTurn) {
                        reversibles[index++] = cy * 8 + cx;
                        cx += dx;
                        cy += dy;
                    } else {
                        index = temp;
                        break;
                    }
                }
            }
        }
        return reversibles;
    }

    isPath() {
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                if (this.board[y * 8 + x]) continue;
                if (this.getReversibles(x, y).length) {
                    return false;
                }
            }
        }
        return true;
    }

    gameEnd() {
        const winner = this.getWinner();
        this.preWinner = winner;
    }

    getWinner() {
        let black = 0;
        let white = 0;
        this.board.forEach(e => {
            e == 1 ? black++ : white++;
        });
        return black > white ? 1 : black < white ? 2 : 0;
    }
}

export default Reversi;