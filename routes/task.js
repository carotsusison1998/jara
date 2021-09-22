const express = require('express');
// const router = express.Router();
const router = require('express-promise-router')();
const {validateParam, validateBody,schemas} = require('../helpers/routerHelpers');
const controller = require('../controllers/task');

router.route('/')
    .get(controller.get)
    .post(controller.post)
router.route('/:id')
    .get(controller.getDetail)
    .patch(controller.putDetail)
module.exports = router