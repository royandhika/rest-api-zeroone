import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);
// privateRouter.post("/api/auth/refresh", userController.refresh);
privateRouter.post("/api/auth/logout", userController.logout);
privateRouter.get("/api/user", userController.get);

export {
    privateRouter
};