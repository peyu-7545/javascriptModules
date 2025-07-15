// mat.js
// 自作の行列操作モジュール

/**
 * @typedef {Object} Mat 行列
 * @class 行列に関する演算と操作のクラス
 */
class Mat {

    /**
     * 行列を作成する
     * @param {Number[]} elements 行列の要素
     * @param {Number} rows 行の個数
     * @param {Number} cols 列の個数
     * @returns {Mat} 作成された行列
     */
    constructor(elements, rows, cols) {

        // 配列ではない場合
        if (!Array.isArray(elements) && !ArrayBuffer.isView(elements)) {
            console.error(`エラー`);
            return;
        }
        const size = rows * cols;

        /**
         * @type {Number[]} 行列の要素
         */
        this.elements = Array.from(elements.slice(0, size));

        /**
         * @type {Number} 行の個数
         */
        this.rows = rows;

        /**
         * @type {Number} 列の個数
         */
        this.cols = cols;

        /**
         * @type {Number} 要素の個数
         */
        this.size = size;

        /**
         * @type {Boolean} 正方行列か
         */
        this.isSquareMat = this.rows == this.cols;
    }

    /**
     * 指定した位置の要素を取得する
     * @param {Number} i i行目
     * @param {Number} j j列目
     * @returns {Number} i行j列目の要素
     */
    get(i, j) {
        return this.elements[this.cvtPosition(i, j)];
    }

    /**
     * 指定した位置の要素を更新する
     * @param {Number} i i行目
     * @param {Number} j j列目
     * @param {Number} value i行j列目にセットする値
     */
    set(i, j, value) {
        this.elements[this.cvtPosition(i, j)] = value;
    }

    /**
     * クローンを作成する
     * @returns {Mat} 自身のクローン
     */
    clone() {
        return new Mat(this.elements, this.rows, this.cols);
    }

    /**
     * 行を追加する
     * @param {Number[]} values 追加する要素
     */
    pushRow(values) {

        // 配列ではない場合
        if (!Array.isArray(values) && !ArrayBuffer.isView(values)) {
            console.error("エラー");
            return;
        }

        for (const v of values.slice(0, this.cols)) {
            this.elements.push(v);
        }

        this.rows++;
        this.size += this.cols;
        this.isSquareMat = this.rows == this.cols;
    }

    /**
     * インデックス指定で要素を取得する
     * @param {Number} index 取得したい要素のインデックス
     * @returns {Number} 指定されたインデックスの要素
     */
    getFromIndex(index) {
        return this.elements[index];
    }

    /**
     * 行列の位置表示からインデックスに変換する
     * @param {Number} i i行目
     * @param {Number} j j列目
     * @returns {Number} 要素のインデックス
     */
    cvtPosition(i, j) {

        if (i >= this.rows || j >= this.cols) {
            console.error(`エラー`);
            return;
        }

        return i * this.cols + j;
    }

    /**
     * インデックスから行列の位置表示に変換する
     * @param {Number} index インデックス
     * @returns {Number[]} 行列の位置表示
     */
    cvtIndex(index) {

        // 範囲外
        if (index >= this.size) {
            console.error(`エラー`);
            return;
        }

        return [index / this.cols | 0, index % this.cols];
    }

    /**
     * 行列を足す
     * @param {Mat} mat 足す行列
     * @returns {Mat} 2つの和の行列
     */
    add(mat) {

        if (this.rows != mat.rows || this.cols != mat.cols) {
            console.error("エラー");
            return;
        }

        const result = this.createZeroMat()

        for (let i = 0; i < this.size; i++) {
            result[i] = this.getFromIndex(i) + mat.getFromIndex(i);
        }

        return new Mat(result, this.rows, this.cols);
    }

    /**
     * 行列を引く
     * @param {Mat} mat 引く行列
     * @returns {Mat} 2つの差の行列
     */
    sub(mat) {

        if (this.rows != mat.rows || this.cols != mat.cols) {
            console.error("エラー");
            return;
        }

        const result = this.createZeroMat()

        for (let i = 0; i < this.size; i++) {
            result[i] = this.getFromIndex(i) - mat.getFromIndex(i);
        }

        return new Mat(result, this.rows, this.cols);
    }

    /**
     * 全ての要素に対して関数を実行する
     * @param {Function} func 実行する関数
     */
    map(func) {
        this.elements = this.elements.map(func);
    }

    /**
     * 同じサイズの、要素が全て0の行列を作成する
     * @returns {Mat} 要素が全て0の行列
     */
    createZeroMat() {
        return new Array(this.size).fill(0);
    }

    /**
     * スカラー倍
     * @param {Number} value かける数
     * @returns {Mat} スカラー倍された行列
     */
    scalar(value) {
        const result = this.createZeroMat()

        for (let i = 0; i < this.size; i++) {
            result[i] = this.getFromIndex(i) * value;
        }

        return new Mat(result, this.rows, this.cols);
    }

    /**
     * 行列をかける
     * @param {Mat} mat かける行列
     * @returns {Mat} 行列の積
     */
    prod(mat) {

        // 列と行が等しくない場合
        if (this.cols != mat.rows) {
            console.error(`エラー`);
            return;
        }

        const result = new Array(this.rows * mat.cols).fill(0);

        for (let i = 0; i < this.cols; i++) {
            let index = 0;
            for (let j = 0; j < this.rows; j++) {
                const num = this.get(j, i);
                for (let k = 0; k < mat.cols; k++) {
                    result[index++] += num * mat.get(i, k);
                }
            }
        }

        return new Mat(result, this.rows, mat.cols);
    }

    /**
     * 行列を二乗する
     * @returns {Mat} 二乗された行列
     */
    square() {
        if (!this.isSquareMat) {
            console.error("エラー");
            return;
        }

        const result = this.createZeroMat();

        let index = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                for (let k = 0; k < this.rows; k++) {
                    result[index] = this.get(i, k) * this.get(k, j);
                }
                index++;
            }
        }

        return new Mat(result.this.rows, this.cols);
    }

    /**
     * 行列の転置を得る
     * @returns {Mat} 転置行列
     */
    transpose() {

        const result = new Mat(new Array(this.size), this.cols, this.rows);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.cols; j++) {
                result.set(i, j, this.get(j, i));
            }
        }

        return result;
    }

    /**
     * 単位行列を作成する
     * @param {Number} rows 行の個数
     * @returns {Mat} 指定された行の個数の単位行列
     */
    static createIdentityMat(rows) {
        const identity = new Array(rows * rows).fill(0);
        for (let i = 0; i < rows; i++) {
            identity[i * (rows + 1)] = 1;
        }
        return new Mat(identity, rows, rows);
    }

    /**
     * 行列の要素を整形してコンソールに出力する
     */
    output() {
        let text = ``;

        if (this.rows == 1) {

            text = `[ ${this.elements.join(" ")} ]`;
        } else {

            for (let i = 0; i < this.rows; i++) {

                text += i == 0 ? `┏` : i == this.rows - 1 ? `┗` : `┃`;

                for (let j = 0; j < this.cols; j++) {
                    text += ` ` + this.get(i, j) + ` `;
                }

                text += (i == 0 ? `┓` : i == this.rows - 1 ? `┛` : `┃`) + `\n`;
            }
        }
        console.log(text);
    }

    /**
     * 特定の2つの行を入れ替える
     * @param {Number} row1 1つ目の行
     * @param {Number} row2 2つ目の行
     * @returns {Mat} 入れ替え後の行列
     */
    rowSwap(row1, row2) {

        // 範囲外
        if (row1 < 0 || row1 >= this.rows || row2 < 0 || row2 >= this.rows) {
            console.error("エラー");
            return;
        }

        for (let i = 0; i < this.cols; i++) {
            const temp = this.get(row1, i);
            this.set(row1, i, this.get(row2, i));
            this.set(row2, i, temp);
        }
    }

    /**
     * 特定の行のみをスカラー倍する
     * @param {Number} row 行
     * @param {Number} num かける数
     * @returns {Mat} スカラー倍した行列
     */
    rowMulti(row, num) {

        // 0倍
        if (num == 0) {
            console.error("エラー");
            return;
        }

        // 範囲外
        if (row < 0 || row >= this.rows) {
            console.error("エラー");
            return;
        }

        for (let i = 0; i < this.cols; i++) {
            const current = this.cvtPosition(row, i);
            this.elements[current] *= num;
        }
    }

    /**
     * 特定の行の何倍かを別の行に加える
     * @param {Number} row1 1つ目の行
     * @param {Number} row2 2つ目の行
     * @param {Number} num かける数
     * @returns {Mat} 計算後の行列
     */
    rowAddOtherMulti(row1, row2, num) {

        // 範囲外
        if (row1 < 0 || row1 >= this.rows || row2 < 0 || row2 >= this.rows) {
            console.error("エラー");
            return;
        }

        for (let i = 0; i < this.cols; i++) {
            const current = this.cvtPosition(row2, i);
            this.elements[current] += this.get(row1, i) * num;
        }
    }

    /**
     * 逆行列を求める
     * @returns {Mat} 逆行列
     * @description ガウス・ジョルダンの消去法を使用
     */
    inverse() {

        // 非正方行列
        if (!this.isSquareMat) {
            console.error(`エラー`);
            return;
        }

        const clone = new Mat([...this.elements], this.rows, this.cols);
        const result = Mat.createIdentityMat(this.rows);

        for (let i = 0; i < clone.rows; i++) {
            let temp = 1 / clone.get(i, i);
            clone.rowMulti(i, temp);
            result.rowMulti(i, temp);
            for (let j = 0; j < clone.rows; j++) {
                if (i == j) continue;
                temp = -clone.get(j, i);
                clone.rowAddOtherMulti(i, j, temp);
                result.rowAddOtherMulti(i, j, temp);
            }
        }

        return result;
    }

    /**
     * 特定の行の要素を配列として取得する
     * @param {Number} cols 取得したい行
     * @returns {Number[]} 特定の行の要素からなる配列
     */
    getCols(cols) {

        // 範囲外
        if (cols >= this.cols || cols < 0) {
            console.error("エラー");
            return;
        }

        const result = new Array(this.rows);

        for (let i = 0; i < this.rows; i++) {
            result[i] = this.get(i, cols);
        }

        return result;
    }
}

export default Mat;
