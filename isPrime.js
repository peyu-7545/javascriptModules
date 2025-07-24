function isPrime(n) {
    const max = Math.sqrt(n) | 0;
    for (let i = 2; i <= max; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

function k(n) {
    if (n % 2) {
        if (n < 32) {
            const num = 32 - n;
            if (isPrime(num)) {
                return [2, num];
            } else {
                return false;
            }
        } else {
            const num = n + 2;
            const sr5 = Math.round(num ** 0.2);
            if (sr5 ** 5 == num && isPrime(sr5)) {
                return [sr5, 2];
            } else {
                return false;
            }
        }
    } else {
        const MAX = Number.MAX_SAFE_INTEGER ** 0.2 | 0;
        for (let i = 2; i <= MAX; i++) {
            if (isPrime(i)) {
                const num = i ** 5 - n;
                if (num < 0) continue;
                if (isPrime(num)) {
                    return [i, num];
                }
            }
        }
        return "範囲外の可能性あり";
    }
}
function test(max) {
    const result = [];
    for (let i = 0; i < max; i++) {
        const r = k(i + 1);
        if (r) {
            if (r == "範囲外の可能性あり") {
                result.push(`${i}:探索範囲外の可能性あり`);
            } else {
                result.push(`${i}:${r[0]}^5-${r[1]}`);
            }
        }
    }
    return result.join("\n");
}