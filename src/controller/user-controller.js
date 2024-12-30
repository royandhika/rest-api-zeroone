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
        const [result, refreshToken, accessToken] = await userService.login(req.body);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            secure: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000, // Expired 1 jam di cookie
        });
        
        res.status(200).json({
            data: result,
            accessToken,
        });
    } catch (e) {
        next(e);
    }
};

const refresh = async (req, res, next) => {
    try {
        const [result, accessToken] = await userService.refresh(req.cookies.refreshToken);
        
        res.status(200).json({
            data: result,
            accessToken,
        });
    } catch (e) {
        next(e);
    }
};

const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const accessToken = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        await userService.logout(refreshToken, accessToken);
        
        res.clearCookie('refreshToken');
        res.status(200).json({
            message: "Logout success"
        });
    } catch (e) {
        next(e);
    }
};

export default {
    register,
    login,
    refresh,
    logout
};