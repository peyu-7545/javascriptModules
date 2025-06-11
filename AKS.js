// https://ja.wikipedia.org/wiki/AKS%E7%B4%A0%E6%95%B0%E5%88%A4%E5%AE%9A%E6%B3%95

const AKS = {

    // nが累乗数か判定する。累乗数なら合成数のためfalseを返す
    step1(n) {
        const max = Math.log2(n);
        for (let i = 2; i <= max; i++) {
            const num = Math.pow(n, 1 / i);
            if (Number.isInteger(num)) {
                return false;
            }
        }
        return true;
    },

    // o(n)>4*log^2(n)を満たす最小のrを求める
    step2(n) {
        let r = 2;
        const log = Math.log(n);
        const num = 4 * log * log;
        while (true) {
            if (this.order(n, r) > num) {
                return r;
            }
            r++;
        }
    },

    // n^e≡1(mod r)を満たす最小のe(nの位数)を求める
    order(n, r) {
        let i = 1;
        if (r == 1 || gcd(n, r) != 1) {
            return undefined;
        }
        while (true) {
            if (pow(n, i, r) == 1) {
                return i;
            }
            i++;
        }
    },

    // あるa<rに対して1<gcd(a,n)<nならばnは合成数である
    step3(n, r) {
        for (let i = 2; i <= r; i++) {
            const num = gcd(i, n);
            if (1 < num && num < n) {
                return false;
            }
        }
        return true;
    },

    // ToDo:step5を完成させる
    step5(n, r) {
    },

    main(n) {
        if (!this.step1(n)) {
            return `合成数`;
        }
        const r = this.step2(n);
        if (!this.step3(n, r)) {
            return `合成数`;
        }
        if (n <= r) {
            return `素数`;
        }
        // step5
        return `わかりません`;
    }
}

// 最大公約数を求める
function gcd(a, b) {
    while (true) {
        let max = a > b ? a : b;
        let min = a == max ? b : a;
        let r = max % min;
        if (r == 0) return min;
        a = min;
        b = r;
    }
}

// n^kをrで割った余りを求める
// pythonのpowみたいなやつ
function pow(n, k, r) {
    let result = 1;
    n %= r;
    while (k > 0) {
        if (k % 2 == 1) {
            result = (result * n) % r;
        }
        n = (n * n) % r;
        k = k / 2 | 0;
    }
    return result;
}

// オイラーのΦ関数
function phi(n) {
    let result = 0;
    for (let i = 1; i <= n; i++) {
        if (gcd(i, n) == 1) {
            result++;
        }
    }
    return result;
}