import { ResponseError } from "../error/response-error.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
const jwtKey = process.env.JWT_SECRET_KEY;

const validate = (schema, request) => {
    const result = schema.validate(request, {
        abortEarly: false,
    })
    if (result.error) {
        throw new ResponseError(400, result.error.message);
    } else {
        return result.value
    }
};

const getToken = async (user) => {
    const refreshToken = jwt.sign(
        {id: user.id, username: user.username}, 
        jwtKey,
        {expiresIn: "1m",} // Expired 1 menit di jwt
    ); 
    
    const accessToken = jwt.sign(
        {id: user.id, username: user.username}, 
        jwtKey,
        {expiresIn: "1h",} // Expired 1 jam di jwt
    ); 
    
    return [refreshToken, accessToken]
}

const refreshAccessToken = async (token) => {
    const user = jwt.verify(token, jwtKey);

    const newAccessToken = jwt.sign(
        {id: user.id, username: user.username}, 
        jwtKey,
        {expiresIn: "1m",} // Expired 1 menit di jwt
    ); 

    return newAccessToken;
}

const signToken = async (user, type) => {
    const expiresIn = type === "refresh" ? "1h"
        : type === "access" ? "1m"
        : undefined;


    const token = jwt.sign(
        {id: user.id, username: user.username},
        jwtKey,
        {expiresIn: expiresIn}
    );

    return token;
}

const verifyToken = async (token) => {
    const user = jwt.verify(token, jwtKey);

    return user;
}

export {
    validate,
    // getToken,
    // refreshAccessToken,
    signToken,
    verifyToken,
};