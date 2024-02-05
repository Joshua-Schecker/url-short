import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import { getAuthToken } from './authMiddleware';
import { auth } from './firebaseConfig';
import { urlInputSchema, userRegistrationSchema } from './schemas';
import { createRecord } from './views/urls';
import asyncHandler from 'express-async-handler';

dotenv.config();
const port = process.env.PORT || 3001;

const app: Express = express();
app.use(express.json());
app.use(getAuthToken);

app.get('/', asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  const token = console.log(req.token);
  res.send();
}));

app.post('/register', async (req: Request, res: Response) => {
  const input = userRegistrationSchema.parse(req.body);
  const user = await auth.createUser(input);
  res.send({ user });
});

app.post('/api/v1/shorten', asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  if (!req.token) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }
  const input = urlInputSchema.parse(req.body);
    //@ts-ignore
    const result = await createRecord({ ...input, userId: req.token.uid })
    res.send( result);
}));

app.patch('/api/v1/:id', asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  if (!req.token) {
    res.status(401).send({ error: 'Unauthorized' });
  }
  const id = req.params.id;
  const input = urlInputSchema.parse(req.body);
  //@ts-ignore
  const result = await updateRecord(id, { ...input, userId: req.token.uid });
  res.send(result);
}));

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
