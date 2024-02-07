import { generateShortPath } from '../utils';
describe('generateShortURL', () => {
  beforeEach(() => {
    process.env.SHORT_URL_LENGTH = '10';
  });
  it('should generate a valid short URL with length from env', () => {
    const shortPath = generateShortPath();
    expect(shortPath.length).toBe(10);
    const shortPath2 = generateShortPath();
    expect(shortPath2.length).toBe(10);
    expect(shortPath).not.toEqual(shortPath2);
  });
});
