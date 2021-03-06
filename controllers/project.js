const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const Accounts = require("../models/Account");
const Project = require("../models/Project");
const Tasks = require("../models/Tasks");

const get = async (req, res, next) => {
    if(req.session.account){
        if(req.query.name !== "" || req.query.name !== undefined){
            const findProjectBySlug = await Project.findOne({slug_project: req.query.name});
            if(findProjectBySlug){
                const list_task_todo = await Tasks.find({status_task: 1, id_project: findProjectBySlug._id});
                const list_task_progress = await Tasks.find({status_task: 2, id_project: findProjectBySlug._id});
                const list_task_test = await Tasks.find({status_task: 3, id_project: findProjectBySlug._id});
                const list_task_review = await Tasks.find({status_task: 4, id_project: findProjectBySlug._id});
                const list_task_done = await Tasks.find({status_task: 5, id_project: findProjectBySlug._id});
                const list_project = await Project.find({list_member: {$all: [req.session.account.id]}});
                const list_account = await getAccountByProject(findProjectBySlug.list_member);
                const list_account_all = await Accounts.find({});
                setTimeout(() => {
                    return res.render("projects/project", 
                                    {
                                        info: req.session.account,
                                        findProjectBySlug: findProjectBySlug,
                                        list_account_all: list_account_all,
                                        list_project: list_project,
                                        list_account: list_account,
                                        list_task_todo: list_task_todo,
                                        list_task_progress: list_task_progress,
                                        list_task_test: list_task_test,
                                        list_task_review: list_task_review,
                                        list_task_done: list_task_done,
                                    }
                                );
                }, 1000);
            }else{
                return res.redirect("/");
            }
        }else{
            return res.redirect("/");
        }
    }else{
        req.flash('info', 'H???t th???i gian truy c???p, Vui l??ng ????ng nh???p l???i!');
        return res.redirect("/login");
    }
};
const getAccountByProject = (data) => {
    let arrAccount = [];
    data.forEach(async element => {
        const accountByProject = await Accounts.findOne({_id: element});
        if(accountByProject){
            arrAccount.push(accountByProject);
        }
    });
    return arrAccount;
}
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
