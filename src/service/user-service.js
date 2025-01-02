import { loginUserValidation, registerUserValidation } from "../validation/user-validation.js"
import { validate, signToken, verifyToken } from "../validation/validation.js"
import { prismaClient } from "../application/database.js"
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid"

const register = async (request) => {
    // Request isinya req.body
    // Validasi format body
    const registerRequest = validate(registerUserValidation, request);

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    // Cari di db apakah udah ada
    const countUser = await prismaClient.user.findFirst({
        where: {
            OR: [
                { username: registerRequest.username },
                { email: registerRequest.email }
            ]
        }
    });

    const id = uuid().toString();
    registerRequest.id = id;

    // Format pengisian ke db 
    const user = {
        id: registerRequest.id,
        username: registerRequest.username,
        password: registerRequest.password,
        email: registerRequest.email,
        profile: {
            create: {
                username: registerRequest.username,
                phone: registerRequest.phone
            }
        }
    }

    // Kalau ada di db, status 400
    // Kalau belum baru insert ke db
    if (countUser) {
        throw new ResponseError(400, "Username or email already exist");
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
    // Request isinya req.body (+ useragent & ip)
    // Validasi format body
    const loginRequest = validate(loginUserValidation, request);

    // Cari di db apa bener udah ada
    // Kalau belum ada, status 401
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

    // Cek password
    // Kalau salah, status 401
    const isValidPassword = await bcrypt.compare(loginRequest.password, userExist.password);
    if (!isValidPassword) {
        throw new ResponseError(401, "Username or password wrong")
    };
    
    // Buat 2 token
    const refreshToken = await signToken(userExist, "refresh");
    const accessToken = await signToken(userExist, "access");

    // Buat session baru di db
    // Feedback refreshtoken untuk simpan ke cookies
    const result = await prismaClient.session.create({
        data: {
            user_id: userExist.id, 
            refresh_token: refreshToken,
            user_agent: loginRequest.userAgent,
            ip_address: loginRequest.ipAddress,
            is_active: 1,
        },
        select: {
            user_id: true
        }
    })

    result.access_token = accessToken;

    return [result, refreshToken];
}


const refresh = async (request) => {
    // Request isinya req.cookies
    // Verify refreshtoken 
    const user = request.refreshToken ? await verifyToken(request.refreshToken) : undefined;
    
    // Kalau gaada refreshtoken di cookies, status 401
    if (!user) {
        throw new ResponseError(401, "Unauthorized");
    };

    // Double validation, refreshtoken harus aktif di db
    const result = await prismaClient.session.findFirst({
        where: {
            refresh_token: request.refreshToken,
            is_active: 1,
        },
        select: {
            user_id: true,
            // username: true, 
            // refresh_token: true,
        }
    });
    // Kalau gaada di db, status 401
    if (!result) {
        throw new ResponseError(401, "Unauthorized");
    };
    
    const newAccessToken = await signToken(user, "access");
    result.access_token = newAccessToken;
    return result;
};





// ------------------ PRIVATE ------------------
// Private berarti melewati auth-middleware, 
// berarti req.body PASTI punya user_id dan username 

const logout = async (request) => {
    // Request isinya req.body
    // Soft delete session
    const result = await prismaClient.session.updateMany({
        where: {
            user_id: request.user_id,
            is_active: 1
        },
        data: {
            is_active: 0
        }
    })

    return result;
}

const get = async (request) => {
    // Request isinya req.body
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

    // Kalau di db gaada, status 404
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