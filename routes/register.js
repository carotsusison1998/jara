const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();
const {validateParam, validateBody,schemas} = require('../helpers/routerHelpers');
const controller = require('../controllers/register');

router.route('/')
    .get(controller.get)
    .post(controller.post)

module.exports = router