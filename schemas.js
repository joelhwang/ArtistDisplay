const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

//extension for joi validator to for removing or sanitizing html tags from user input
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    //no tags or attributes are allowed
                    allowedTags: [],
                    allowedAttributes: {},
                });
                //if sanitized input differs from actual input, return escapeHTML error
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

//object validation
//ensures users do not put html tags in input
module.exports.artSchema = Joi.object({
    artpiece: Joi.object({
        title: Joi.string().required().escapeHTML(),
        description: Joi.string().allow(null, '').escapeHTML(),
    }).required()
})

