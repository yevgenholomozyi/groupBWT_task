// Services
import { getCommissionFees } from '@/services/getCommissionFees';

// Helpers
import { readFile } from '@/helpers/readFile';
import { validateTransactions } from '@/helpers/validation';
import { getGeneralFilePath, convertTransactionsToCamelCase } from '@/helpers';

export async function getFees() {
  const generalFilePath = getGeneralFilePath();

  try {
    const transaction = await readFile(generalFilePath);
    const isValidated = validateTransactions(transaction);

    if (!isValidated) {
      console.error(
        'An error occurred while validating transactions. The incoming data can not be processed.'
      );
      return;
    }

    const convertedTransactions = convertTransactionsToCamelCase(transaction);
    const commissionFees = await getCommissionFees(convertedTransactions);

    commissionFees.forEach((commissionFee) => {
      console.log(commissionFee);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

getFees();

export default {};
