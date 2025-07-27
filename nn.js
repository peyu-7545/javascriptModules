// ニューラルネットワークを扱うためのテンプレートを作成する

class NN {
    /**
     * ニューラルネットワークモデルを作成する
     * @param {Number[]} layerLengths 各層のニューロンの数
     * @returns {NN} ニューラルネットワークのインスタンス
     */
    constructor(layerLengths) {
        let parametersLength = 0;
        for (let i = 0; i < layerLengths.length - 1; i++) {
            parametersLength += layerLengths[i] * layerLengths[i + 1] + layerLengths[i + 1];
        }
        this.layerLengths = layerLengths;
        this.parameters = new Float32Array(parametersLength).map(() => Math.random() * 2 - 1); // -1から1の範囲で初期化
    }

    getParameterIndex(layerIndex, neuronIndex) {
        if (layerIndex < 0 || layerIndex >= this.layerLengths.length - 1) {
            throw new Error(`Layer index must be between 0 and ${this.layerLengths.length - 2}`);
        }
        if (neuronIndex < 0 || neuronIndex >= this.layerLengths[layerIndex]) {
            throw new Error(`Neuron index must be between 0 and ${this.layerLengths[layerIndex] - 1}`);
        }
        let index = 0;
        for (let i = 0; i < layerIndex; i++) {
            index += this.layerLengths[i] * this.layerLengths[i + 1] + this.layerLengths[i + 1];
        }
        index += neuronIndex * this.layerLengths[layerIndex + 1];
        return index;
    }

    calc(input, expectedOutput) {
        if (input.length != this.layerLengths[0]) {
            throw new Error(`Input length must be ${this.layerLengths[0]}`);
            return;
        }

        // 値を保持
        const tempLayer = new Array(this.layerLengths.length).fill(null).map((e, i) => new Float32Array(this.layerLengths[i]));

        // 出力を計算する
        for (let i = 0; i < this.layerLengths.length; i++) {
            if (i == 0) {
                // 入力層
                tempLayer[i].set(input);
            } else {
                // 重みとバイアスを計算
                const startIndex = this.getParameterIndex(i - 1, 0);
                const weights = this.parameters.slice(startIndex, startIndex + this.layerLengths[i - 1] * this.layerLengths[i]);
                const biases = this.parameters.slice(startIndex + weights.length, startIndex + weights.length + this.layerLengths[i]);

                for (let j = 0; j < this.layerLengths[i]; j++) {
                    let sum = biases[j];
                    for (let k = 0; k < this.layerLengths[i - 1]; k++) {
                        sum += tempLayer[i - 1][k] * weights[j * this.layerLengths[i - 1] + k];
                    }
                    tempLayer[i][j] = this.constructor.leakyRelu(sum); // 活性化関数を適用
                }
            }
        }
        const output = tempLayer[tempLayer.length - 1];

        // expectedOutputが指定されていない場合はこのまま返す
        if (expectedOutput == undefined) {
            return { output };
        }

        // 誤差の平均
        const error = output.map((o, i) => o - expectedOutput[i]);
        const meanError = error.reduce((sum, e) => sum + e * e, 0) / error.length;

        // 誤差逆伝播で勾配を計算
        const deltas = new Array(this.layerLengths.length).fill(null).map(() => new Float32Array(0));
        deltas[deltas.length - 1] = error.map((e, i) => e * this.constructor.leakyReluDerivative(output[i]));
        for (let i = this.layerLengths.length - 2; i >= 0; i--) {
            const startIndex = this.getParameterIndex(i, 0);
            const weights = this.parameters.slice(startIndex, startIndex + this.layerLengths[i] * this.layerLengths[i + 1]);
            deltas[i] = new Float32Array(this.layerLengths[i]);
            for (let j = 0; j < this.layerLengths[i]; j++) {
                let sum = 0;
                for (let k = 0; k < this.layerLengths[i + 1]; k++) {
                    sum += deltas[i + 1][k] * weights[k * this.layerLengths[i] + j];
                }
                // 10%でドロップアウト
                if (Math.random() < 0.1) {
                    sum = 0;
                }
                deltas[i][j] = sum * this.constructor.leakyReluDerivative(tempLayer[i][j]);
            }
        }

        // パラメータの更新
        for (let i = 0; i < this.layerLengths.length - 1;
            i++) {
            const startIndex = this.getParameterIndex(i, 0);
            const weights = this.parameters.slice(startIndex, startIndex + this.layerLengths[i] * this.layerLengths[i + 1]);
            const biases = this.parameters.slice(startIndex + weights.length, startIndex + weights.length + this.layerLengths[i + 1]);

            for (let j = 0; j < this.layerLengths[i + 1]; j++) {
                biases[j] -= deltas[i + 1][j] * 0.01; // 学習率0.01で更新
                for (let k = 0; k < this.layerLengths[i]; k++) {
                    weights[j * this.layerLengths[i] + k] -= deltas[i + 1][j] * tempLayer[i][k] * 0.01;
                }
            }
            // 更新したパラメータを反映
            this.parameters.set(weights, startIndex);
            this.parameters.set(biases, startIndex + weights.length);
        }

        return { output, meanError };
    }

    /**
     * 学習を行う
     * @param {Number[][]} inputs 入力データの配列
     * @param {Number[][]} outputs 出力データの配列
     * @param {Number} epoch 学習のエポック数
     * @throws {Error} 入力と出力の長さが一致しない場合
     * @returns {void}
     */
    learn(inputs, outputs, epoch) {
        if (inputs.length != outputs.length) {
            throw new Error("Inputs and outputs must have the same length");
        }
        for (let e = 0; e < epoch; e++) {
            for (let i = 0; i < inputs.length; i++) {
                this.calc(inputs[i], outputs[i]);
            }
        }
        console.log(`Learning completed for ${epoch} epochs.`);
    }

    static leakyRelu(x) {
        return x > 0 ? x : 0.01 * x;
    }

    static leakyReluDerivative(x) {
        return x > 0 ? 1 : 0.01;
    }
}


// 簡単なテストを解いて確かめる
const nn = new NN([2, 3, 3, 1]);
const inputs = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1]
];
const outputs = [
    [0],
    [1],
    [1],
    [0]
];
nn.learn(inputs, outputs, 10000);