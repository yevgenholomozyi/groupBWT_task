import { USER_TYPES, OPERATION_TYPES } from '@/constants';

export const validateTransactions = (transactions) =>
  Array.isArray(transactions) &&
  transactions.every(
    ({
      type,
      user_type: userType,
      user_id: userId,
      date,
      operation: { amount, currency },
    }) =>
      typeof amount === 'number' &&
      typeof userId === 'number' &&
      date.match(/^\d{4}-\d{2}-\d{2}$/) &&
      currency === 'EUR' &&
      Object.values(USER_TYPES).includes(userType) &&
      Object.values(OPERATION_TYPES).includes(type)
  );

export default {};
