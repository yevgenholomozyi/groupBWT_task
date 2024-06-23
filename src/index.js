// Services
import { getCommissions } from './services/getCommissions';

// Helpers
import { convertTransactionsToCamelCase } from '@/helpers';
import { validateTransactions } from '@/helpers/validation';

const fs = require('fs');
const path = require('path');

const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide the path to a JSON file as an argument.');
  process.exit(1);
}

const processTransactions = (filePath) => {
  const resolvedPath = path.resolve(filePath);

  fs.readFile(resolvedPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    try {
      const transactions = JSON.parse(data);
      const isValidated = validateTransactions(transactions);

      if (!isValidated) {
        console.error(
          'An error occurred while validating transactions. The incoming data can not be processed.'
        );
        process.exit(1);
      }

      const updatedTransactions = convertTransactionsToCamelCase(transactions);
      console.log(updatedTransactions);
      const commissions = getCommissions(updatedTransactions);
      commissions.forEach((commission) => {
        console.log(commission);
      })
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      process.exit(1);
    }
  });
};

processTransactions(filePath);
