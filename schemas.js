const joiBase = require('joi');
const { validate } = require('./models/review');
const sanitizeHTML = require('sanitize-html');
const extension = (joi)=>({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML'
    },
    rules: {
        escapeHTML: {
            validate(value,helpers) {
                const clean = sanitizeHTML(value,{
                    allowedTage: [],
                    allowedAttributes: {},
                });
                if(clean!==value) return helpers.error('string.escapeHTML', {value})
                    return clean;
            }
        }
    }
});
const joi = joiBase.extend(extension);
module.exports.campgroundSchema = joi.object({
    Campground: joi.object({
        title: joi.string().required().escapeHTML(),
        price: joi.number().required().min(0),
        location: joi.string().required().escapeHTML(),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
});
module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required().escapeHTML()
    }).required()
})