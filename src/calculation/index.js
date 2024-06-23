import {
  CASH_IN_COMMISSION_RATE,
  CASH_IN_MAX_CAP,
  CASH_OUT_COMMISSION_RATE,
  CASH_OUT_LEGAL_ENTITIES_MIN_CAP,
  USER_TYPES,
  OPERATION_TYPES,
} from '@/constants';

export const toTwoDecimalCeil = (num) => {
  if (Number.isInteger(num)) {
    return num.toFixed(2);
  }

  const rounded = Math.ceil(num * 100) / 100;
  return rounded.toFixed(2);
};

const calculateCashInCommission = (amount) => {
  const result = Math.min(amount * CASH_IN_COMMISSION_RATE, CASH_IN_MAX_CAP);
  return toTwoDecimalCeil(result);
};

const calculateCashOutNaturalCommission = (amount) =>
  toTwoDecimalCeil(amount * CASH_OUT_COMMISSION_RATE);

const calculateCashOutJuridicalCommission = (amount) => {
  const result = Math.max(
    amount * CASH_OUT_COMMISSION_RATE,
    CASH_OUT_LEGAL_ENTITIES_MIN_CAP
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
