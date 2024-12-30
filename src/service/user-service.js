import { loginUserValidation, registerUserValidation } from "../middleware/user-validation.js"
import { refreshAccessToken, getToken, validate } from "../middleware/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    user.password = await bcrypt.hash(user.password, 10);

    const countUser = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });
    const countEmail = await prismaClient.user.count({
        where: {
            email: user.email
        }
    });

    const id = uuid().toString();
    user.id = id;

    if (countUser != 0) {
        throw new ResponseError(400, "Username already exist");
    } else if (countEmail != 0) {
        throw new ResponseError(400, "Account with the same email already registered");
    } else {
        return prismaClient.user.create({
            data: user,
            select: {
                id: true,
                username: true,
            }
        });
    } 
    
}


const login = async (request) => {
    const userLogin = validate(loginUserValidation, request);
    const userExist = await prismaClient.user.findUnique({
        where: {
            username: userLogin.username
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

    const isValidPassword = await bcrypt.compare(userLogin.password, userExist.password);
    if (!isValidPassword) {
        throw new ResponseError(401, "Username or password wrong")
    };
    
    const [refreshToken, accessToken] = await getToken(userExist);

    const result = await prismaClient.token.create({
        data: {
            user_id: userExist.id,
            username: userExist.username,
            refresh_token: refreshToken,
            expired_at: new Date(Date.now() + (8 * 60 * 60 * 1000)),
        }, 
        select: {
            username: true,
        }
    });

    return [result, refreshToken, accessToken];
}


const refresh = async (refreshToken) => {
    if (!refreshToken) {
        throw new ResponseError(401, "Refresh token is not valid")
    }
    const tokenExist = await prismaClient.token.findFirst({
        where: {
            refresh_token: refreshToken,
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

    if (!tokenExist) {
        throw new ResponseError(401, "Refresh token is not valid")
    }
    const newAccessToken = await refreshAccessToken(refreshToken);

    return [tokenExist, newAccessToken];
}

export default {
    register,
    login,
    refresh
}