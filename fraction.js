// 有理数(分数)

function gcd(a, b) {
    while (b = a % (a = b));
    return a;
}

class Fraction {

    /**
     * 有理数インスタンスを生成する
     * @param {Number} numerator 分子
     * @param {Number} denominator 分母
     * @throws 分子または分母が数値ではない場合
     */
    constructor(numerator, denominator) {

        // 非数値チェック
        if (Number.isNaN(numerator)) {
            throw new Error("分子は数値でなくてはなりません。");
        }
        if (Number.isNaN(denominator)) {
            throw new Error("分母は数値でなくてはなりません");
        }

        // 整数か
        let isIntN = true, isIntD = true;

        if (!Number.isFinite(numerator)) {

            // 分子が無限
            this.n = Math.sign(numerator);
            this.d = 0;
            return;

        } else if (!Number.isInteger(numerator)) {

            // 分子が非整数
            isIntN = false;
        }

        if (!Number.isFinite(numerator)) {

            // 分母が無限
            this.n = 0;
            this.d = Math.sign(numerator);
            return;

        } else if (!Number.isInteger(denominator)) {

            // 分母が非整数
            isIntN = false;
        }

        let f, g;
        switch (true) {

            case isIntN && isIntN:

                // どちらも整数
                g = 1 / gcd(numerator, denominator);
                this.n = numerator * g;
                this.d = denominator * g;
                break;

            case !isIntN && isIntD:

                // 分子が少数
                f = Fraction.toFraction(denominator);
                g = 1 / gcd(numerator, f.n);
                this.n = numerator * f.d * g;
                this.d = f.n * g;
                break;

            case isIntN && !isIntD:

                // 分母が少数
                f = Fraction.toFraction(denominator);
                g = 1 / gcd(numerator, f.n);
                this.n = numerator * f.d * g;
                this.d = f.n * g;
                break;

            default:

                // どちらも少数
                const nf = Fraction.toFraction(numerator);
                const df = Fraction.toFraction(denominator);
                g = 1 / (gcd(nf.n, df.n) * gcd(nf.d, df.d));
                this.n = nf.n * df.d * g;
                this.d = nf.d * df.n * g;
        }
    }

    /**
     * 約分
     */
    simplify() {
        const g = 1 / gcd(this.n, this.d);
        this.n *= g;
        this.d *= g;
    }

    add(target) {

        // 足す対象による
        if (target.constructor.name == "String") {
            // 数値
        } else if (target.constructor.name == "Fraction") {
            // 分数
        }
    }

    /**
     * 分数に変換する
     * @param {Number} num 変換する数
     * @return {Fraction} 分数インスタンス
     */
    static toFraction(num) {
        if (Number.isInteger(num)) {
            return new Fraction(num, 1);
        }
        // 小数点以下の桁数を調べる
        const decimalPart = num.toString().split(".")[1];
        const digit = 10 ** (decimalPart ? decimalPart.length : 0);
        const g = gcd(num * digit, digit);
        const m = digit / g;
        return new Fraction(num * m, m);
    }
}