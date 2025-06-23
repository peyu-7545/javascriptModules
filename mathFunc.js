// mathFUnc.js

const mathFunc = {

    /**
     * ユークリッドの互除法で最大公約数を求める
     * @param {number} a 一つ目の数
     * @param {number} b 二つ目の数
     * @return 最大公約数
     */
    getGcd(a, b) {
        while (true) {
            let max = a > b ? a : b;
            let min = a == max ? b : a;
            let r = max % min;
            if (r == 0) return min;
            a = min;
            b = r;
        }
    },

    /**
     * 冪乗の剰余を返す
     * @param {number} a 底
     * @param {number} b 指数
     * @param {number} c 法
     * @return {number} a**b%c
     */
    modPow(a, b, c) {
        result = 1;
        a %= c;
        while (b > 0) {
            if (b % 2 == 1) {
                result = (result * a) % c;
            }
            a = (a * a) % c;
            b = b / 2 | 0;
        }
        return result;
    },

    /**
     * フェルマーテストで素数判定する
     * @param {number} n 判定したい数
     * @param {number} k 範囲(2~2+k)
     * @return 素数とみなされた割合
     */
    fermatTest(n, k) {
        if (!k || 2 + k >= n) k = n - 2

        let sosuu = 0;
        let tagainiso = 0;

        // 2以上2+k未満の数でテスト
        for (let i = 2; i < 2 + k; i++) {

            // 互いに素判定
            if (this.getGcd(n, i) == 1) {

                tagainiso++;

                // 素数判定
                if (this.modPow(i, n - 1, n) == 1) {
                    sosuu++;
                }
            }
        }

        // 素数とみなされた割合を返す
        return sosuu / tagainiso;
    },

    getDigitsArray(number, radix) {
        return number.toString(radix).split("").map(digit => parseInt(digit, radix));
    }
}

export { mathFunc };
