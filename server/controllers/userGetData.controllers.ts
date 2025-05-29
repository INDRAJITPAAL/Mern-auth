import type {  Request,Response, NextFunction } from 'express';
import ExpressError from '../utils/AppError.utils';
import User from '../models/user.schema.model';
import { cleanUser } from '../utils/CleanUser.utils';


export const UserDta = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { UserID } = res.locals;
        const user = await User.findById(UserID);
        const cleanedUser = cleanUser(user);
        return res.status(200).json({
            status: "success",
            message: "User data fetched successfully",
            data: cleanedUser,
        });

    } catch (err) {
        return next(
            new ExpressError(
                (err instanceof Error ? err.message : "Unknown error") + " during fetching user data",
                500
            )
        );
    }
};