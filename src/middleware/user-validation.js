import Joi from "joi";

// ini bikin 'schema' joi
const registerUserValidation = Joi.object({
    username: Joi.string().max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-\\[\\]{};:\'\"\\\\|,.<>\\/?]{3,30}$')).required(),
    email: Joi.string().email({ minDomainSegments: 2, }).required(),
});


const loginUserValidation = Joi.object({
    username: Joi.string().max(20).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*()_+\\-\\[\\]{};:\'\"\\\\|,.<>\\/?]{3,30}$')).required(),
});


export {
    registerUserValidation,
    loginUserValidation
};