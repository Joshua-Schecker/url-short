import { FirebaseError } from 'firebase-admin';

export function isFirebaseError(err: any): err is FirebaseError {
  return err.code !== undefined;
}
