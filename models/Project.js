const mongoose = require('mongoose');
const Schema = mongoose.Schema

const ProjectSchema = new Schema({
    name_project:{
        type: String,
        required: true,
    },
    slug_project:{
        type: String,
        required: true,
    },
    id_created:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status_project:{
        type: String,
    },
    index_project:{
        type: String,
    },
    estimate_project:{
        type: String,
    },
    description_project: {
        type: String
    },
    created_date: {
        type: String,
        required: true,
    },
    list_member: {
        type: [],
    },
})
const Project = mongoose.model('tbl_project', ProjectSchema)
module.exports = Project
    
