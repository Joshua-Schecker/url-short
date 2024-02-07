import { urlCollection } from '../firebaseConfig';
import { UrlInputSchema, UrlResourceSchema, urlResourceSchema } from '../schemas';
import { isFirebaseError } from '../types/typeAssertions';
import { ErrorTypes, generateShortPath } from '../utils';

export const createRecord = async (data: UrlInputSchema, userId: string, retries = 3) => {
  try {
    const id = generateShortPath();
    const shortUrl = `${process.env.BASE_URL}/${id}`;
    await urlCollection.doc(id).set({ ...data, userId, shortUrl });
    await urlCollection.doc(id).get();
    return getRecordById(id);
  } catch (error) {
    if (retries <= 0) {
      throw new Error(ErrorTypes.RetryLimit);
    }

    if (isFirebaseError(error)) {
      // retry on ID collision
      if (error.code === 'ALREADY_EXISTS') {
        //TODO: find const value for this error code
        return await createRecord(data, userId, retries - 1);
      }
    }
    throw error;
  }
};

export const updateRecord = async (id: string, userId: string, data: UrlInputSchema) => {
  const record = await urlCollection.doc(id).get();
  if (!record.exists) {
    return Error(ErrorTypes.RecordDoesNotExist);
  }
  if (record.data()?.userId !== userId) {
    return Error(ErrorTypes.Unauthorized);
  }
  urlCollection.doc(id).update({ ...record, url: data.url });
  return await getRecordById(id);
};

export const getRecordById = async (id: string): Promise<UrlResourceSchema> => {
  const result = await urlCollection.doc(id).get();
  if (!result.exists) {
    return Promise.reject(ErrorTypes.RecordDoesNotExist);
  }
  return urlResourceSchema.parse({ ...result.data(), id: result.id });
};
