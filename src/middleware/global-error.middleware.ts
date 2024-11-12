import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    keyValue?: Record<string, string>;
    path?: string;
}

export const errorMiddleware = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    err.message = err.message;
    err.statusCode = err.statusCode || 500;
    console.error(err);
    res.status(err.statusCode).json({ message: "Internal Server Error" });
};

export const asyncError = (
    passedFunc: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(passedFunc(req, res, next)).catch(next);
};