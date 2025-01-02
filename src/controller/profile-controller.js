import profileService from "../service/profile-service.js";


// ------------------ PRIVATE ------------------
// Private berarti melewati auth-middleware, 
// berarti req.body PASTI punya user_id dan username 

const get = async (req, res, next) => {
    try {
        const result = await profileService.get(req.body);

        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await profileService.update(req.body);

        res.status(200).json({
            data: result,
        })
    } catch (e) {
        next(e);
    }
}

export default {
    get,
    update
}