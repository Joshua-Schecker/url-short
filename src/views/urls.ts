import { db } from '../firebaseConfig';
import { UrlResourceSchema } from '../schemas';
import { isFirebaseError } from '../types/typeAssertions';
import { generateShortURL } from '../utils';

export const createRecord = async (data: UrlResourceSchema, retries = 3) => {
  try {
    const id = generateShortURL();
    await db.collection('urls').doc(id).set(data);
    return  await db.collection('urls').doc(id).get();
  } catch (error) {
    if (retries <= 0) {
      return Promise.reject('Unable to create record. Maximum number of retries reached.');
    }

    if (isFirebaseError(error)) {
      if (error.code === 'ALREADY_EXISTS') {
        return createRecord(data, retries - 1);
      }
    }
    return Promise.reject(error);
  }
};
