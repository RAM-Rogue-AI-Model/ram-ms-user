import { NextFunction, Request, Response } from 'express';

import { RequestWithUser } from '../types/Request';

const requestDetails = (
  req: Request | RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const today = new Date();
  // eslint-disable-next-line no-console
  console.log(req.method + ' - ' + req.url + ' - ' + today.toLocaleString());
  next();
};

export { requestDetails };
