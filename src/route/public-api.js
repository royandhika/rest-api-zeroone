import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
publicRouter.post("/api/auth/register", userController.register);
publicRouter.post("/api/auth/login", userController.login);
publicRouter.post("/api/auth/refresh", userController.refresh);
publicRouter.post("/api/auth/logout", userController.logout);

export {
    publicRouter
};