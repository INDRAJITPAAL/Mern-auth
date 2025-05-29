import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

import ExpressError from "../utils/AppError.utils";

const asignIdInLocals = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
        return next(new ExpressError("Unauthorized", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;

        if (!decoded || !decoded.id) {
            return next(new ExpressError("Invalid token payload", 401));
        }

        // Store userId in res.locals
        res.locals.UserID = decoded.id;

        return next();
    } catch (err) {
        return next(new ExpressError("Invalid token", 401));
    }
};

export default asignIdInLocals;