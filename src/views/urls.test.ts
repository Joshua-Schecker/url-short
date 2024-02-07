import { urlCollection } from '../firebaseConfig';
// export function mockClass<T extends jest.Constructable>(c: T): jest.MockedClass<T>['prototype'] {
//     return (c as jest.MockedClass<T>).prototype;
//   }
import { UrlResourceSchema } from '../schemas';
import { createRecord } from './urls';

const mockUserId = '1234';
const url = 'https://www.google.com';
const mockResource = (params?: UrlResourceSchema) => ({
  shortUrl: 'https://not.com/abc123',
  url: url,
  userId: mockUserId,
  ...params,
});

const getMock = jest.fn(() => Promise.resolve({ exists: true, data: () => mockResource() }));
const setMock = jest.fn(() => Promise.resolve());
const updateMock = jest.fn(() => Promise.resolve());

jest.mock('../firebaseConfig', () => {
  return {
    urlCollection: {
      doc: () => ({
        get: getMock,
        set: setMock,
        update: updateMock,
      }),
    },
  };
});

describe('createRecord', () => {
  beforeEach(() => {
    getMock.mockResolvedValue({ exists: true, data: () => mockResource() });
    setMock.mockResolvedValue();
    updateMock.mockResolvedValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a record in the database and return it', async () => {
    const result = await createRecord({ url }, mockUserId);

    expect(urlCollection.doc().set).toHaveBeenCalledWith({
      url,
      userId: mockUserId,
      shortUrl: expect.any(String),
    });
    expect(urlCollection.doc().get).toHaveBeenCalled();
    expect(new URL(result.shortUrl)).toBeDefined(); // check if it's a valid URL
  });
  it('should retry on collision', async () => {
    setMock.mockRejectedValueOnce({ code: 'ALREADY_EXISTS' }).mockResolvedValueOnce();

    await createRecord({ url }, mockUserId);

    expect(urlCollection.doc().set).toHaveBeenCalledTimes(2);
  });
  it('should throw after 3 retries', async () => {
    setMock.mockRejectedValue({ code: 'ALREADY_EXISTS' });

    await expect(createRecord({ url }, mockUserId, 3)).rejects.toThrow();
    
    expect(urlCollection.doc().set).toHaveBeenCalledTimes(4);
  });
});
