import express from "express";
import { publicRouter } from "../route/public-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import cookieParser from 'cookie-parser';
import { privateRouter } from "../route/private-api.js";

export const web = express();

web.use(express.json());
web.use(cookieParser());
web.use(publicRouter);
web.use(privateRouter);
web.use(errorMiddleware);