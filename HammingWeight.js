const hammingWeight = {

    calcWeight(x, digits = Math.floor(Math.log2(x)) + 1) {
        let ham = 0;
        for (let i = 0; i < digits; i++) {
            x >> i & 1 && ham++;
        }
        return ham;
    },

    getEquivClass(digits) {

        const result = Array.from({ length: n + 1 }, () => []);

        // bit全探索
        const max = 1 << digits;
        for (let i = 0; i < max; i++) {
            const ham = this.calcWeight(i);
            result[ham].push(i);
        }

        return result;
    },

    nextSameWeight(x) {
        // Gosper's hack アルゴリズム
        const c = x & -x;
        const r = x + c;
        return ((r ^ x) >> 2) / c | r;
    }
}

export default hammingWeight;