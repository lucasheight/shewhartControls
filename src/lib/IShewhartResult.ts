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
export interface IShewhartDataPoint {
  value: number;
  violations: IViolations;
}
export interface IViolations {
  // 1 Point Outside the +/−3 Sigma Limits
  ThreeSigmaViolation: boolean;
  // 8 Successive Consecutive Points Above (or Below) the Centerline
  EightPointsAboveBelowMean: boolean;
  // Six or More Consecutive Points Steadily Increasing or Decreasing
  SixPointTrend: boolean;
  // Two out of Three Successive Points in Zone A or Beyond
  TwoOfThreeOuterThirdViolation: boolean;
  // 15 Consecutive Points in Zone C on Either Side of the Centerline
  InnerThird15ConsecutiveViolation: boolean;
}
// export enum ControlFlags {
//   None = 0,
//   // 1 Point Outside the +/−3 Sigma Limits
//   ThreeSigmaViolation = 1 << 0,
//   // 8 Successive Consecutive Points Above (or Below) the Centerline
//   EightPointsAboveBelowMean = 1 << 1,
//   // Six or More Consecutive Points Steadily Increasing or Decreasing
//   SixPointTrend = 1 << 2,
//   // Two out of Three Successive Points in Zone A or Beyond
//   TwoOfThreeOuterThirdViolation = 1 << 3,
//   // 15 Consecutive Points in Zone C on Either Side of the Centerline
//   InnerThird15ConsecutiveViolation = 1 << 4,
// }
