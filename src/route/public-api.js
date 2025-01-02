import express from "express";
import userController from "../controller/user-controller.js";

const publicRouter = new express.Router();
// users
publicRouter.post("/api/users", userController.register);
publicRouter.post("/api/sessions", userController.login);
publicRouter.post("/api/sessions/refresh", userController.refresh);

export {
    publicRouter
};