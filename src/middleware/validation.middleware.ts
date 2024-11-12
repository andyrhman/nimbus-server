import { ValidationError } from 'class-validator';
import express, { ErrorRequestHandler } from 'express';

export const ValidationMiddleware: ErrorRequestHandler = (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
): void | Promise<void> => {
    if (Array.isArray(err) && err[0] instanceof ValidationError) {
        const formattedErrors = err.map(e => {
            const constraints = e.constraints;
            const messages = constraints ? Object.values(constraints) : [];
            return { message: messages[0] }; // This will return only the first error message
        });

        // Filter out undefined messages if any field did not have a constraint violation
        const errorMessages = formattedErrors.filter(e => e.message).map(e => e.message);

        res.status(400).json({ errors: errorMessages });
        return undefined; // Explicitly return undefined to match void return type
    }

    // If it's not a validation error, just pass it on
    next(err);
};
