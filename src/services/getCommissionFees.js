// Calculation
import { CALCULATION_HANDLERS } from '@/calculation';

// API
import { getCalculationData } from '@/api';

// Helpers
import {
  isNaturalCheckout,
  getUserTotalsByWeek,
  handleNaturalCheckout,
} from '@/helpers';

export const getCommissionFees = async (transactions) => {
  const calculationData = await getCalculationData();

  const userTotalsByWeek = getUserTotalsByWeek(
    transactions,
    calculationData.naturalCashOutLimit
  );

  return transactions.map(
    ({ type, userType, userId, date, operation: { amount } }) => {
      const naturalCheckout = isNaturalCheckout({ type, userType });
      const handler = CALCULATION_HANDLERS[userType][type];
      const operationData = calculationData[userType][type];

      if (naturalCheckout) {
        const amountToCalculate = handleNaturalCheckout(
          { date, userId, amount },
          userTotalsByWeek
        );

        return handler(amountToCalculate, operationData);
      }
      return handler(amount, operationData);
    }
  );
};

export default {};
