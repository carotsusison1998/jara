const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();
const {validateParam, validateBody,schemas} = require('../helpers/routerHelpers');
const controller = require('../controllers/task');

router.route('/')
    .post(controller.post)

module.exports = router