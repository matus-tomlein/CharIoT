const _ = require('underscore'),
      similarity = require('compute-cosine-similarity');

class FuzzySet {
  static fromSensorValues(values, min, max) {
    let setSize = 100;
    let incrementSize = (max - min) / setSize;

    let distances = [];

    _.range(min, max + incrementSize, incrementSize).forEach((x) => {
      let sum = 0.0;

      values.forEach((y) => {
        let distance = Math.sqrt(Math.pow(x - y, 2));
        let exp = Math.exp(-1 * Math.pow(2 * distance / incrementSize, 2));
        sum += exp;
      });

      distances.push(sum);
    });

    // normalize the distances
    let minDistance = _.min(distances);
    let maxDistance = _.max(distances);
    distances = distances.map((distance) => {
      return (distance - minDistance) / (maxDistance - minDistance);
    });

    return new FuzzySet({
      min: min,
      max: max,
      incrementSize: incrementSize,
      distances: distances
    });
  }

  constructor(data) {
    this.data = data;
  }

  get distances() { return this.data.distances; }
  get min() { return this.data.min; }
  get max() { return this.data.max; }
  get incrementSize() { return this.data.incrementSize; }

  set distances(dist) { this.data.distances = dist; }

  indexOf(x) {
    if (x < this.min || x > this.max) return -1;
    return Math.round((x - this.min) / this.incrementSize);
  }

  combineWith(set) {
    if (set.min != this.min || set.max != this.max || set.incrementSize != this.incrementSize) {
      console.log('Comparing non-compatible sets');
      return;
    }

    let distances = this.distances;
    for (let i = 0; i < distances.length; i++) {
      distances[i] = (distances[i] + set.distances[i]) / 2;
    }
    this.distances = distances;
  }

  similarityToOtherFuzzySet(set) {
    if (set.min != this.min || set.max != this.max || set.incrementSize != this.incrementSize) {
      console.log('Comparing non-compatible sets');
      return;
    }

    return similarity(this.distances, set.distances);
  }

  neighbourDensity(x) {
    let i = this.indexOf(x);
    if (i < 0) return 0;
    return this.distances[i];
  }

  similarityToMeasurements(otherValues) {
    var sumDensities = 0;

    otherValues.forEach((value) => {
      sumDensities += this.neighbourDensity(value);
    });

    var otherMin = _.min(otherValues);
    var otherMax = _.max(otherValues);
    var delta = Math.abs(otherMin - this.min) + Math.abs(otherMax - this.max);

    return sumDensities / (delta * otherValues.length);
  }

  toData() { return this.data; }
}

module.exports = FuzzySet;
