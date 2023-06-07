function calculateMean(list) {
    const sum = list.reduce((acc, val) => acc + val, 0);
    const mean = sum / list.length;
    return mean;
}

function calculateStandardDeviation(list) {
    const mean = calculateMean(list);
    const squaredDifferences = list.map((val) => Math.pow(val - mean, 2));
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / list.length;
    const standardDeviation = Math.sqrt(variance);
    return standardDeviation;
}

function calculateZScore(value, mean, standardDeviation) {
    const zScore = (value - mean) / standardDeviation;
    return zScore;
}

module.exports = {calculateMean, calculateStandardDeviation, calculateZScore}