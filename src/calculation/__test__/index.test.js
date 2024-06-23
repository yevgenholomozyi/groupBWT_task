import { toTwoDecimalCeil } from '@/calculation';

describe('toTwoDecimalCeil', () => {
  it('should return a number as a string with two decimal places if the input is an integer', () => {
    expect(toTwoDecimalCeil(5)).toBe("5.00");
    expect(toTwoDecimalCeil(0)).toBe("0.00");
    expect(toTwoDecimalCeil(100)).toBe("100.00");
  });

  it('should round up and return a number as a string with two decimal places if the input has a fractional part', () => {
    expect(toTwoDecimalCeil(5.123)).toBe("5.13");
    expect(toTwoDecimalCeil(5.001)).toBe("5.01");
    expect(toTwoDecimalCeil(0.99)).toBe("0.99");
    expect(toTwoDecimalCeil(0.994)).toBe("1.00");
    expect(toTwoDecimalCeil(0.995)).toBe("1.00");
  });

  it('should correctly handle numbers with exactly two decimal places', () => {
    expect(toTwoDecimalCeil(5.12)).toBe("5.12");
    expect(toTwoDecimalCeil(5.00)).toBe("5.00");
    expect(toTwoDecimalCeil(0.99)).toBe("0.99");
  });
});
