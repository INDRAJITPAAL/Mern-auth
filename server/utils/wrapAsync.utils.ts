import { Request, Response, NextFunction } from 'express';

function asyncWrap(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((err: Error) => {
      next(err);
    });
  };
}
export default asyncWrap;
