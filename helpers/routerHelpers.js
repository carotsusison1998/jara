const joi = require('joi')
const { schema } = require('../models/User')

const validateParam = (schema, name) => {
    return (req, res, next) => {
        // console.log('params...', req.params[name])
        const validatorResult = schema.validate({ param: req.params[name] })
        // console.log('asdasda',validatorResult)
        if(validatorResult.error){
            return res.status(400).json(validatorResult.error)
        }
        else{
            // console.log('1', req.value)
            if(!req.value) req.value = {}
            // console.log('2', req.value.params)
            if(!req.value['params']) req.value.params = {}
            // console.log('3', req.value)
            req.value.params[name] = req.params[name]
            // console.log('4', req.value)

            next()
        }
    }
}

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)
        if(validatorResult.error){
            return res.status(400).json(validatorResult.error)
        }
        else{
            if(!req.value) req.value = {}
            if(!req.value['body']) req.value.body = {}
            req.value.body = validatorResult.value
            next()
        }
    }
}

const schemas = {
    idSchema: joi.object().keys({
        param: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    userSchema: joi.object().keys({
        firstName: joi.string().required().min(2),
        lastName: joi.string().required().min(2),
        email: joi.string().email().required()
    }),

    signupSchema: joi.object().keys({
        firstName: joi.string().required().min(2),
        lastName: joi.string().required().min(2),
        email: joi.string().email().required(),
        password: joi.string().required().min(5)
    }),
    
    signinSchema: joi.object().keys({
        email: joi.string().email().required(),
        password: joi.string().required().min(5)
    }),

    userOptionalSchema: joi.object().keys({
        firstName: joi.string().min(2),
        lastName: joi.string().min(2),
        email: joi.string().email()
    }),

    deckSchema: joi.object().keys({
        name: joi.string().min(5).required(),
        description: joi.string().min(5).required(),
        total: joi.string()
    }),
    
    newdeckSchema: joi.object().keys({
        name: joi.string().min(5).required(),
        description: joi.string().min(5).required(),
        total: joi.string(),
        owner: joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),

    deckOptionalSchema: joi.object().keys({
        name: joi.string().min(5),
        description: joi.string().min(5),
        total: joi.string(),
        owner: joi.string().regex(/^[0-9a-fA-F]{24}$/)
    }),
}

module.exports = {
    validateParam,
    validateBody,
    schemas
}