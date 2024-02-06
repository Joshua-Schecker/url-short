import { db } from '../firebaseConfig';
import { UrlInputSchema, UrlResourceSchema, urlResourceSchema } from '../schemas';
import { isFirebaseError } from '../types/typeAssertions';
import { generateShortURL } from '../utils';

export const createRecord = async (data: UrlInputSchema, userId: string, retries = 3) => {
  try {
    const id = generateShortURL();
    const shortUrl = `${process.env.BASE_URL}/${id}`;
    await db
      .collection('urls')
      .doc(id)
      .set({ ...data, userId, shortUrl });
    await db.collection('urls').doc(id).get();
    return getRecordById(id);
  } catch (error) {
    if (retries <= 0) {
      return Promise.reject('Unable to create record. Maximum number of retries reached.');
    }

    if (isFirebaseError(error)) {
      // retry on ID collision
      if (error.code === 'ALREADY_EXISTS') {
        //TODO: find const value for this error code
        return await createRecord(data, userId, retries - 1);
      }
    }
    return Promise.reject(error);
  }
};

export const updateRecord = async (id: string, userId: string, data: UrlInputSchema) => {
  const record = await db.collection('urls').doc(id).get();
  if (!record.exists) {
    return Error('Record does not exist');
  }
  if (record.data()?.userId !== userId) {
    return Error('Unauthorized');
  }
  db.collection('urls')
    .doc(id)
    .update({ ...record, url: data.url });
  return await getRecordById(id);
};

export const getRecordById = async (id: string): Promise<UrlResourceSchema> => {
  const result = await db.collection('urls').doc(id).get();
  if (!result.exists) {
    return Promise.reject('Record does not exist');
  }
  return urlResourceSchema.parse({ ...result.data(), id: result.id });
};
