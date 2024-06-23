// Constants
import { USER_TYPES, OPERATION_TYPES } from '@/constants/index.js';

// Helper
import { validateTransactions } from '@/helpers/validation.js';

describe('validateTransactions', () => {
  it('should return true for valid transactions', () => {
    const validTransactions = [
      {
        type: OPERATION_TYPES.CASH_IN,
        user_type: USER_TYPES.NATURAL,
        user_id: 1,
        date: '2024-06-18',
        operation: { amount: 100.0, currency: 'EUR' },
      },
      {
        type: OPERATION_TYPES.CASH_OUT,
        user_type: USER_TYPES.JURIDICAL,
        user_id: 2,
        date: '2024-06-19',
        operation: { amount: 200.0, currency: 'EUR' },
      },
    ];

    expect(validateTransactions(validTransactions)).toBe(true);
  });

  it('should return false for transactions with an invalid amount', () => {
    const invalidTransactions = [
      {
        type: OPERATION_TYPES.CASH_IN,
        user_type: USER_TYPES.NATURAL,
        user_id: 1,
        date: '2024-06-18',
        operation: { amount: '100.0', currency: 'EUR' }, // amount should be a number
      },
    ];

    expect(validateTransactions(invalidTransactions)).toBe(false);
  });

  it('should return false for transactions with an invalid user_id', () => {
    const invalidTransactions = [
      {
        type: OPERATION_TYPES.CASH_OUT,
        user_type: USER_TYPES.JURIDICAL,
        user_id: '2', // user_id should be a number
        date: '2024-06-19',
        operation: { amount: 200.0, currency: 'EUR' },
      },
    ];

    expect(validateTransactions(invalidTransactions)).toBe(false);
  });

  it('should return false for transactions with an invalid date format', () => {
    const invalidTransactions = [
      {
        type: OPERATION_TYPES.CASH_IN,
        user_type: USER_TYPES.NATURAL,
        user_id: 1,
        date: '2024/06/18', // date should be in YYYY-MM-DD format
        operation: { amount: 100.0, currency: 'EUR' },
      },
    ];

    expect(validateTransactions(invalidTransactions)).toBe(false);
  });

  it('should return false for transactions with an unsupported currency', () => {
    const invalidTransactions = [
      {
        type: OPERATION_TYPES.CASH_OUT,
        user_type: USER_TYPES.JURIDICAL,
        user_id: 2,
        date: '2024-06-19',
        operation: { amount: 200.0, currency: 'USD' }, // currency should be EUR
      },
    ];

    expect(validateTransactions(invalidTransactions)).toBe(false);
  });

  it('should return false for transactions with an unsupported user type', () => {
    const invalidTransactions = [
      {
        type: OPERATION_TYPES.CASH_IN,
        user_type: 'Eugene', // unsupported user type
        user_id: 1,
        date: '2024-06-18',
        operation: { amount: 100.0, currency: 'EUR' },
      },
    ];

    expect(validateTransactions(invalidTransactions)).toBe(false);
  });

  it('should return false for transactions with an unsupported operation type', () => {
    const invalidTransactions = [
      {
        type: 'cash_transfer', // unsupported operation type
        user_type: USER_TYPES.NATURAL,
        user_id: 1,
        date: '2024-06-18',
        operation: { amount: 100.0, currency: 'EUR' },
      },
    ];

    expect(validateTransactions(invalidTransactions)).toBe(false);
  });

  it('should return false for non-array input', () => {
    const invalidInput = {
      type: OPERATION_TYPES.CASH_IN,
      user_type: USER_TYPES.NATURAL,
      user_id: 1,
      date: '2024-06-18',
      operation: { amount: 100.0, currency: 'EUR' },
    };

    expect(validateTransactions(invalidInput)).toBe(false);
  });
});
