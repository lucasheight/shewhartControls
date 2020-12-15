import {
  IShewhartDataPoint,
  IShewhartResult,
  IViolations,
} from "./IShewhartResult";
/** ShewhartControls class */
export class ShewhartControls implements IShewhartResult {
  /** isValid: true when data length >= minPoints */
  public isValid: boolean = false;
  /** mean: the mean/avg of the dataset */
  public mean: number;
  /** stDev: the standard deviation of the dataset */
  public stDev: number;
  /** 1st positive sigma/ mean +1 stDev */
  public posSigma1: number;
  /** 2nd positive sigma/ mean +2 stDev */
  public posSigma2: number;
  /** 3rd positive sigma/ mean +3 stDev */
  public posSigma3: number;
  /** 1st negative sigma/ mean - 1 stDev */
  public negSigma1: number;
  /** 2nd negative sigma/ mean - 2 stDev */
  public negSigma2: number;
  /** 3rd negative sigma/ mean - 3 stDev */
  public negSigma3: number;
  /** Violations object containing results if any of the rules are broken in the dataset */
  public violations: IViolations;
  /** points: the data points and their respective rule violations */
  public points: IShewhartDataPoint[] = [];
  /**
   *
   * @param data: number[] the data points to apply control rules
   * @param minPoints: optional, default 20, the minimum number of data points to make a valid shewhart control. Defaults 20
   * @param useSampleStDev: optional, defaults true to implement bessel's correction (Sample Standard Deviation),(false to use population stDev)
   */
  constructor(
    private data: number[],
    private minPoints: number = 20,
    private useSampleStDev: boolean = true
  ) {
    this.isValid = this.data.length >= this.minPoints;
    this.mean = this.calcMean(data);
    this.stDev = this.calcStDev(data, this.mean);
    this.posSigma1 = this.mean + 1 * this.stDev;
    this.posSigma2 = this.mean + 2 * this.stDev;
    this.posSigma3 = this.mean + 3 * this.stDev;
    this.negSigma1 = this.mean - 1 * this.stDev;
    this.negSigma2 = this.mean - 2 * this.stDev;
    this.negSigma3 = this.mean - 3 * this.stDev;
    this.process();
    this.violations = {
      ThreeSigmaViolation: this.points.some(
        (point) => point.violations.ThreeSigmaViolation
      ),
      EightPointsAboveBelowMean: this.points.some(
        (point) => point.violations.EightPointsAboveBelowMean
      ),
      InnerThird15ConsecutiveViolation: this.points.some(
        (point) => point.violations.InnerThird15ConsecutiveViolation
      ),
      SixPointTrend: this.points.some(
        (point) => point.violations.SixPointTrend
      ),
      TwoOfThreeOuterThirdViolation: this.points.some(
        (point) => point.violations.TwoOfThreeOuterThirdViolation
      ),
    };
  }
  /**
   * Calculate mean
   * @param data
   */

  private calcMean = (data: number[]): number => {
    const sum = data.reduce((acc: number, curr: number) => {
      return (acc += curr);
    }, 0);
    return sum / data.length;
  };

  /**
   * Calculate standard deviation
   * @param data
   * @param mean
   */
  private calcStDev = (data: number[], mean: number): number => {
    const sigma = data.reduce((acc: number, curr: number) => {
      return (acc += Math.pow(curr - mean, 2));
    }, 0);
    // default is to implemented "Bessels correction https://en.wikipedia.org/wiki/Bessel%27s_correction"
    const N = this.useSampleStDev ? data.length - 1 : data.length;
    return Math.sqrt(sigma / N);
  };

  /**
   * Process the data
   */
  private process = (): void => {
    this.points = this.data.map((val: number, idx: number) => {
      const point: IShewhartDataPoint = {
        value: val,
        violations: {
          ThreeSigmaViolation: this.hasThreeSigmaViolation(idx),
          EightPointsAboveBelowMean: this.hasEightConsecPoints(idx),
          SixPointTrend: this.hasSixOrMoreIncreaseDecreaseTrend(idx),
          InnerThird15ConsecutiveViolation: this.hasFifteenConsecPointsInSigma1(
            idx
          ),
          TwoOfThreeOuterThirdViolation: this.hasTwoOfThreeInSigma3(idx),
        },
      };
      return point;
    });
  };

  /* Rules
   */
  /**
   * 1 Point Outside the +/−3 Sigma Limits
   */
  private hasThreeSigmaViolation = (idx: number): boolean => {
    // 1 Point Outside the +/−3 Sigma Limits
    const val = this.data[idx];
    return !!(val > this.posSigma3 || val < this.negSigma3);
  };

  /**
   * 8 Successive Consecutive Points Above (or Below) the Centerline
   */
  private hasEightConsecPoints = (idx: number): boolean => {
    // 8 Successive Consecutive Points Above (or Below) the Centerline
    // get last 8 include idx check if above/below mean
    const sliceIdx = 7;
    if (idx < sliceIdx) {
      return false;
    }
    // slice arr 8 below idx
    const sliced = this.data.slice(idx - sliceIdx, idx + 1);
    if (sliced.length < sliceIdx) {
      // eslint-disable-next-line no-throw-literal
      throw new Error("Sliced array is less then 8");
    }
    const above = sliced.every((e) => e > this.mean);
    const below = sliced.every((numb) => numb < this.mean);
    return !!(above || below);
  };

  /**
   * Six or More Consecutive Points Steadily Increasing or Decreasing
   */
  private hasSixOrMoreIncreaseDecreaseTrend = (idx: number): boolean => {
    // Six or More Consecutive Points Steadily Increasing or Decreasing
    const sliceIdx = 5;
    if (idx < sliceIdx) {
      return false;
    }
    // slice arr 6 below idx
    const sliced = this.data.slice(idx - sliceIdx, idx + 1);
    if (sliced.length < sliceIdx) {
      throw new Error("Sliced array is less then 6");
    }
    const trendUp: boolean = this.isTrendUp(sliced);
    const trendDown: boolean = this.isTrendDown(sliced);
    return !!(trendDown || trendUp);
  };

  /**
   *  Two out of Three Successive Points in sigma 3 or Beyond
   */
  private hasTwoOfThreeInSigma3 = (idx: number): boolean => {
    const sliceIdx = 2;
    if (idx < sliceIdx) {
      return false;
    }
    // slice arr 3 below idx
    const sliced = this.data.slice(idx - sliceIdx, idx + 1);
    if (sliced.length < sliceIdx) {
      throw new Error("Sliced array is less then 6");
    }
    const outerThird = sliced.filter(
      (f) => f > this.posSigma2 || f < this.negSigma2
    );
    // length needs to be two
    return outerThird.length > 1;
  };

  /**
   * 15 Consecutive Points in Zone C on Either Side of the Centerline
   */
  private hasFifteenConsecPointsInSigma1 = (idx: number): boolean => {
    const sliceIdx = 14;
    if (idx < sliceIdx) {
      return false;
    }
    // slice arr 15 below idx
    const sliced = this.data.slice(idx - sliceIdx, idx + 1);
    if (sliced.length < sliceIdx) {
      throw new Error("Sliced array is less then 15");
    }
    const isMeanHugging = sliced.every(
      (e) => e > this.negSigma1 && e < this.posSigma1
    );
    return isMeanHugging;
  };
  /**
   * Calculate if trending up
   * @param val
   */

  private isTrendDown = (val: number[]): boolean => {
    const result: boolean = val.reduce(
      (acc: boolean, curr: number, idx: number, arr: number[]) => {
        return idx === 0 ? true : acc && curr < arr[idx - 1];
      },
      false
    );
    return result;
  };
  /**
   * Calculate if trending down
   * @param val
   */

  private isTrendUp = (val: number[]): boolean => {
    return val.reduce(
      (acc: boolean, curr: number, idx: number, arr: number[]) => {
        return idx === 0 ? true : acc && curr > arr[idx - 1];
      },
      false
    );
  };
}
