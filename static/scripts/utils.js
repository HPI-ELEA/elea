import { binomialDistribution } from "simple-statistics";

/**
 * 
 * @param {number} n number trials
 * @param {number} p probability of success for each trial
 * @returns {Array<number>}
 */
export function binomialDistributionPositive(n, p) {
	return binomialDistribution(n, p).map((x, i) => x * i  / ((1 - (1 - p) ** n))).slice(1);
}