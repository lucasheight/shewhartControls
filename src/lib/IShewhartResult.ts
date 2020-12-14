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
export interface IShewhartDataPoint {
  value: number;
  violations: IViolations;
}
export interface IShewhartResult {
  isValid: boolean;
  mean: number;
  stDev: number;
  posSigma1: number;
  posSigma2: number;
  posSigma3: number;
  negSigma1: number;
  negSigma2: number;
  negSigma3: number;
  violations: IViolations;
  points: IShewhartDataPoint[];
}
