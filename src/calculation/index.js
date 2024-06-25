// Constants
import { USER_TYPES, OPERATION_TYPES } from '@/constants';

export const toTwoDecimalCeil = (num) => {
  if (Number.isInteger(num)) {
    return num.toFixed(2);
  }

  const rounded = Math.ceil(num * 100) / 100;
  return rounded.toFixed(2);
};

const calculateCashInCommission = (
  amount,
  { cashInPercents, cashInMaxAmount }
) => {
  const result = Math.min((cashInPercents / 100) * amount, cashInMaxAmount);
  return toTwoDecimalCeil(result);
};

const calculateCashOutNaturalCommission = (
  amount,
  { cashOutNaturalPercents }
) => toTwoDecimalCeil(amount * (cashOutNaturalPercents / 100));

const calculateCashOutJuridicalCommission = (
  amount,
  { cashOutJuridicalPercents, cashOutJuridicalMinAmount }
) => {
  const result = Math.max(
    amount * (cashOutJuridicalPercents / 100),
    cashOutJuridicalMinAmount
  );
  return toTwoDecimalCeil(result);
};

export const CALCULATION_HANDLERS = {
  [USER_TYPES.NATURAL]: {
    [OPERATION_TYPES.CASH_OUT]: calculateCashOutNaturalCommission,
    [OPERATION_TYPES.CASH_IN]: calculateCashInCommission,
  },
  [USER_TYPES.JURIDICAL]: {
    [OPERATION_TYPES.CASH_OUT]: calculateCashOutJuridicalCommission,
    [OPERATION_TYPES.CASH_IN]: calculateCashInCommission,
  },
};

export default {};
