/* eslint-disable no-undef */
import { ShewhartControls } from "../src/lib/shewhart";
import { eightPointsAboveMeanData } from "./testData/eightPointsMean";
import { invalidData } from "./testData/invalidShewhart";
import { meanHuggingData } from "./testData/meanHuggingData";
import { trendDownData } from "./testData/trendDown";
import { trendUpData } from "./testData/trendUp";
import { twoOfThreeSigma3Data } from "./testData/twoOfThreeSigma3";
import { validData } from "./testData/validShewhart";
describe("Shewhart Tests", () => {
  //   let shewhart: ShewhartControls;
  //   beforeEach(() => {
  //     shewhart = new ShewhartControls([1, 2, 3, 4, 5], 10);
  //   });
  it("Empty input should be an invalid shewhart", () => {
    const data = new ShewhartControls([]);
    expect(data.isValid).toBeFalse();
  });
  it("Sample should create a stDev of 3.619", () => {
    const data = new ShewhartControls([9, 2, 5, 4, 12, 7]);
    const stDev = data.stDev;
    const fixed3 = parseFloat(stDev.toString()).toFixed(3);
    expect(fixed3).toBe("3.619");
  });
  it("Should construct object", () => {
    const data = new ShewhartControls(invalidData);
    expect(data).toBeInstanceOf(ShewhartControls);
  });
  it("Should be invalid shewhart result", () => {
    const data = new ShewhartControls(invalidData);
    expect(data.isValid).toBeFalse();
  });
  it("Should be valid shewhart result", () => {
    const data = new ShewhartControls(validData);
    expect(data.isValid).toBeTrue();
  });

  it("ValidData should break rule 1: 1 point outside sigma 3", () => {
    const data = new ShewhartControls(validData);
    const violation = data.points[4].violations.ThreeSigmaViolation;
    expect(violation).toBeTrue();
  });

  it("TrendUpData idx 5 should be a trend up violation", () => {
    const data = new ShewhartControls(trendUpData);
    const violation = data.points[5].violations.SixPointTrend;

    expect(violation).toBeTrue();
  });
  it("TrendUpData idx 0 should NOT be a trend up violation", () => {
    const data = new ShewhartControls(trendUpData);
    const violation = data.points[0].violations.SixPointTrend;

    expect(violation).toBeFalse();
  });
  it("TrendUpData idx 4 should NOT be a trend up violation", () => {
    const data = new ShewhartControls(trendUpData);
    const violation = data.points[4].violations.SixPointTrend;

    expect(violation).toBeFalse();
  });
  it("TrendDownData idx 7 should be a trend down violation", () => {
    const data = new ShewhartControls(trendDownData);
    const violation = data.points[7].violations.SixPointTrend;

    expect(violation).toBeTrue();
  });
  it("TrendDownData idx 5 should NOT be a trend down violation", () => {
    const data = new ShewhartControls(trendDownData);
    const violation = data.points[5].violations.SixPointTrend;

    expect(violation).toBeFalse();
  });
  it("EightpoitnsAboveMean data idx 10 should cause violation", () => {
    const data = new ShewhartControls(eightPointsAboveMeanData);
    const violation = data.points[10].violations.EightPointsAboveBelowMean;
    expect(violation).toBeTrue();
  });
  it("EightpoitnsAboveMean data idx 7 should NOT cause violation", () => {
    const data = new ShewhartControls(eightPointsAboveMeanData);
    const violation = data.points[7].violations.EightPointsAboveBelowMean;
    expect(violation).toBeFalse();
  });
  it("TwoOfThree data  idx 15 should violate", () => {
    const data = new ShewhartControls(twoOfThreeSigma3Data);
    const violation = data.points[15].violations.TwoOfThreeOuterThirdViolation;
    expect(violation).toBeTrue();
  });
  it("TwoOfThree data  idx 29 should violate", () => {
    const data = new ShewhartControls(twoOfThreeSigma3Data);
    const violation = data.points[29].violations.TwoOfThreeOuterThirdViolation;
    expect(violation).toBeTrue();
  });
  it("MeanHugging data idx 55 should violate", () => {
    const data = new ShewhartControls(meanHuggingData);
    const violation =
      data.points[55].violations.InnerThird15ConsecutiveViolation;
    expect(violation).toBeTrue();
  });
  it("MeanHugging data idx 40 should NOT violate", () => {
    const data = new ShewhartControls(meanHuggingData);
    const violation =
      data.points[40].violations.InnerThird15ConsecutiveViolation;
    expect(violation).toBeFalse();
  });
  it("MeanHugging data idx 10 should NOT violate", () => {
    const data = new ShewhartControls(meanHuggingData);
    const violation =
      data.points[10].violations.InnerThird15ConsecutiveViolation;
    expect(violation).toBeFalse();
  });
});
