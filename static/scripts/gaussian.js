/*
Copied from https://github.com/errcw/gaussian/blob/master/LICENSE
Copyright (c) 2023 Eric Woroshow

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
/**
 * Box-Muller implementation
 * https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform
 */

const PRECISION = 1e9;
const _2PI = Math.PI * 2;

/**
 *
 * @param {number} mean
 * @param {number} std
 * @param randFn - an optional function that returns a float between 0 (inclusive) and 1
 * (exclusive).  Use this if you want to pass in a random number generator other than
 * Math.random().
 * @returns {number}
 */
function generateGaussian(mean, std, randFn = null) {
  var u1;
  var u2;
  if (randFn) {
    u1 = randFn();
    u2 = randFn();
  } else {
    u1 = Math.random();
    u2 = Math.random();
  }

  var z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(_2PI * u2);
  var z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(_2PI * u2);

  return z0 * std + mean;
}
// Complementary error function
// From Numerical Recipes in C 2e p221
var erfc = function (x) {
  var z = Math.abs(x);
  var t = 1 / (1 + z / 2);
  var r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t *
                              (-1.13520398 +
                                t *
                                  (1.48851587 +
                                    t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? r : 2 - r;
};

// Inverse complementary error function
// From Numerical Recipes 3e p265
var ierfc = function (x) {
  if (x >= 2) {
    return -100;
  }
  if (x <= 0) {
    return 100;
  }

  var xx = x < 1 ? x : 2 - x;
  var t = Math.sqrt(-2 * Math.log(xx / 2));

  var r =
    -0.70711 *
    ((2.30753 + t * 0.27061) / (1 + t * (0.99229 + t * 0.04481)) - t);

  for (var j = 0; j < 2; j++) {
    var err = erfc(r) - xx;
    r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
  }

  return x < 1 ? r : -r;
};

// Models the normal distribution
var Gaussian = function (mean, variance) {
  if (variance <= 0) {
    throw new Error("Variance must be > 0 (but was " + variance + ")");
  }
  this.mean = mean;
  this.variance = variance;
  this.standardDeviation = Math.sqrt(variance);
};

// Probability density function
Gaussian.prototype.pdf = function (x) {
  var m = this.standardDeviation * Math.sqrt(2 * Math.PI);
  var e = Math.exp(-Math.pow(x - this.mean, 2) / (2 * this.variance));
  return e / m;
};

// Cumulative density function
Gaussian.prototype.cdf = function (x) {
  return 0.5 * erfc(-(x - this.mean) / (this.standardDeviation * Math.sqrt(2)));
};

// Percent point function
Gaussian.prototype.ppf = function (x) {
  return this.mean - this.standardDeviation * Math.sqrt(2) * ierfc(2 * x);
};

// Product distribution of this and d (scale for constant)
Gaussian.prototype.mul = function (d) {
  if (typeof d === "number") {
    return this.scale(d);
  }
  var precision = 1 / this.variance;
  var dprecision = 1 / d.variance;
  return fromPrecisionMean(
    precision + dprecision,
    precision * this.mean + dprecision * d.mean
  );
};

// Quotient distribution of this and d (scale for constant)
Gaussian.prototype.div = function (d) {
  if (typeof d === "number") {
    return this.scale(1 / d);
  }
  var precision = 1 / this.variance;
  var dprecision = 1 / d.variance;
  return fromPrecisionMean(
    precision - dprecision,
    precision * this.mean - dprecision * d.mean
  );
};

// Addition of this and d
Gaussian.prototype.add = function (d) {
  return gaussian(this.mean + d.mean, this.variance + d.variance);
};

// Subtraction of this and d
Gaussian.prototype.sub = function (d) {
  return gaussian(this.mean - d.mean, this.variance + d.variance);
};

// Scale this by constant c
Gaussian.prototype.scale = function (c) {
  return gaussian(this.mean * c, this.variance * c * c);
};

/**
 * Generate [num] random samples
 * @param {number} num
 * @param randFn - an optional function that returns a float between 0 (inclusive) and 1
 * (exclusive).  Use this if you want to pass in a random number generator other than
 * Math.random().
 * @returns {number[]}
 */
Gaussian.prototype.random = function (num, randFn = null) {
  let mean = this.mean;
  let std = this.standardDeviation;
  return Array(num)
    .fill(0)
    .map(() => {
      return generateGaussian(mean, std, randFn);
    });
};

var gaussian = function (mean, variance) {
  return new Gaussian(mean, variance);
};

var fromPrecisionMean = function (precision, precisionmean) {
  return gaussian(precisionmean / precision, 1 / precision);
};
