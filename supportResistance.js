/* ============================================================
 * Calculate Support-Resistance
 * https://github.com/pablob206/supportResistance
 * ============================================================
 * Copyright 2021-, Pablo Brocal - pablob206@hotmail.com
 * Released under the MIT License
 * ============================================================
 */

const util = require('util') // console.log(util.inspect(array, { maxArrayLength: null }));

// datos de entrada (precios, volumen)
const inputSupportResistance = require("./exampleInputSupportResistance.json");

let supportResistance = {
    calcMaxPoints: src => {
        let maxPoint = [];
        this.src = src;

        this.src.high.forEach((curr, idx, source) => {
            let center = curr,
                left = source[idx - 1],
                right = source[idx + 1];

            if (center > left && center > right) {
                let objMaxPoint = {};

                objMaxPoint.idx = idx;
                objMaxPoint.open = this.src.open[idx];
                objMaxPoint.close = this.src.close[idx];
                objMaxPoint.high = this.src.high[idx];
                objMaxPoint.low = this.src.low[idx];
                objMaxPoint.volume = this.src.volume[idx];

                maxPoint.push(objMaxPoint);
            };
        });

        return maxPoint;
    },
    calcMinPoints: src => {
        let minPoint = [];
        this.src = src;

        this.src.low.forEach((curr, idx, source) => {
            let center = curr,
                left = source[idx - 1],
                right = source[idx + 1];

            if (center < left && center < right) {
                let objMinPoint = {};

                objMinPoint.idx = idx;
                objMinPoint.open = this.src.open[idx];
                objMinPoint.close = this.src.close[idx];
                objMinPoint.high = this.src.high[idx];
                objMinPoint.low = this.src.low[idx];
                objMinPoint.volume = this.src.volume[idx];

                minPoint.push(objMinPoint);
            };
        });

        return minPoint;
    },
    clustering: (src, threshold, direction) => {
        let clusters = [];
        this.src = src;
        this.threshold = threshold;
        this.direction = direction;

        this.src.forEach((currFirst, idxFirst, pFirst) => {
            let cluster = new Array,
                h0First;

            h0First = (this.direction == 'resistance') ? h0First = currFirst.high : (this.direction == 'support') ? h0First = currFirst.low : null;

            cluster.push(currFirst);

            this.src.forEach((currSecond, idxSecond, pSecond) => {
                let h0Second;

                h0Second = (this.direction == 'resistance') ? h0Second = currSecond.high : (this.direction == 'support') ? h0Second = currSecond.low : null;

                let dif = utils.difPercent(h0First, h0Second);

                if (dif <= this.threshold) {
                    cluster.push(currSecond);
                };
            });

            if (cluster.length > 0) {
                if (clusters.length == 0) {
                    clusters.push(cluster);
                } else {
                    let push = true;

                    (this.direction == 'resistance') ? clust = cluster[0].high: (this.direction == 'support') ? clust = cluster[0].low : null;

                    clusters.forEach((curr, idx, src) => {
                        (this.direction == 'resistance') ? currClust = curr[0].high: (this.direction == 'support') ? currClust = curr[0].low : null;

                        let dif = utils.difPercent(clust, currClust);

                        if (dif <= this.threshold) { // update/no-update
                            push = false;
                            // console.log(`${cluster.length}-${src[idx].length}`);
                            if (src[idx].length > cluster.length) { // update
                                cluster.length = 0;
                                cluster.push(src[idx]);
                            };

                        };
                    });

                    if (push == true) {
                        clusters.push(cluster);
                    };
                };
            };
        });

        // console.log(util.inspect(clusters, { maxArrayLength: null }));
        return clusters;
    },
    recoveryLine: (clusters, direction) => {
        this.clusters = clusters;
        this.direction = direction;
        let lines = new Array;

        this.clusters.map((currCluster, idxCluster, srcCluster) => {
            let line = new Object,
                pivotLineIdx,
                pivotPrice,
                approach = 0,
                limitsUp = 0,
                limitsDown = 0,
                accumulatedVolume = 0;

            currCluster.map((currDataLine, idxDataLine, srcDataLine) => {
                let dataLine,
                    currDataPriceLine;

                if (this.direction == 'resistance') {
                    dataLine = (srcDataLine[idxDataLine + 1] != undefined) ? srcDataLine[idxDataLine + 1].high : null;
                    currDataPriceLine = currDataLine.high;
                } else if (this.direction == 'support') {
                    dataLine = (srcDataLine[idxDataLine + 1] != undefined) ? srcDataLine[idxDataLine + 1].low : null;
                    currDataPriceLine = currDataLine.low;
                };

                limitsUp = (limitsUp == 0) ? currDataLine.high : limitsUp = (currDataLine.high >= limitsUp) ? currDataLine.high : limitsUp;
                limitsDown = (limitsDown == 0) ? currDataLine.high : limitsDown = (currDataLine.high <= limitsDown) ? currDataLine.high : limitsDown;

                // if (currDataLine.open < currDataLine.close) { // vela verde
                //     limitsUp = (limitsUp == 0) ? currDataLine.close : limitsUp = (currDataLine.close >= limitsUp) ? currDataLine.close : limitsUp;
                //     limitsDown = (limitsDown == 0) ? currDataLine.open : limitsDown = (currDataLine.open <= limitsDown) ? currDataLine.open : limitsDown;
                // } else if (currDataLine.open > currDataLine.close) { // vela roja
                //     limitsUp = (limitsUp == 0) ? currDataLine.open : limitsUp = (currDataLine.open >= limitsUp) ? currDataLine.open : limitsUp;
                //     limitsDown = (limitsDown == 0) ? currDataLine.close : limitsDown = (currDataLine.close <= limitsDown) ? currDataLine.close : limitsDown;
                // };

                let lastCurrValue = (srcDataLine[idxDataLine + 1] != undefined) ? dataLine : null;

                if (currDataPriceLine >= lastCurrValue) {
                    pivotPrice = currDataPriceLine;
                    pivotLineIdx = currDataLine.idx;
                } else {
                    pivotPrice = lastCurrValue;
                    pivotLineIdx = lastCurrValue;
                };
                approach++;
                accumulatedVolume += currDataLine.volume;

            });

            line[`pivotPrice`] = pivotPrice;
            line[`limitsUp`] = (limitsUp >= pivotPrice) ? limitsUp : pivotPrice;
            line[`limitsDown`] = (limitsDown <= pivotPrice) ? limitsDown : pivotPrice;
            line[`score`] = supportResistance.scoreOfLine(approach, pivotPrice, clusters[idxCluster]); // approach, allTime-H/L, setupCandl, volume, rsi.
            line[`accumulatedVolume`] = accumulatedVolume;

            if (lines.findIndex(item => item.pivotPrice === line.pivotPrice) == -1) { // push
                lines.push(line);
            } else {
                let idx = lines.findIndex(item => item.pivotPrice === line.pivotPrice); // update
                if (lines[idx].score < line.score) {
                    lines[idx].limitsUp = line.limitsUp;
                    lines[idx].limitsDown = line.limitsDown;
                    // lines[idx].score = supportResistance.scoreOfLine(approach); // approach, allTime-H/L, setupCandl, volume, rsi.
                    lines[idx].score = line.score;
                    lines[idx].accumulatedVolume = line.accumulatedVolume;
                };

            };
        });

        return lines.sort(utils.comparePivotPrice);
    },
    scoreOfLine: (approach, pivotPrice, src) => { // approach, allTime-H/L, setupCandl, volume, rsi.

        return approach;
    },
    unify: (srcR, srcS, threshold, totalLines) => {
        this.srcR = srcR;
        this.srcS = srcS;
        this.threshold = threshold;
        this.totalLines = totalLines;

        let src = this.srcR.concat(this.srcS).sort(utils.comparePivotPrice);

        src.forEach((currSrc, idxSrc, src) => {
            let line = {},
                push = true,
                idxUpdate;

            if (this.totalLines.length == 0) {
                line[`pivotPrice`] = currSrc.pivotPrice;
                line[`limitsUp`] = currSrc.limitsUp;
                line[`limitsDown`] = currSrc.limitsDown;
                line[`score`] = currSrc.score;
                line[`accumulatedVolume`] = currSrc.accumulatedVolume;
            } else {
                this.totalLines.forEach((currTotalLines, idxTotalLines, srcTotalLines) => {
                    let dif = utils.difPercent(currSrc.pivotPrice, currTotalLines.pivotPrice);

                    if (dif <= this.threshold) { // update
                        push = false;
                        idxUpdate = idxTotalLines;
                    } else { // push
                        line[`pivotPrice`] = currSrc.pivotPrice;
                        line[`limitsUp`] = currSrc.limitsUp;
                        line[`limitsDown`] = currSrc.limitsDown;
                        line[`score`] = currSrc.score;
                        line[`accumulatedVolume`] = currSrc.accumulatedVolume;
                    };
                });
            };

            if (push == true) { // push
                this.totalLines.push(line);
            } else { // update
                this.totalLines[idxUpdate].pivotPrice = (currSrc.score >= this.totalLines[idxUpdate].score) ? currSrc.pivotPrice : this.totalLines[idxUpdate].pivotPrice;
                this.totalLines[idxUpdate].limitsUp = (currSrc.limitsUp >= this.totalLines[idxUpdate].limitsUp) ? currSrc.limitsUp : this.totalLines[idxUpdate].limitsUp;
                this.totalLines[idxUpdate].limitsDown = (currSrc.limitsDown <= this.totalLines[idxUpdate].limitsDown) ? currSrc.limitsDown : this.totalLines[idxUpdate].limitsDown;
                this.totalLines[idxUpdate].score += currSrc.score;
                this.totalLines[idxUpdate].accumulatedVolume += currSrc.accumulatedVolume;
            };
        });

        return this.totalLines
    }

};


const utils = {
    compareScore: (a, b) => {
        this.a = a;
        this.b = b;
        return this.b.score - this.a.score;
    },
    comparePivotPrice: (a, b) => {
        this.a = a;
        this.b = b;
        return this.b.pivotPrice - this.a.pivotPrice;
    },
    difPercent: (firstValue, secondValue) => {
        this.firstValue = firstValue;
        this.secondValue = secondValue;
        return Math.abs(((this.firstValue - this.secondValue) / this.firstValue) * 100);
    }

};


/**
 * Recibe el inputSupportResistance lo procesa en base al clusterThreshold y  devuelve los soportes y resistencias agrupados
 * en un array de objetos.
 * @param {String} symbol - en version alpha no usado
 * @param {Array} inputSupportResistance - array de objetos con los datos de input, ver exampleInputSupportResistance.json
 * @param {Boolean} backTesting - en version alpha no usado
 * @param {Number} clusterThreshold - valor del porcentaje que se usara para buscar aproximaciones y agruparlas en el clustering
 * @return {Array} - array de objetos con los resultados de soportes/resistencias
 */
const calcSupportResistance = (symbol, inputSupportResistance, backTesting = false, clusterThreshold = 1) => {
    let totalLines = [];
    this.symbol = symbol;
    this.inputSupportResistance = inputSupportResistance;
    this.backTesting = backTesting;
    this.clusterThreshold = clusterThreshold;

    let maxPoint = supportResistance.calcMaxPoints(this.inputSupportResistance),
        minPoint = supportResistance.calcMinPoints(this.inputSupportResistance),
        clustersR = supportResistance.clustering(maxPoint, this.clusterThreshold, 'resistance'),
        clustersS = supportResistance.clustering(minPoint, this.clusterThreshold, 'support'),
        recoveryLineR = supportResistance.recoveryLine(clustersR, 'resistance'),
        recoveryLineS = supportResistance.recoveryLine(clustersS, 'support');

    totalLines = supportResistance.unify(recoveryLineR, recoveryLineS, this.clusterThreshold, totalLines);

    // console.log(util.inspect(recoveryLineR, { maxArrayLength: null }));
    // console.log(recoveryLineR.length);
    // console.log(util.inspect(recoveryLineS, { maxArrayLength: null }));
    // console.log(recoveryLineS.length);
    // console.log(`------------------------------------------------`);

    return totalLines;
};


let result = calcSupportResistance(null, inputSupportResistance, null, 1);

console.log(util.inspect(result, { maxArrayLength: null }));
console.log(result.length);

// module.exports = calcSupportResistance;