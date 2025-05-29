// src/controllers/auth.controller.ts

//@ts-ignore
import { Request, Response, NextFunction } from "express";
import User from "../models/user.schema.model";
import ExpressError from "../utils/AppError.utils";
import { cleanUser } from "../utils/CleanUser.utils";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../config/nodemailer.config";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET must be defined in env");
}
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ExpressError("Name, email and password are required", 400));
    }

    const existing = await User.findOne({ email }).exec();
    if (existing) {
      return next(new ExpressError("User already exists", 400));
    }

    const hashed = await bcrypt.hash(password, 10);
    const newUser = await new User({ name, email, password: hashed }).save();

    // const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });
    // res.cookie("jwt", token, {
    //   httpOnly: true,
    //   secure: false,
    //   //@ts-ignore
    //   sameSite: "strict", // Use "None" in production if using HTTPS
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    // });

    try {
      // notify to your are registered
      const emailNotifyRegisteringOption = {
        email: email,
        subject: "thanks for registering",
        text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nPlease verify your email address to complete the registration process.`,
      };
      sendMail(emailNotifyRegisteringOption);

    } catch (err) {
      return next(new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during email verification",
        500
      ));
    }


    return res.status(201).json({
      status: "success",
      message: "User registered",
      data: cleanUser(newUser),
    });
  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during registration",
        500
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return next(new ExpressError("Email is required", 400));
    }
    if (!password) {
      return next(new ExpressError("Password is required", 400));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return next(new ExpressError("Invalid email ", 401));
    }

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return next(new ExpressError("Invalid  password", 401));
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false, // Set to true in production
      //@ts-ignore
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });




    return res.status(200).json({
      status: "success",
      message: "User logged in",
      token,
      data: cleanUser(user),
    });
  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during login",
        500
      )
    );
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false, // Set to true in production
      //@ts-ignore
      sameSite: false, // Use "None" in production if using HTTPS
    });

    return res.status(200).json({
      status: "success",
      message: "User logged out",
    });
  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during logout",
        500
      )
    );
  }
};



export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { UserID } = res.locals;

    if (!UserID) {
      return next(new ExpressError("UserId is required", 400));
    }

    const user = await User.findOne({ _id: UserID }).exec();
    if (!user) {
      return next(new ExpressError("User not found", 404));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    if (user.isVerified) {
      return next(new ExpressError("User is already verified", 400));
    }
    user.verifyOtp = otp;
    user.expireOtp = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    try {
      // sending otp to the user email
      const emailVerifyOptions = {
        email: user.email,
        subject: "Email Verification OTP",
        text: `Hello ${user.name},\n\nYour OTP for email verification is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
      };
      sendMail(emailVerifyOptions);
    } catch (err) {
      return next(new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during email verification",
        500
      ));
    }

    return res.status(200).json({
      status: "success",
      message: "OTP sent successfully to your email",
    });

  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during sending OTP",
        500
      )
    );
  }
}

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { UserID } = res.locals;
    const { otp } = req.body;
    if (!UserID || !otp) {
      return next(new ExpressError("UserId and OTP are required", 400));
    }

    const user = await User.findOne({ _id: UserID }).exec();
    if (!user) {
      return next(new ExpressError("User not found", 404));
    }
    if (user.isVerified) {
      return next(new ExpressError("User is already verified", 400));
    }
    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return next(new ExpressError("Invalid OTP", 400));
    }
    if (user.expireOtp < Date.now()) {
      return next(new ExpressError("OTP has expired", 400));
    }
    user.isVerified = true;
    user.verifyOtp = "";
    user.expireOtp = 0;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "User verified successfully",
      data: cleanUser(user),
    });
  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during OTP verification",
        500
      )
    );
  }
};


export const sendResetOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next(new ExpressError("Email is required", 400));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return next(new ExpressError("User not found", 404));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    user.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    try {
      // sending otp to the user email
      const emailResetOptions = {
        email: user.email,
        subject: "Password Reset OTP",
        text: `Hello ${user.name},\n\nYour OTP for password reset is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
      };
      sendMail(emailResetOptions);
    }
    catch (err) {
      return next(new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during email verification",
        500
      ));
    }
    return res.status(200).json({
      status: "success",
      message: "Reset OTP sent successfully to your email",
    });
  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during sending reset OTP",
        500
      )
    );
  }
};



export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return next(new ExpressError("Email, OTP and new password are required", 400));
    }

    const user = await User.findOne({ email }).exec();
    if (!user) {
      return next(new ExpressError("User not found", 404));
    }
    if (user.resetOtp === '' || user.resetOtp !== otp) {
      return next(new ExpressError("Invalid OTP", 400));
    }
    if (user.resetOtpExpire < Date.now()) {
      return next(new ExpressError("OTP has expired", 400));
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    user.resetOtp = "";
    user.resetOtpExpire = 0;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Password reset successfully",
      data: cleanUser(user),
    });
  } catch (err) {
    return next(
      new ExpressError(
        (err instanceof Error ? err.message : "Unknown error") + " during password reset",
        500
      )
    );
  }
};