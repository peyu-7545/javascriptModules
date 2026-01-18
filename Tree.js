class Tree {

    /*
     * 次の要素を持つ
     * rootへの参照
     * nodeの総数
     * leafの総数
     * 最小深さ
     * 最大深さ
     * キャッシュするか
     */
}

class Node {

    /**
     * 木のノード
     * @param {any} element ノードに格納する要素
     */
    constructor(element) {

        /** @property {any} ノードが持つ要素 */
        this.element = element;

        /** @property {Node|null} 親ノード */
        this.parent = null;

        /** @property {Node[]} 子ノード */
        this.children = [];
    }

    /** 
     * ノードの属性を調べる
     * @return {String} 'root' or 'branch' or 'leaf'
     */
    type() {

        if (this.parent == null) {
            return 'root';
        }

        if (this.children.length == 0) {
            return 'leaf';
        }

        return 'branch';
    }

    /**
     * 深さ(根までの距離)を親ノードをたどって数える
     * @return {Number} 深さ
     */
    depth() {

        if (this.type() == 'root') {
            return 0;
        }

        let depth = 0;
        let currentNode = this;

        while (currentNode.type() != 'root') {
            currentNode = currentNode.parent();
            depth++;
        }

        return depth;
    }
}