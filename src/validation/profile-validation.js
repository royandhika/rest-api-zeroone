import Joi from "joi";

const updateProfileValidation = Joi.object({
    username: Joi.string().max(20).required(),
    fullname: Joi.string().max(50).optional(),
    phone: Joi.string().max(20).pattern(new RegExp('^[0-9]+$')).optional(),
    city: Joi.string().max(25).optional(),
    region: Joi.string().max(25).optional(),
});

export {
    updateProfileValidation
};