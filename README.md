# Shewhart Controls
A simple library that applies Shewhart chart rules to an array of numbers.

## Install
``` npm install --save @lucaseheight/shewhartcontrols```

## Using
Create a new ShewhartControls object with an array of numbers.
``` typescript
    const data: IShewhartResult = new ShewhartControls([9, 2, 5, 4, 12, 7]);
```
Optionally: 

  *  Provide a boolean (useSampleStDev) to indicate standard deviation method to use. (defaults to true: Sample Standard Deviation)

  **Results**

``` json
ShewhartControls: {
  data: [ 9, 2, 5, 4, 12, 7 ],
  useSampleStDev: true,
  points: [
    { value: 9, violations: [Object] },
    { value: 2, violations: [Object] },
    { value: 5, violations: [Object] },
    { value: 4, violations: [Object] },
    { value: 12, violations: [Object] },
    { value: 7, violations: [Object] }
  ],

  mean: 6.5,
  stDev: 3.6193922141707713,
  posSigma1: 10.119392214170771,
  posSigma2: 13.738784428341543,
  posSigma3: 17.358176642512312,
  negSigma1: 2.8806077858292287,
  negSigma2: -0.7387844283415426,
  negSigma3: -4.358176642512314,
  violations: {
    ThreeSigmaViolation: false,
    EightPointsAboveBelowMean: false,
    InnerThird15ConsecutiveViolation: false,
    SixPointTrend: false,
    TwoOfThreeOuterThirdViolation: false
  }
}
```

