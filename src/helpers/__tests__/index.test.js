import { getUserTotalsByWeek, isNaturalCheckout } from '@/helpers';

describe('isNaturalCheckout', () => {
  it('should return true for type cash_out and userType: natural', () => {
    const transaction = { type: 'cash_out', userType: 'natural' };
    const result = isNaturalCheckout(transaction);
    expect(result).toBe(true);
  });

  it('should return false if type is not cash_out', () => {
    const transaction = { type: 'cash_in', userType: 'natural' };
    const result = isNaturalCheckout(transaction);
    expect(result).toBe(false);
  });

  it('should return false if userType is not natural', () => {
    const transaction = { type: 'cash_in', userType: 'juridical' };
    const result = isNaturalCheckout(transaction);
    expect(result).toBe(false);
  });
});

describe('getUserTotalsByWeek', () => {
  it('should handle multiple users correctly', () => {
    const transactions = [
      {
        userId: 1,
        userType: 'natural',
        type: 'cash_out',
        date: '2024-06-18',
        operation: { amount: 150.0 },
      },
      {
        userId: 1,
        userType: 'natural',
        type: 'cash_out',
        date: '2024-06-19',
        operation: { amount: 200.0 },
      },
      {
        userId: 2,
        userType: 'natural',
        type: 'cash_out',
        date: '2024-06-18',
        operation: { amount: 100.0 },
      },
    ];

    const result = getUserTotalsByWeek(transactions);

    expect(result).toEqual({
      1: {
        '2024-06-16': { totalAmount: 350.0, limit: 1000 },
      },
      2: {
        '2024-06-16': { totalAmount: 100.0, limit: 1000 },
      },
    });
  });

  it('should handle empty transactions array', () => {
    const transactions = [];
    const result = getUserTotalsByWeek(transactions);
    expect(result).toEqual({});
  });
});
