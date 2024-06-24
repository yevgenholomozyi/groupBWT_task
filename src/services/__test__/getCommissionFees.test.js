import { getCommissionFees } from '@/services/getCommissionFees';

import {
  getUserTotalsByWeek,
  isNaturalCheckout,
  handleNaturalCheckout,
} from '@/helpers';

import { CALCULATION_HANDLERS } from '@/calculation';

jest.mock('@/helpers', () => ({
  getUserTotalsByWeek: jest.fn(),
  isNaturalCheckout: jest.fn(),
  handleNaturalCheckout: jest.fn(),
}));

jest.mock('@/calculation', () => ({
  CALCULATION_HANDLERS: {
    natural: {
      cash_in: jest.fn(),
      cash_out: jest.fn(),
    },
    juridical: {
      cash_in: jest.fn(),
      cash_out: jest.fn(),
    },
  },
}));

describe('getCommissionFees', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate commissions for natural cash out transactions using handleNaturalCheckout', () => {
    const transactions = [
      {
        date: '2024-06-18',
        userId: 4,
        userType: 'natural',
        type: 'cash_out',
        operation: { amount: 150.0, currency: 'EUR' },
      },
    ];

    const userTotalsByWeek = {
      4: {
        '2024-06-17': {
          totalAmount: 150.0,
          limit: 1000,
        },
      },
    };

    getUserTotalsByWeek.mockReturnValue(userTotalsByWeek);
    isNaturalCheckout.mockReturnValue(true);
    handleNaturalCheckout.mockReturnValue(50.0);
    CALCULATION_HANDLERS.natural.cash_out.mockReturnValue(0.15);

    const commissionFees = getCommissionFees(transactions);

    expect(getUserTotalsByWeek).toHaveBeenCalledWith(transactions);
    expect(isNaturalCheckout).toHaveBeenCalledWith({
      type: 'cash_out',
      userType: 'natural',
    });
    expect(handleNaturalCheckout).toHaveBeenCalledWith(
      {
        date: '2024-06-18',
        userId: 4,
        amount: 150.0,
      },
      userTotalsByWeek
    );
    expect(CALCULATION_HANDLERS.natural.cash_out).toHaveBeenCalledWith(50.0);
    expect(commissionFees).toEqual([0.15]);
  });

  it('should calculate commissions for juridical cash in transactions', () => {
    const transactions = [
      {
        date: '2024-06-18',
        userId: 5,
        userType: 'juridical',
        type: 'cash_in',
        operation: { amount: 1000.0, currency: 'EUR' },
      },
    ];

    getUserTotalsByWeek.mockReturnValue({});
    isNaturalCheckout.mockReturnValue(false);
    CALCULATION_HANDLERS.juridical.cash_in.mockReturnValue(3.0);

    const commissionFees = getCommissionFees(transactions);

    expect(getUserTotalsByWeek).toHaveBeenCalledWith(transactions);
    expect(isNaturalCheckout).toHaveBeenCalledWith({
      type: 'cash_in',
      userType: 'juridical',
    });
    expect(CALCULATION_HANDLERS.juridical.cash_in).toHaveBeenCalledWith(1000.0);
    expect(commissionFees).toEqual([3.0]);
  });
});
