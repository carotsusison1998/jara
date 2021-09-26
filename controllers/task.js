const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const Accounts = require("../models/Account");
const Tasks = require("../models/Tasks");
const Project = require("../models/Project");
const saltRounds = 10;

const get = async (req, res, next) => {
    console.log("hello");
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
const getDetail = async (req, res, next) => {
  const ObjectId = require('mongodb').ObjectID;
  const taskDetail = await Tasks.findById({_id: ObjectId(req.params.id)});
  const findProjectBySlug = await Project.findById({_id: ObjectId(taskDetail.id_project)});
  const list_account = await getAccountByProject(findProjectBySlug.list_member);
  const account_created_task = await Accounts.findById(taskDetail.id_created);
  if(taskDetail){
    setTimeout(() => {
      return res.status(200).json({
        status: true,
        taskDetail: taskDetail,
        list_account: list_account,
        account_created_task: account_created_task
      });
    }, 500);
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
const putDetail = async (req, res) => {
  const id = req.params.id;
  const patchTask = req.body;
  const patchTaskUpdate = await Tasks.findByIdAndUpdate(id, patchTask);
  setTimeout(() => {
    if(patchTaskUpdate){
      return res.status(200).json({
        status: true,
        message: "Cập nhật thành công"
      });
    }
  }, 500);
}
const deleteDetail = async (req, res) => {
  const id = req.params.id;
  const deleteTaskUpdate = await Tasks.findByIdAndDelete(id);
  setTimeout(() => {
    if(deleteTaskUpdate){
      return res.status(200).json({
        status: true,
        message: "Xóa thành công"
      });
    }
  }, 500);
}
module.exports = {
  post,
  get,
  getDetail,
  putDetail,
  deleteDetail
};
