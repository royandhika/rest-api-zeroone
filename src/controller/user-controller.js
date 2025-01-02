import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
        // Lempar body ke service
        const result = await userService.register(req.body);

        res.status(200).json({
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

const login = async (req, res, next) => {
    try {
        req.body.userAgent = req.headers['user-agent'];
        req.body.ipAddress = req.ip;
        // Lempar body ke service (+ useragent & ip)
        const [result, refreshToken] = await userService.login(req.body);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000, // Expired 24 jam di cookie
        });
        
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const refresh = async (req, res, next) => {
    try {
        // Lempar cookies ke service
        const result = await userService.refresh(req.cookies);
        
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};



// ------------------ PRIVATE ------------------
// Private berarti melewati auth-middleware, 
// berarti req.body PASTI punya user_id dan username 

const logout = async (req, res, next) => {
    try {
        // Lempar body ke service
        const result = await userService.logout(req.body);
        
        // Hapus cookies
        res.clearCookie('refreshToken');
        // Hapus session storage
        // DARI SISI FRONTEND

        res.status(200).json({
            // data: result,
            message: "Logout success"
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
        // Lempar body ke service
        const result = await userService.get(req.body)

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    login,
    refresh,
    logout,
    get
};