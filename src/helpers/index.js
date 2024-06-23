// Libs
import { startOfWeek, parseISO } from 'date-fns';

// Constants
import {
  INDIVIDUALS_FREE_PER_WEEK_CAP,
  OPERATIONS_TYPES,
  USER_TYPES
} from '@/constants';

const toCamelCase = (str) =>
  str.replace(/_([a-z])/g, (_match, p1) => p1.toUpperCase());

export const convertTransactionsToCamelCase = (transactions) => transactions
  .map(
    transaction => {
      return Object
        .keys(transaction)
          .reduce((acc, key) => {
              const camelCaseKey = toCamelCase(key);
              acc[camelCaseKey] = transaction[key];
              return acc;
            }, {}
        )
    }
);

export const isNaturalCheckout = (transaction) => {
  return transaction.userType === USER_TYPES.NATURAL &&
    transaction.type === OPERATIONS_TYPES.CASH_OUT;
};

export const getWeekStart = (date) =>
  startOfWeek(
    parseISO(date),
    { weekStartsOn: 1 }
  )
  .toISOString().split('T')[0];

export const getUserTotalsByWeek = (transactions) => {
  const weeklyTotals = {};

  transactions.forEach(({
    userId,
    userType,
    type,
    date,
    operation: { amount },
  }) => {
    const weekStart = getWeekStart(date);
    if (isNaturalCheckout({ type, userType })) {
      if (!weeklyTotals[userId]) {
        weeklyTotals[userId] = {};
      }

      if (!weeklyTotals[userId][weekStart]) {
        weeklyTotals[userId][weekStart] = {
          totalAmount: 0,
          limit: 1000,
        };
      }

      weeklyTotals[userId][weekStart].totalAmount += amount;
    }
  });

  return weeklyTotals;
};

export const handleNaturalCheckout = ({
  date,
  userId,
  amount,
}, userTotalsByWeek) => {
  const weekStart = getWeekStart(date);
  const usersWeekTotal = userTotalsByWeek[userId][weekStart].totalAmount;

  if (usersWeekTotal <= INDIVIDUALS_FREE_PER_WEEK_CAP) return 0;

  const newWeekLimit = Math.max(userTotalsByWeek[userId][weekStart].limit - amount, 0);
  const amountToCalculate = Math.max(amount - userTotalsByWeek[userId][weekStart].limit, 0);
  userTotalsByWeek[userId][weekStart].limit = Math.max(newWeekLimit, 0);

  return amountToCalculate;
}