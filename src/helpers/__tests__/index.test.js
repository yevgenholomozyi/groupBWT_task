import {
  isNaturalCheckout,
  getGeneralFilePath,
  getUserTotalsByWeek,
  convertTransactionsToCamelCase,
} from '@/helpers';

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
    const limit = 1000;

    const result = getUserTotalsByWeek(transactions, limit);

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

describe('convertTransactionsToCamelCase', () => {
  it('converts keys with underscores to camelCase', () => {
    const transactions = [
      {
        date: '2016-01-05',
        user_id: 1,
        user_type: "natural",
        type: "cash_in",
        operation: { amount: 200.0, currency: "EUR" }
      },
      {
        date: "2016-01-06",
        user_id: 2,
        user_type: "juridical",
        type: "cash_out",
        operation: { 'amount': 300.0, 'currency': "EUR" }
      },
    ];

    const expected = [
      {
        date: '2016-01-05',
        userId: 1,
        userType: "natural",
        type: "cash_in",
        operation: { amount: 200.0, currency: "EUR" }
      },
      {
        date: "2016-01-06",
        userId: 2,
        userType: "juridical",
        type: "cash_out",
        operation: { 'amount': 300.0, 'currency': "EUR" }
      },
    ];

    const result = convertTransactionsToCamelCase(transactions);
    expect(result).toEqual(expected);
  });

  it('handles empty array', () => {
    const transactions = [];

    const result = convertTransactionsToCamelCase(transactions);
    expect(result).toEqual([]);
  });

  it('does not modify keys without underscores', () => {
    const transactions = [
      { transactionId: 1, userName: 'Alice', amountPaid: 100 },
      { transactionId: 2, userName: 'Bob', amountPaid: 200 },
    ];

    const expected = [
      { transactionId: 1, userName: 'Alice', amountPaid: 100 },
      { transactionId: 2, userName: 'Bob', amountPaid: 200 },
    ];

    const result = convertTransactionsToCamelCase(transactions);
    expect(result).toEqual(expected);
  });

});

describe('getGeneralFilePath', () => {
  let consoleErrorSpy;
  let processExitSpy;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    processExitSpy = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the file path when provided as an argument', () => {
    const mockFilePath = 'path/to/file.json';
    process.argv = ['node', 'script.js', mockFilePath];

    const result = getGeneralFilePath();

    expect(result).toBe(mockFilePath);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
    expect(processExitSpy).not.toHaveBeenCalled();
  });

  test('should log an error and exit when no file path is provided', () => {
    process.argv = ['node', 'script.js'];

    getGeneralFilePath();

    expect(consoleErrorSpy).toHaveBeenCalledWith('Please provide the path to a JSON file as an argument.');
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});

