// Constants
import {
  BASE_URL,
  USER_TYPES,
  OPERATION_TYPES,
  ERROR_MESSAGE,
} from '@/constants';

export const fetchData = async (url, baseURL = BASE_URL) => {
  const requestUrl = `${baseURL}/${url}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorDetail = await response.text();
      console.error(ERROR_MESSAGE, errorDetail);
      throw new Error(
        `Request failed with status ${response.status}: ${errorDetail}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    throw error;
  }
};

export const getCalculationData = async () => {
  const {
    percents: cashInPercents,
    max: { amount: cashInMaxAmount },
  } = await fetchData('cash-in');

  const {
    percents: cashOutJuridicalPercents,
    min: { amount: cashOutJuridicalMinAmount },
  } = await fetchData('cash-out-juridical');

  const {
    percents: cashOutNaturalPercents,
    week_limit: { amount: limit },
  } = await fetchData('cash-out-natural');

  return {
    naturalCashOutLimit: limit,
    [USER_TYPES.NATURAL]: {
      [OPERATION_TYPES.CASH_OUT]: {
        cashOutNaturalPercents,
      },
      [OPERATION_TYPES.CASH_IN]: {
        cashInPercents,
        cashInMaxAmount,
      },
    },
    [USER_TYPES.JURIDICAL]: {
      [OPERATION_TYPES.CASH_OUT]: {
        cashOutJuridicalPercents,
        cashOutJuridicalMinAmount,
      },
      [OPERATION_TYPES.CASH_IN]: {
        cashInPercents,
        cashInMaxAmount,
      },
    },
  };
};

export default {};
