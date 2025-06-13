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
            return null;
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
        const max = 2 * Math.sqrt(phi(r)) * Math.log(n) | 0;
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

function test(n) {
    AKS.step5(n, AKS.step2(n));
}

// 最大公約数を求める
function gcd(a, b) {
    while (b != 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function modInv(a, n) {
    let t = 0, newT = 1;
    let r = n, newR = a;

    while (newR != 0) {
        let quotient = r / newR | 0;
        [t, newT] = [newT, t - quotient * newT];
        [r, newR] = [newR, r - quotient * newR];
    }

    if (r != 1) return null;
    return (t + n) % n;
}

function nCrModN(n, r) {
    if (r < 0 || r > n) return 0;
    if (r == 0 || r == n) return 1;

    r = r < n - r ? r : n - r;

    let numerator = 1;
    let denominator = 1;

    for (let i = 0; i < r; i++) {
        let num = n - i;
        let den = r - i;

        const g = gcd(num, den);
        num /= g;
        den /= g;

        numerator = (numerator * num) % n;
        denominator = (denominator * den) % n;
    }

    const inv = modInv(denominator, n);
    if (inv == null) {
        return 0;
    }

    return (numerator * inv) % n;
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

const primes = [
    2, 3, 5, 7, 11,
    13, 17, 19, 23, 29,
    31, 37, 41, 43, 47,
    53, 59, 61, 67, 71,
    73, 79, 83, 89, 97,
    101, 103, 107, 109, 113,
    127, 131, 137, 139, 149,
    151, 157, 163, 167, 173,
    179, 181, 191, 193, 197,
    199, 211, 223, 227, 229,
    233, 239, 241, 251, 257,
    263, 269, 271, 277, 281,
    283, 293, 307, 311, 313,
    317, 331, 337, 347, 349,
    353, 359, 367, 373, 379,
    383, 389, 397, 401, 409,
    419, 421, 431, 433, 439,
    443, 449, 457, 461, 463,
    467, 479, 487, 491, 499,
    503, 509, 521, 523, 541,
    547, 557, 563, 569, 571,
    577, 587, 593, 599, 601,
    607, 613, 617, 619, 631,
    641, 643, 647, 653, 659,
    661, 673, 677, 683, 691,
    701, 709, 719, 727, 733,
    739, 743, 751, 757, 761,
    769, 773, 787, 797, 809,
    811, 821, 823, 827, 829,
    839, 853, 857, 859, 863,
    877, 881, 883, 887, 907,
    911, 919, 929, 937, 941,
    947, 953, 967, 971, 977,
    983, 991, 997];
