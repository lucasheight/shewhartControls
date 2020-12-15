/**
 * Violations interface
 */
export interface IViolations {
  /** 1 Point Outside the +/−3 Sigma Limits */
  ThreeSigmaViolation: boolean;
  /** 8 Successive Consecutive Points Above (or Below) the Centerline */
  EightPointsAboveBelowMean: boolean;
  /** Six or More Consecutive Points Steadily Increasing or Decreasing */
  SixPointTrend: boolean;
  /** Two out of Three Successive Points in Zone A or Beyond */
  TwoOfThreeOuterThirdViolation: boolean;
  /** 15 Consecutive Points in Zone C on Either Side of the Centerline */
  InnerThird15ConsecutiveViolation: boolean;
}
/**
 * IShewhartDataPoint interface
 */
export interface IShewhartDataPoint {
  /** datapoint */
  value: number;
  /** violations */
  violations: IViolations;
}
/**
 * IShewhartResult interface
 */
export interface IShewhartResult {
  /** isValid: true when data length >= minPoints */
  isValid: boolean;
  /** mean: the mean/avg of the dataset */
  mean: number;
  /** stDev: the standard deviation of the dataset */
  stDev: number;
  /** 1st positive sigma/ mean +1 stDev */
  posSigma1: number;
  /** 2nd positive sigma/ mean +2 stDev */
  posSigma2: number;
  /** 3rd positive sigma/ mean +3 stDev */
  posSigma3: number;
  /** 1st negative sigma/ mean - 1 stDev */
  negSigma1: number;
  /** 2nd negative sigma/ mean - 2 stDev */
  negSigma2: number;
  /** 3rd negative sigma/ mean - 3 stDev */
  negSigma3: number;
  /** Violations object containing results if any of the rules are broken in the dataset */
  violations: IViolations;
  /** points: the data points and their respective rule violations */
  points: IShewhartDataPoint[];
}
