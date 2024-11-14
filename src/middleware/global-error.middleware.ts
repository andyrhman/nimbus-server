import dotenv from 'dotenv';
import { Request, Response, NextFunction } from "express";
dotenv.config();

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

export const asyncError: any = (
    passedFunc: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction): void => {
    if (process.env.NODE_ENV === 'development') Promise.resolve(passedFunc(req, res, next)).catch(next);
};