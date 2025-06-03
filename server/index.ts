import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
import ExpressError from "./utils/AppError.utils";
import authRoutes from "./routes/Auth.routes";
import dataRoutes from "./routes/UserData.routes";

//db connection
import connectDB from "./config/mongoDB.config";





app.use(cors({
  origin: 'http://localhost:5173', // your frontend origin
  credentials: true,               // ✅ allow cookies
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", dataRoutes);

// @ts-ignore
app.use("*", (req, res, next) => {
  next(new ExpressError("Not Found !", 404));
});

//@ts-ignore
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  console.log(err.message, err.statusCode);
  return res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  })
});

const main = () => {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      console.log("MongoDB connected successfully");
      app.listen(PORT, () => {
        console.log(`http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}
main();


