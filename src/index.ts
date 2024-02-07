import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { getAuthToken } from './authMiddleware';
import { auth } from './firebaseConfig';
import { urlInputSchema, userRegistrationSchema } from './schemas';
import { errorHandler } from './utils';
import { createRecord, getRecordById, updateRecord } from './views/urls';

dotenv.config();
const port = process.env.PORT || 3001;

const app: Express = express();
app.use(express.json());
app.use(getAuthToken);

app.post('/register', async (req: Request, res: Response) => {
  const input = userRegistrationSchema.parse(req.body);
  const user = await auth.createUser(input);
  res.send({ user });
});

app.post(
  '/api/v1/shorten',
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    if (!req.token) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const input = urlInputSchema.parse(req.body);
    try {
      //@ts-ignore
      const result = await createRecord(input, req.token.uid);
      res.send(result);
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

app.patch(
  '/api/v1/:id',
  asyncHandler(async (req: Request, res: Response) => {
    //@ts-ignore
    if (!req.token) {
      // TODO: convert to middleware
      res.status(401).send({ error: 'Unauthorized' });
    }
    const id = req.params.id;
    const input = urlInputSchema.parse(req.body);
    try {
      //@ts-ignore
      const result = await updateRecord(id, req.token.uid, input);
      res.send(result);
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

app.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const record = await getRecordById(req.params.id);
      res.redirect(301, record.url);
    } catch (error) {
      errorHandler(error, res);
    }
  })
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
