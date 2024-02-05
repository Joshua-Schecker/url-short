import { NextFunction, Request, Response } from 'express';
import { auth } from './firebaseConfig';

export const getAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('authorization');
  if (authHeader) {
    try {
      const token = await auth.verifyIdToken(authHeader.split('Bearer ')[1]);
      //@ts-ignore
      req.token = token;
      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Authentification Failed',
      });
    }
  }
  next();
};
