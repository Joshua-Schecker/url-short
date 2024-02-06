import { Response } from 'express';

export function generateShortURL(_length?: number): string {
  const length = _length ?? parseInt(process.env.SHORT_URL_LENGTH ?? '5');
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


export enum ErrorTypes {
  RecordDoesNotExist = 'Record does not exist',
  RetryLimit = 'Unable to create record due to collison. Please try again',
  Unauthorized = 'Unauthorized',
  InternalServerError = 'Internal server error',
  Forbidden = 'Forbidden',
}

export const errorHandler = (error: Error, res: Response) => {
  console.error(error);
  switch (error.message) {
    case ErrorTypes.RecordDoesNotExist:
      res.status(404).send({ error: error.message });
      break;
    case ErrorTypes.RetryLimit:
      res.status(409).send({ error: error.message });
      break;
    case ErrorTypes.Unauthorized:
      res.status(401).send({ error: error.message });
      break;
    case ErrorTypes.Forbidden:
      res.status(403).send({ error: error.message });
      break;
    default:
      res.status(500).send({ error: ErrorTypes.InternalServerError });
      break;
  }
};
