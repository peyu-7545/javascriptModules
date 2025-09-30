class Reversi {

    board = new Uint8Array(64);
    currentTurn;
    placedCells;
    isGaming = false;
    preWinner = null;

    init() {

        // 初期配置
        this.board.fill(0);
        this.board[28] = 1;
        this.board[35] = 1;
        this.board[27] = 2;
        this.board[36] = 2;

        // 値の初期化
        this.currentTurn = 1;
        this.placedCells = 4;
        this.index = 0;
        this.isGaming = true;
    }

    move(x, y) {

        // 既に埋まっているか
        if (this.getValue(x, y)) {
            console.log("そこには置けません");
            return;
        }

        // 裏返せるマスを取得
        const reversibles = this.getReversibles(x, y);

        // 裏返せるセルがない
        if (reversibles.length == 0) {
            console.log("そこには置けません");
            return;
        }

        // 裏返す
        this.board[this.calcIndex(x, y)] = this.currentTurn;
        reversibles.forEach(e => this.board[e] = this.currentTurn);

        // ターン反転
        this.changeTurn();

        // 出力
        this.output();

        // 全てのセルが置かれたか
        if (++this.placedCells == 64) {

            console.log(`全てのセルが埋まりました`);

            // ゲーム終了
            this.isGaming = false;
            this.gameEnd();
            return;
        }

        // パス判定
        if (this.isPath()) {

            console.log(`${this.currentTurnColor}はパスです`);
            this.changeTurn();

            // 相手もパス判定
            if (this.isPath()) {

                console.log(`${this.currentTurnColor}はパスです`);
                console.log(`両者とも置けません`);

                // ゲーム終了
                this.isGaming = false;
                this.gameEnd();
                return;
            }
        }

        // 次のターンへ
        console.log(`${this.currentTurnColor}の手番です`);
    }

    changeTurn() {
        this.currentTurn = 3 - this.currentTurn;
    }

    calcIndex(x, y) {
        return y * 8 + x;
    }

    getValue(x, y) {
        return this.board[y * 8 + x];
    }

    getTurnColor(turn) {
        return turn == 1 ? "黒" : "白";
    }

    get currentTurnColor() {
        return this.turn == 1 ? "黒" : "白";
    }

    getReversibles(x, y) {

        const reversibles = [];
        let index = 0;

        // 各方向に調べる
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {

                if (!dx && !dy) continue;

                const temp = index;

                let cx = x + dx;
                let cy = y + dy;

                while (true) {

                    // 範囲外
                    if (cx < 0 || 7 < cx || cy < 0 || 7 < cy) {
                        index = temp;
                        break;
                    }

                    const currentValue = this.getValue(cx, cy);

                    if (currentValue == this.currentTurn) {
                        // 仲間セル、ループ終了
                        break;
                    } else if (currentValue == 3 - this.currentTurn) {
                        // 敵のセル、候補に追加
                        reversibles[index++] = this.calcIndex(cx, cy);
                        cx += dx;
                        cy += dy;
                    } else {
                        // 空白セル、候補を破棄
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
                if (this.getValue(x, y)) continue;
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
        if (winner) {
            console.log(`勝者は${this.getTurnColor(winner)}です`);
        } else {
            console.log(`引き分けです`);
        }
    }

    getWinner() {
        let black = 0;
        let white = 0;
        this.board.forEach(e => {
            e == 1 ? black++ : white++;
        });
        return black > white ? 1 : black < white ? 2 : 0;
    }

    output() {
        let a = "\\01234567";
        for (let y = 0; y < 8; y++) {
            a += `\n${y}`;
            for (let x = 0; x < 8; x++) {
                a += "-■□"[this.getValue(x, y)];
            }
        }
        console.log(a);
    }
}

export default Reversi;