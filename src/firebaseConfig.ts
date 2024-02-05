import admin from 'firebase-admin';
import serviceAccount from '../service_account.json';

admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount),
});

export const db = admin.firestore();
export const auth = admin.auth();
