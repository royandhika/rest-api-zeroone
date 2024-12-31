import { verifyToken } from "./validation.js";

const authMiddleware = async (req, res, next) => {
    const accessToken = req.headers['authorization']?.split(' ')[1];
    const isValidAccessToken = await verifyToken(accessToken);

    if (!isValidAccessToken) {
        res.status(401).json({
            errors: "Unauthorized"
        }).end();
    } else {
        req.body.username = isValidAccessToken.username;
        next();
    }
};

export {
    authMiddleware
};