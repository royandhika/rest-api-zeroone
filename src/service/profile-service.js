import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { updateProfileValidation } from "../validation/profile-validation.js";
import { validate } from "../validation/validation.js";


// ------------------ PRIVATE ------------------
// Private berarti melewati auth-middleware, 
// berarti req.body PASTI punya user_id dan username 

const get = async (request) => {
    const profile = await prismaClient.profile.findUnique({
        where: {
            username: request.username
        },
        select: {
            username: true,
            fullname: true,
            phone: true,
            city: true,
            region: true
        }
    });

    if (!profile) {
        throw new ResponseError(404, "User not found");
    }

    return profile;
};

const update = async (request) => {
    const updateRequest = await validate(updateProfileValidation, request)

    const result = await prismaClient.profile.update({
        where: {
            username: updateRequest.username
        },
        data: updateRequest,
        select: {
            username: true,
            fullname: true,
            phone: true,
            city: true,
            region: true
        }
    })

    return result;
};


export default {
    get,
    update
}