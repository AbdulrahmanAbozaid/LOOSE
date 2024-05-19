import express from "express";
import cors from "cors";
import API from "../routes/index.routes.js";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import AppError from "../utils/app_error.js";
import GlobeErrorHandler from "../middlewares/error_handler.js";
var app = express();
app.use(express.json({
  limit: "20kb"
}));
app.use(express.urlencoded({
  extended: false,
  limit: "30mb"
}));
app.use(cors({
  allowedHeaders: "*",
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
var limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});
app.use("/api", limiter);
app.use(API);
app.all("*", function (req, res, next) {
  next(new AppError("Can't find ".concat(req.originalUrl, " on this server!"), 404));
});
app.use(GlobeErrorHandler);
export default app;