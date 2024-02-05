import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { UrlInputSchema } from "./schemas";
import { generateShortURL } from "./utils";
import admin from "firebase-admin";
import serviceAccount from "../service_account.json";

dotenv.config();
const port = process.env.PORT || 3000;

const app: Express = express();
app.use(express.json()) 



// const db = new Firestore({
//   projectId: 'crucial-study-413116',
//   client_email: 'shortcut-firestore@crucial-study-413116.iam.gserviceaccount.com', 
//   private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCs+z73gdaZQuqe\nEA3W45uRmspRhip8/EylhteEWRAmzL1I/tUb7DDhyuT5Pgn4kK5bDT0xs+hASvl/\nXHboqtKwqkkxR/Zk81WtD74N//8AuLxbCzAl9XvG6aWa0kCXpl1xsrTJOESHl0Da\nSGNK7qNntbty4ekWKlTmbXr+/QNxxi9azOyT79wQwjO4Efhlxdr80o9rZ5yznnAM\nDimfmunL+IvwIzONX/A6+bmbWR7zBwXwOliMhATEmTklYHPmOVuJi84I6GMy2ifx\nttc9Ja9rzIPoJ2hEK/NOM9f9Hwr/9m53YT2M17VhianPkNNPIz7vDsJhzHKxz4Yf\nn7z8DseNAgMBAAECggEAGu7Tkv3oR9yfYxTk0ryFkFolfiQBoYw28t7X14d2eFQQ\ndLkYvUw9ICrTE+uQ6d69Bvg8uuxkEP6bcjUXXoqaW19oHgAyYO1yPYvh75QYRCh/\nSz2mtYJPT105p61s2S/SBM3qUBousV3ffx0eOKCHWLJ3CSAbhpP4vBf3upPyYVhU\nPhNwCjhvisqq7GLoun+079yyr0nqdTQxxODXUZ3w3BJffh4j3UlogcCIzma71B4I\npOp7lbDq8WCSuGZmk3+KyJc03zzk00j7pWOnGIXSjwAz4IdAesA14iEYG+aXj7So\n+AauUIYPrB8ahNtaGf1A0PbWRMnuoSAROvXGltuEgQKBgQDrY666kqDsZ1W1zB04\nAa8j+0hCji8kmm6y+kk4HGnWUbxkxII241FurgA5QaqWZRe87/5ixTEr6/A6Q3sJ\ncso5ZtNIpfPgNMHDC663ySheAnoz0tvBggXicyX22FoXpfSVsBfPD7mdVM8N/smo\nIlsBUSBPBgBSPv+syKZzWEMFmQKBgQC8IKwKhl0+DoYjoL7vOGyhipTF/YTk5yTt\nHIq73MZwdDuphDMNCUJxnZtoF3Xg5MsjmH3HaUfK1vdeZNQUmgRM+6I0ve5JyXcN\nu5mfTFO+rMoph4TTxD0hjk9ai6nea6nrulmhSYbbe3Lj+F7T70g4cXvd8VFo7UZo\nKorcVvkiFQKBgAzBDvOfBEcq5jL+h0rElJfPgr/Qcm96Sqs58oOuznFFZn7TQvb0\nZDIqDWsMytBxU9Lx8geqBZsKoq6Vf3IonRp1Hted3lP0p9cIqAPfS2eknLh4IV4f\nzG/Tq2fvmxoS7Oi7bN7UTEthEAMDHiwVCHdOzQBbI+NQ9IuJJ7OyQZdpAoGAS0ZL\ncH6o6n7HP5Q/MdsC5HRd6Qby2OCADvwfquHA6RgpE0AZaTruQiXNHA5fFViWy6xl\nj5fZqRjwq+1uSrwBwofhNHdW1GFvaKhK5MmWrLHYxls6U72utDGMIO/HTX8I45CR\n8o5IDqRLqVolH2ocHLGT3Y+EgpaGWIHFRDrsvq0CgYEAksXxrrw1mxd444A9DMyz\n3yh+ZKqwYgqf33MfRTPAJ59IYBVneojcdSDKBJEeB54LgSpc5MAKuzxNbBAgBlkp\nLWZYea1IbS6NhNY8bIvGXybSViPzQgjgqWoqzjYnp+/nNATPy4XvNWE9zGKnlQ2e\n1ZMlysGF+2YTUvU48SlztAA=\n-----END PRIVATE KEY-----\n'
// });



admin.initializeApp({
  //@ts-ignore
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get("/", (req: Request, res: Response) => {
  // const input = UrlInputSchema.parse(req.params);
  res.send()
});

app.post("/api/v1/shorten", async (req: Request, res: Response) => {
  const input = UrlInputSchema.parse(req.body);
  const shortUrl = generateShortURL()
  const docRef = await db.collection('urls').doc(shortUrl).set({url: input.url});
  const result = await db.collection('urls').doc(shortUrl).get();
  res.send({ result:result.data() });
});


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});