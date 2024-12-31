import { loginUserValidation, registerUserValidation } from "../middleware/user-validation.js"
import { validate, signToken, verifyToken } from "../middleware/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"

const register = async (request) => {
    const registerRequest = validate(registerUserValidation, request);

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const countUser = await prismaClient.user.count({
        where: {
            username: registerRequest.username
        }
    });
    const countEmail = await prismaClient.user.count({
        where: {
            email: registerRequest.email
        }
    });

    const id = uuid().toString();
    registerRequest.id = id;

    if (countUser != 0) {
        throw new ResponseError(400, "Username already exist");
    } else if (countEmail != 0) {
        throw new ResponseError(400, "Account with the same email already registered");
    } else {
        return prismaClient.user.create({
            data: registerRequest,
            select: {
                id: true,
                username: true,
            }
        });
    } 
    
}


const login = async (request) => {
    const loginRequest = validate(loginUserValidation, request);
    const userExist = await prismaClient.user.findUnique({
        where: {
            username: loginRequest.username
        },
        select: {
            id: true,
            username: true,
            password: true
        }
    });
    if (!userExist) {
        throw new ResponseError(401, "Username or password wrong")
    }

    const isValidPassword = await bcrypt.compare(loginRequest.password, userExist.password);
    if (!isValidPassword) {
        throw new ResponseError(401, "Username or password wrong")
    };
    
    const refreshToken = await signToken(userExist, "refresh");
    const accessToken = await signToken(userExist, "access");

    const result = await prismaClient.token.create({
        data: {
            user_id: userExist.id,
            username: userExist.username,
            refresh_token: refreshToken,
            expired_at: new Date(Date.now() + (31 * 60 * 60 * 1000)), // 24 jam dari sekarang
        }, 
        select: {
            username: true,
        }
    });

    result.access_token = accessToken;

    return [result, refreshToken];
}


const refresh = async (request) => {
    const user = await verifyToken(request);
    if (!user) {
        throw new ResponseError(401, "Unauthorized");
    };

    const newAccessToken = await signToken(user, "access");

    const result = await prismaClient.token.findFirst({
        where: {
            refresh_token: request,
            expired_at: {
                gt: new Date(Date.now() + (7 * 60 * 60 * 1000)),
            },
        },
        select: {
            // user_id: true,
            username: true, 
            // refresh_token: true,
        }
    });

    if (!result) {
        throw new ResponseError(401, "Unauthorized");
    };
    
    result.access_token = newAccessToken;
    return result;
};


const logout = async (request) => {
    const user = await verifyToken(request);
    if (!user) {
        throw new ResponseError(401, "Unauthorized")
    }

    const result = await prismaClient.token.deleteMany({
        where: {
            username: user.username
        }
    });

    return result;
}

const get = async (request) => {
    const user = await prismaClient.user.findUnique({
        where: {
            username: request.username
        },
        select: {
            id: true,
            username: true,
            email: true
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    } 

    return user;
}

export default {
    register,
    login,
    refresh,
    logout,
    get
}