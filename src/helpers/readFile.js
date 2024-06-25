// Base
import { promises as fs } from 'fs';

export async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file from path ${filePath}:`, error);
    throw error;
  }
}

export default {};
