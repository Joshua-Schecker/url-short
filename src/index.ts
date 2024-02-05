import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { getAuthToken } from './authMiddleware';
import { auth } from './firebaseConfig';
import { urlInputSchema, userRegistrationSchema } from './schemas';
import { createRecord, updateRecord } from './views/urls';

dotenv.config();
const port = process.env.PORT || 3001;

const app: Express = express();
app.use(express.json());
app.use(getAuthToken);

app.get('/', async (req: Request, res: Response) => {
  //@ts-ignore
  const token = console.log(req.token);
  res.send();
});



app.post('/api/v1/shorten', async (req: Request, res: Response) => {
    //@ts-ignore
  if(!req.token) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
  const input = urlInputSchema.parse(req.body);
  //@ts-ignore
  const result  =await createRecord({ ...input, userId: req.token.uid });
  res.send(result);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
