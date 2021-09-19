const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const Accounts = require("../models/Account");
const saltRounds = 10;

const get = async (req, res, next) => {
    if(req.session.account){
        return res.redirect("/");
    }else{
        return res.render("accounts/signin", {message: req.flash('info')});
    }
};
const post = async (req, res, next) => {
    const checkUsername = await Accounts.find({username: req.body.username});
    if(checkUsername.length <= 0){
        return res.render("accounts/signin", {message: "Tài khoản không tồn tại! Vui lòng nhập tài khoản."});
    }else{
        if(bcrypt.compareSync(req.body.password, checkUsername[0].password)){
            req.session.account = {
                id: checkUsername[0]._id, 
                name: checkUsername[0].name, 
                email: checkUsername[0].email, 
                avatar: checkUsername[0].avatar,
            }
            return res.redirect("/");
        }else{
            return res.render("accounts/signin", {message: "Mật khẩu sai! Vui lòng nhập mật khẩu."});
        }
    }
}
module.exports = {
  get,
  post
};
