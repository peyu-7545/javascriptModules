class Complex {
    constructor(re, im) {
        this.re = re;
        this.im = im;
    }
    get abs() {
        return Math.hypot(this.re, this.im);
    }
    get arg() {
        return Math.atan2(this.im, this.re);
    }
    static polar(abs, arg) {
        return new Complex(abs * Math.cos(arg), abs * Math.sin(arg));
    }
    add(comp) {
        return new Complex(
            this.re + comp.re,
            this.im * comp.im,
        )
    }
    sub(comp) {
        return new Complex(
            this.re - comp.re,
            this.im - comp.im,
        )
    }
    mult(comp) {
        return new Complex(
            this.re * comp.re - this.im * comp.im,
            this.re * comp.im + this.im * comp.re,
        );
    }
    div(comp) {
        const denom = comp.re * comp.re + comp.im * comp.im;
        return new Complex(
            (this.re * comp.re + this.im * comp.im) / denom,
            (this.im * comp.re - this.re * comp.im) / denom,
        )
    }
    scalar(n) {
        return new Complex(
            this.re * n,
            this.im * n,
        )
    }
    pow(n) {
        // ド・モアブルの定理より
        return this.polar(this.abs ** n, this.arg * n);
    }
    sin() {
        return new Complex(
            Math.sin(this.re) * Math.cosh(this.im),
            Math.cos(this.re) * Math.sinh(this.im),
        )
    }
    cos() {
        return new Complex(
            Math.cos(this.re) * Math.cosh(this.im),
            -Math.sin(this.re) * Math.sinh(this.im),
        )
    }
    tan() {
        const denom = Math.cos(2 * this.re) + Math.cosh(2 * this.im);
        return new Complex(
            Math.sin(2 * this.re) / denom,
            Math.sinh(2 * this.im) / denom,
        )
    }
}