import { db } from '../firebaseConfig';
import { UrlResourceSchema, urlResourceSchema } from '../schemas';
import { isFirebaseError } from '../types/typeAssertions';
import { generateShortURL } from '../utils';

export const createRecord = async (data: UrlResourceSchema, retries = 3) => {
  try {
    const id = generateShortURL();
    await db.collection('urls').doc(id).set(data);
    const result = await db.collection('urls').doc(id).get();
    return getRecordById(id);
  } catch (error) {
    if (retries <= 0) {
      return Promise.reject('Unable to create record. Maximum number of retries reached.');
    }

    if (isFirebaseError(error)) {
      if (error.code === 'ALREADY_EXISTS') {
        return await createRecord(data, retries - 1);
      }
    }
    return Promise.reject(error);
  }
};

export const updateRecord = async (id: string, data: UrlResourceSchema) => {
  const record = await db.collection('urls').doc(id).get();
  if (!record.exists) {
    return Error('Record does not exist');
  }
  if (record.data()?.userId !== data.userId) {
    return Error('Unauthorized');
  }
  db.collection('urls').doc(id).update({ url: data.url });
  return await getRecordById(id);
};

export const getRecordById = async (id: string): Promise<UrlResourceSchema> => {
  const result = await db.collection('urls').doc(id).get();
  if (!result.exists) {
    return Promise.reject('Record does not exist');
  }
  return urlResourceSchema.parse({ ...result.data(), id: result.id });
};
