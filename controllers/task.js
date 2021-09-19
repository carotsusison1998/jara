const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const Accounts = require("../models/Account");
const Tasks = require("../models/Tasks");
const saltRounds = 10;

const get = async (req, res, next) => {
    
};
const post = async (req, res, next) => {
    const today = new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+' '+today.getHours()+':'+today.getMinutes();
    const object = {
        type_task: req.body.type_task,
        name_task: req.body.name_task,
        id_created: req.session.account.id,
        id_react: req.body.id_react,
        status_task: 1,
        estimate_task: req.body.estimate_task,
        description_task: req.body.description_task,
        created_date: date,
    }
    const newTask = new Tasks(object);
    await newTask.save();
}
module.exports = {
  post
};
