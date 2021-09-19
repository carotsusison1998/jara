const mongoose = require('mongoose');
const Schema = mongoose.Schema

const AccountsSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    avatar: {
        type: String
    }

})
const Accounts = mongoose.model('tbl_accounts', AccountsSchema)
module.exports = Accounts
    
