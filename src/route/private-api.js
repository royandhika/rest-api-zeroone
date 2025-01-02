import express from "express";
import userController from "../controller/user-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import profileController from "../controller/profile-controller.js";

const privateRouter = new express.Router();
privateRouter.use(authMiddleware);
// users
privateRouter.delete("/api/sessions", userController.logout);
privateRouter.get("/api/users/me", userController.get);
// profiles
privateRouter.get("/api/profiles/me", profileController.get);
privateRouter.put("/api/profiles/me", profileController.update);
// privateRouter.get("/api/profiles/:id", profileController.get);

export {
    privateRouter
};