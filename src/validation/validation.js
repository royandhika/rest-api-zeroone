import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const jwtKey = process.env.JWT_SECRET_KEY;

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
        // allowUnknown: true
    })
    if (result.error) {
        throw new ResponseError(400, result.error.message);
    } else {
        return result.value
    }
};

const signToken = async (user, type) => {
    const expiresIn = type === "refresh" ? "1d"
        : type === "access" ? "15m"
        : undefined;

    const token = jwt.sign(
        {id: user.id, username: user.username},
        jwtKey,
        {expiresIn: expiresIn}
    );

    return token;
}

const verifyToken = async (token) => {
    try {
        const user = jwt.verify(token, jwtKey);
        return user;
    } catch {
        const user = undefined;
        return user;
    }
    // return new Promise((resolve, reject) => {
    //     jwt.verify(token, jwtKey, (err, decoded) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(decoded);
    //         }
    //     });
    //   });
};


export {
    validate,
    signToken,
    verifyToken,
};