const mongoose = require('mongoose');
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    type_task:{
        type: String,
        required: true
    },
    name_task:{
        type: String,
        required: true,
    },
    id_created:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    id_react:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    status_task:{
        type: String,
    },
    index_task:{
        type: String,
    },
    estimate_task:{
        type: String,
    },
    description_task: {
        type: String
    },
    created_date: {
        type: String,
        required: true,
    },
    images_task: {
        type: [],
    },

})
const Task = mongoose.model('tbl_tasks', TaskSchema)
module.exports = Task
    
