import userService from "../service/user-service.js";

const register = async (req, res, next) => {
    try {
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
        const result = await userService.refresh(req.cookies.refreshToken);
        
        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e);
    }
};

const logout = async (req, res, next) => {
    try {
        const result = await userService.logout(req.cookies.refreshToken);
        
        // Hapus cookies
        res.clearCookie('refreshToken');
        // Hapus session storage
        // clear session storage di frontend

        res.status(200).json({
            data: result,
            message: "Logout success"
        });
    } catch (e) {
        next(e);
    }
};

const get = async (req, res, next) => {
    try {
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