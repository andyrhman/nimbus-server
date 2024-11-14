import { ValidationError } from "class-validator";
import express, { Request, Response, NextFunction } from "express";

export const ValidationMiddleware: any = (
  err: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (Array.isArray(err) && err[0] instanceof ValidationError) {
    const formattedErrors = err.map((e) => {
      const constraints = e.constraints;
      const messages = constraints ? Object.values(constraints) : [];
      return { message: messages[0] };
    });

    const errorMessages = formattedErrors
      .filter((e) => e.message)
      .map((e) => e.message);

    return res.status(400).json({ errors: errorMessages });
  }

  return next(err);
};

export function validateFile(req: Request, res: Response, next: NextFunction) {
  if (!req.file) {
    return res.status(400).json({ message: 'Thumbnail file is required' });
  }
  next();
}
