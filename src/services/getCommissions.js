// Calculation
import {
  CALCULATION_HANDLERS,
} from '@/calculation';


// Helpers
import {
  getUserTotalsByWeek,
  isNaturalCheckout,
  handleNaturalCheckout,
} from '@/helpers';

export const getCommissions = (transactions) => {

  const userTotalsByWeek = getUserTotalsByWeek(transactions);

  return transactions
    .map(
      ({
        type,
        userType,
        userId,
        date,
        operation: { amount },
      }) => {
        const naturalCheckout = isNaturalCheckout({ type, userType });
        const handler = CALCULATION_HANDLERS[userType][type];

        if (naturalCheckout) {
          const amountToCalculate = handleNaturalCheckout(
            { date, userId, amount },
            userTotalsByWeek
          );

          return handler(amountToCalculate);
        };
        return handler(amount);
        }
    );
}
