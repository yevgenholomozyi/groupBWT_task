import { promises as fs } from 'fs';
import { readFile } from '@/helpers/readFile';

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
  },
}));

describe('readFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should read file and return its content', async () => {
    const mockFilePath = '/path/to/mock/file.txt';
    const mockFileContent = JSON.stringify('This is a mock file content');

    fs.readFile.mockResolvedValue(mockFileContent);

    const data = await readFile(mockFilePath);
    expect(data).toBe(JSON.parse(mockFileContent));
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf8');
  });

  it('should throw an error if file reading fails', async () => {
    const mockFilePath = '/path/to/mock/file.txt';
    const mockError = new Error('Failed to read file');

    fs.readFile.mockRejectedValue(mockError);

    await expect(readFile(mockFilePath)).rejects.toThrow('Failed to read file');
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf8');
  });
});
