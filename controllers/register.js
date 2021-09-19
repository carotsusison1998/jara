const session = require('express-session');
const Accounts = require("../models/Account")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const get = async (req, res, next) => {
    if(req.session.account){
        return res.redirect("/");
    }else{
        return res.render("accounts/signup", {message: ""});
    }
};
const post = async (req, res, next) => {
    const checkEmail = await Accounts.find({email: req.body.email});
    const checkUsername = await Accounts.find({username: req.body.username});
    if(checkEmail.length > 0 && checkEmail[0].email !== ""){
        return res.render("accounts/signup", {message: "Email đã tồn tại! Vui lòng sử dụng email khác!"});
    }else if(checkUsername.length > 0 && checkUsername[0].username !== ""){
        return res.render("accounts/signup", {message: "Tài khoản đã tồn tại! Vui lòng sử dụng tài khoản khác!"});
    }
    const hash = bcrypt.hashSync(req.body.password, saltRounds);
    const object = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: hash,
        avatar: "",
    }
    const newAccount = new Accounts(object);
    await newAccount.save();
    return res.render("accounts/signup", {message: "Chúc mừng bạn đã đăng ký thành công tài khoản mới!"});
}

module.exports = {
  get,
  post
};
