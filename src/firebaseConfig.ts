import admin from 'firebase-admin';
import serviceAccount from '../service_account.json';

admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount),
});

export const urlCollection = admin.firestore().collection('urls');
export const auth = admin.auth();
