// eslint-disable-next-line no-unused-vars
class Individual extends Array {
  /**
   * Individual class with bitstream
   * @param {number} genomeLength genome length of individual
   * @param {boolean} random generate random bits
   */
  constructor(genomeLength, random) {
    super(genomeLength);
    this.fill(0);
    /**
     * defaults to Infinity
     * @type {number} number of flips
     */
    this.l = Infinity;
    if (random) {
      for (let i = 0; i < this.length; i++) {
        this[i] = Math.round(Math.random());
      }
    }
  }

  toString() {
    if (this.l === Infinity) {
      return this.join(", ");
    }
    return `[${this.join(", ")}], ${this.l}`;
  }

  get [Symbol.toStringTag]() {
    return this.toString();
  }
}

/*
let individual = new Individual(2, false);
individual.l = 8;
individual[0] = 1;
console.log(individual[1]);
console.log(individual.map((x) => x + 10));
console.log(individual.l);
console.log(individual);
*/
