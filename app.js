const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const securityApp = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
const app = express();
const server = require('http').Server(app);
const io = require("socket.io")(server);


app.use(securityApp())
app.use(express.static('public'));
app.use(flash());
app.use(session({ secret: 'keyboard-jara-app', cookie: { maxAge: 360000 }}));

// Set View's
app.set('views', './views');
app.set('view engine', 'ejs');

// Route 
const Register = require("./routes/register");
const Login = require("./routes/login");
const Task = require("./routes/task");
const Project = require("./routes//project");
// model
const Tasks = require("./models/Tasks");
const Accounts = require('./models/Account');
const Projects = require('./models/Project');
// Middlewares
app.use(logger('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// routes
app.get('/', async (req, res, next)=>{
    if(req.session.account){
        const list_task_todo = await Tasks.find({status_task: 1});
        const list_task_progress = await Tasks.find({status_task: 2});
        const list_task_test = await Tasks.find({status_task: 3});
        const list_task_review = await Tasks.find({status_task: 4});
        const list_task_done = await Tasks.find({status_task: 5});
        const list_account = await Accounts.find({}).sort({name: -1});
        const list_project = await Projects.find({list_member: {$all: [req.session.account.id]}});
        return res.render("index", 
                            {
                                info: req.session.account,
                                findProjectBySlug: null,
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
})
app.use('/register', Register);
app.use('/login', Login);
app.use('/logout', async function(req, res){
    if(req.body.method){
        const acoount_logout = await Accounts.find({_id: req.body.id_account_current});
        if(acoount_logout){
            req.session.destroy(function(err){
                if(err){
                    return res.status(500).json({
                        "status": false,
                    });
                }else{
                    return res.status(200).json({
                        "status": true,
                    });
                }
             });
        }
    }else{
        return res.status(500).json({
            "status": false,
        });
    }
});
app.use('/project', Project);
app.use('/task', Task);

io.on("connection", (socket) => {
    console.log(socket.id , " đã kết nối");
    socket.on("disconnect", () => {
        console.log(socket.id, " đã ngắt kết nối");
        io.sockets.emit("sv-disconnect", socket.id+" đã đăng xuất");
    });
    socket.on("client-create-task", async function(data){
        const newObject = await createNewTask(data);
        if(newObject){
            io.sockets.emit("server-create-task", newObject);
        }
    });
    socket.on("client-drapanddrop-task", async function(data){
        const updateTask = await updateStatusTaskById(data);
        if(updateTask){
            io.sockets.emit("server-drapanddrop-task", data);
        }
    });
});
const updateStatusTaskById = async (data) => {
    const ObjectId = require('mongodb').ObjectID;
    let status = 1;
    if(data.name_column === "progress"){
        status = 2; 
    }else if(data.name_column === "test"){
        status = 3;
    }else if(data.name_column === "review"){
        status = 4;
    }else if(data.name_column === "done"){
        status = 5;
    }
    const taskUpdated = await Tasks.findByIdAndUpdate({ _id: ObjectId(data.id_task) }, {"status_task": status});
    return taskUpdated;
}
const createNewTask = async (data) => {
    let last_task = 1;
    const today = new Date();
    const date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear()+' '+today.getHours()+':'+today.getMinutes();
    const check_last_task = await Tasks.find({id_project: data.id_project}).limit(1).sort({$natural:-1})
    if(check_last_task.length > 0){
        last_task = Number(check_last_task[0].index_task) + Number(1);
    }
    const object = {
        type_task: data.type_task,
        name_task: data.name_task,
        id_project: data.id_project,
        id_react: data.id_react,
        id_created: data.id_created,
        status_task: 1,
        index_task: last_task,
        estimate_task: data.estimate_task,
        description_task: data.description_task,
        created_date: date,
    }
    const newObjectTask = new Tasks(object);
    const newTask = await newObjectTask.save();
    object.id_task = newTask._id;
    object.id_project = newTask.id_project;
    return object;
}
// cacth 
app.use((req, res, next)=>{
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})

// error
app.use((err, req, res, next)=>{
    const error = app.get('env') === 'development' ? err : {}
    const status = err.status || 500
    //res to client
    return res.status(status).json({
        error:{
            message: error.message
        }
    })
})
// setup connect mongodb by mongo
mongoose.connect('mongodb+srv://admin:admin123@cluster0.51c2x.mongodb.net/db_jara', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true  
})
.then(()=>{
    console.log('connected sucessfully database jara app')
}).catch((err)=>{
    console.log(`connecte db error ${err} `)
})
// start server
const port = app.get('port') || 1234;
// const port = process.env.PORT || 1234;
server.listen(port, ()=>{
    console.log(`server is listening on port ${port}`);
})