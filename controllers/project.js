const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const Accounts = require("../models/Account");
const Project = require("../models/Project");
const Tasks = require("../models/Tasks");

const get = async (req, res, next) => {
    if(req.session.account){
        const list_task_todo = await Tasks.find({status_task: 1});
        const list_task_progress = await Tasks.find({status_task: 2});
        const list_task_test = await Tasks.find({status_task: 3});
        const list_task_review = await Tasks.find({status_task: 4});
        const list_task_done = await Tasks.find({status_task: 5});
        const list_account = await Accounts.find({}).sort({name: -1});
        const list_project = await Project.find({list_member: {$all: [req.session.account.id]}});
        return res.render("projects/project", 
                            {
                                info: req.session.account,
                                list_project: list_project,
                                list_account: list_account,
                                list_task_todo: list_task_todo,
                                list_task_progress: list_task_progress,
                                list_task_test: list_task_test,
                                list_task_review: list_task_review,
                                list_task_done: list_task_done,
                            }
                        );
    }else{
        req.flash('info', 'Hết thời gian truy cập, Vui lòng đăng nhập lại!');
        return res.redirect("/login");
    }
};
const post = async (req, res, next) => {
    const today = new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+' '+today.getHours()+':'+today.getMinutes();
    const object = {
        name_project: req.body.name_project,
        slug_project: req.body.slug_project,
        id_created: req.body.id_created,
        status_project: 1,
        index_project: 1,
        estimate_project: req.body.estimate_project,
        description_project: req.body.description_project,
        created_date: date,
        list_member: req.body["list_member[]"]
    }
    const newProject = new Project(object);
    await newProject.save();
    return res.status(200).json({
        "status": true,
    });
}
module.exports = {
  post,
  get
};
