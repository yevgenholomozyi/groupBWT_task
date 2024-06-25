import { getFees } from '@/index';
import {
  getGeneralFilePath,
  convertTransactionsToCamelCase,
} from '@/helpers';
import { readFile } from '@/helpers/readFile';
import { validateTransactions } from '@/helpers/validation';
import { getCommissionFees } from '@/services/getCommissionFees';

jest.mock('@/helpers');
jest.mock('@/helpers/readFile');
jest.mock('@/helpers/validation');
jest.mock('@/services/getCommissionFees');

describe('getFees', () => {
  const mockFilePath = 'path/to/file.json';

  beforeEach(() => {
    jest.clearAllMocks();
    getGeneralFilePath.mockReturnValue(mockFilePath);
  });

  it('should log commission fees for valid transactions', async () => {
    const mockTransactions = [
      {
        date: '2024-06-17',
        user_id: 1,
        user_type: 'natural',
        type: 'cash_in',
        operation: { amount: 200.0, currency: 'EUR' },
      },
    ];

    const mockCommissionFees = [0.06];

    readFile.mockResolvedValue(mockTransactions);
    validateTransactions.mockReturnValue(true);
    convertTransactionsToCamelCase.mockReturnValue(mockTransactions);
    getCommissionFees.mockResolvedValue(mockCommissionFees);

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    await getFees();

    expect(getGeneralFilePath).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledWith(mockFilePath);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(validateTransactions).toHaveBeenCalledWith(mockTransactions);
    expect(validateTransactions).toHaveBeenCalledTimes(1);
    expect(convertTransactionsToCamelCase).toHaveBeenCalledWith(mockTransactions);
    expect(convertTransactionsToCamelCase).toHaveBeenCalledTimes(1);
    expect(getCommissionFees).toHaveBeenCalledWith(mockTransactions);
    expect(getCommissionFees).toHaveBeenCalledTimes(1);
    expect(consoleLogSpy).toHaveBeenCalledTimes(mockCommissionFees.length);

    mockCommissionFees.forEach((fee, index) => {
      expect(consoleLogSpy).toHaveBeenNthCalledWith(index + 1, fee);
    });

    consoleLogSpy.mockRestore();
  });

  it('should log error and exit on invalid transactions', async () => {
    const mockTransactions = [
      {
        date: '2024-06-17',
        user_id: 4,
        user_type: 'natural',
        type: 'cash_out',
        operation: {
            amount: 200.0,
            currency: 'USD' // invalid currency
        },
      },
    ];

    readFile.mockResolvedValue(mockTransactions);
    validateTransactions.mockReturnValue(false);

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    await getFees();

    expect(getGeneralFilePath).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledWith(mockFilePath);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(validateTransactions).toHaveBeenCalledWith(mockTransactions);
    expect(validateTransactions).toHaveBeenCalledTimes(1);
    expect(convertTransactionsToCamelCase).not.toHaveBeenCalled();
    expect(getCommissionFees).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

 it('should log error on any caught exception', async () => {
    const errorMessage = 'Test error message';
    readFile.mockRejectedValue(new Error(errorMessage));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});

    await getFees();

    expect(getGeneralFilePath).toHaveBeenCalledTimes(1);
    expect(readFile).toHaveBeenCalledWith(mockFilePath);
    expect(readFile).toHaveBeenCalledTimes(1);
    expect(validateTransactions).not.toHaveBeenCalled();
    expect(convertTransactionsToCamelCase).not.toHaveBeenCalled();
    expect(getCommissionFees).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error:', new Error(errorMessage));

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
