import jwt from 'jsonwebtoken';
//@ts-ignore
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import ExpressError from '../utils/AppError.utils';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.jwt;
    if (!token) {
        return next(new ExpressError('You must be logged in to access this resource.', 401));
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (err) {
        return next(new ExpressError('Your session has expired or token is invalid. Please log in again.', 401));
    }
};

export default isAuthenticated;
// This middleware checks if the user is authenticated by verifying the JWT token.
// If the token is valid, it allows the request to proceed; otherwise, it returns an error.
// Usage: This middleware can be used in routes that require authentication, ensuring that only authenticated users can access those routes.
// Example usage in a route: