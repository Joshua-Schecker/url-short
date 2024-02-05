import { NextFunction, Request, Response } from 'express';
import { auth } from './firebaseConfig';

export const getAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('authorization');
  if (authHeader) {
    try {
      const token = await auth.verifyIdToken(authHeader.split('Bearer ')[1]);
      //@ts-ignore
      req.token = token;
      return next(); // Proceed to the next middleware/route handler
    } catch (err) {
      console.log(err);
      // Return here to prevent calling next() again after sending a response
      return res.status(401).json({
        message: 'Authentication Failed',
      });
    }
  } else {
    // If there's no authorization header, just move to the next middleware/route handler
    next();
  }
};
