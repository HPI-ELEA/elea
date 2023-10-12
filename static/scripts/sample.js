/*
Copied from https://github.com/simple-statistics/simple-statistics/blob/main/LICENSE
ISC License

Copyright (c) 2014, Tom MacWright

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
*/

/**
 * A [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 * in-place - which means that it **will change the order of the original
 * array by reference**.
 *
 * This is an algorithm that generates a random [permutation](https://en.wikipedia.org/wiki/Permutation)
 * of a set.
 *
 * @param {Array} x sample of one or more numbers
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @returns {Array} x
 * @example
 * var x = [1, 2, 3, 4];
 * shuffleInPlace(x);
 * // x is shuffled to a value like [2, 1, 4, 3]
 */
function shuffleInPlace(x, randomSource) {
  // a custom random number source can be provided if you want to use
  // a fixed seed or another random number generator, like
  // [random-js](https://www.npmjs.org/package/random-js)
  randomSource = randomSource || Math.random;

  // store the current length of the x to determine
  // when no elements remain to shuffle.
  let length = x.length;

  // temporary is used to hold an item when it is being
  // swapped between indices.
  let temporary;

  // The index to swap at each stage.
  let index;

  // While there are still items to shuffle
  while (length > 0) {
    // choose a random index within the subset of the array
    // that is not yet shuffled
    index = Math.floor(randomSource() * length--);

    // store the value that we'll move temporarily
    temporary = x[length];

    // swap the value at `x[length]` with `x[index]`
    x[length] = x[index];
    x[index] = temporary;
  }

  return x;
}

/**
 * A [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
 * is a fast way to create a random permutation of a finite set. This is
 * a function around `shuffle_in_place` that adds the guarantee that
 * it will not modify its input.
 *
 * @param {Array} x sample of 0 or more numbers
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @return {Array} shuffled version of input
 * @example
 * var shuffled = shuffle([1, 2, 3, 4]);
 * shuffled; // = [2, 3, 1, 4] or any other random permutation
 */
function shuffle(x, randomSource) {
  // slice the original array so that it is not modified
  const sample = x.slice();

  // and then shuffle that shallow-copied array, in place
  return shuffleInPlace(sample, randomSource);
}

/**
 * Create a [simple random sample](http://en.wikipedia.org/wiki/Simple_random_sample)
 * from a given array of `n` elements.
 *
 * The sampled values will be in any order, not necessarily the order
 * they appear in the input.
 *
 * @param {Array<any>} x input array. can contain any type
 * @param {number} n count of how many elements to take
 * @param {Function} [randomSource=Math.random] an optional entropy source that
 * returns numbers between 0 inclusive and 1 exclusive: the range [0, 1)
 * @return {Array} subset of n elements in original array
 *
 * @example
 * var values = [1, 2, 4, 5, 6, 7, 8, 9];
 * sample(values, 3); // returns 3 random values, like [2, 5, 8];
 */
// eslint-disable-next-line no-unused-vars
function sample(x, n, randomSource) {
  // shuffle the original array using a fisher-yates shuffle
  const shuffled = shuffle(x, randomSource);

  // and then return a subset of it - the first `n` elements.
  return shuffled.slice(0, n);
}
