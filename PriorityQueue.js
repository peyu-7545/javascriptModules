// 優先度付きキュー
class PriorityQueue {

    /**
     * @param {any[]} 初期要素
     * @param {String} compareProparty 比較するプロパティ名
     * @returns {PriorityQueue} 優先度付きキューのインスタンス
     */
    constructor(initalElement,compareProparty) {
        this.q = [];
        this.c = compareProparty;
        if (initalElement) {
            initalElement.forEach(e => {
                this.push(e);
            });
        }
    }

    /**
     * キューに要素を追加する
     * @param {Number} elm 追加する要素
     */
    push(elm) {

        // 最後に要素を追加する
        let index = this.q.length;
        this.q.push(elm);

        // 根に到達するまで
        while (index) {
            // 親
            const parent = (index - 1) / 2 | 0;

            // 親の方が小さければ入れ替える
            if (elm[this.c] > this.q[parent][this.c]) {
                this.q[index] = this.q[parent];
                this.q[parent] = elm;
                index = parent;
            } else {
                break;
            }
        }

        return this.q;
    }

    /**
     * 最大の要素をキューから取り出す
     * @returns {Number} 最大の要素
     */
    pop() {

        // 根だけのときはそのまま帰す
        if (this.size == 1) {
            return this.q.pop();
        }

        // 根と末端の葉
        const top = this.q[0];
        const end = this.q.pop();
        this.q[0] = end;
        let index = 0;

        while (true) {
            const leftChild = index * 2 + 1;
            const rightChild = index * 2 + 2;

            // 葉に到達
            if (this.q[leftChild] == undefined) {
                break;
            }

            // 大きい方
            let greatChild = -1;

            // 左の方が大きい、または右が存在しない
            if (this.q[rightChild] == undefined || this.q[leftChild][this.c] > this.q[rightChild][this.c]) {
                greatChild = leftChild;
            } else {
                greatChild = rightChild;
            }

            // 子の方が大きいならば入れ替える
            if (this.q[greatChild][this.c] > end[this.c]) {
                this.q[index] = this.q[greatChild];
                this.q[greatChild] = end;
                index = greatChild;
            } else {
                break;
            }
        }

        return top;
    }

    /**
     * @returns {Number} キューのサイズ
     */
    get size() {
        return this.q.length;
    }

    /**
     * @returns {Number} 根から葉の深さ
     */
    get depth() {
        const size = this.size;

        if (size) {
            return Math.log2(size) | 0;
        } else {
            // 木が存在しない
            return -1;
        }
    }
}

export default PriorityQueue;
/*
    典型的な優先度付きキューです
    例外処理などは特にやっていません
    複雑なメソッドやプロパティもありません
    最低限の構造のみを実装しています
*/
