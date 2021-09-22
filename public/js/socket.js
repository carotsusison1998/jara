const account_current = $("#account_current").val();
var socket = "";
var api_get_message = "";
var url_getDataDetail = "";

if(document.domain === "localhost"){
	socket = io("http://localhost:1234");
    url_getDataDetail = "http://localhost:1234/task/";
}else{
	// socket = io("https://zingme.herokuapp.com/");
}
// Tạo một task mới
$("#create_new_task").click(function(e){
    let object = {};
    $.each($('#myFormPopupTask form').serializeArray(), function(_, kv) {
        object[kv.name] = kv.value;
    });
    socket.emit("client-create-task", object);
});











// client lắng nghe server
// server tạo task 
socket.on("server-create-task", async function(data){
    var html = "";
    if(account_current === data.id_created){
        $("#myFormPopupTask").css("display", "none");
    }
    html = '<div class="row-item task-'+data.id_task+'" draggable="true" data-id="'+data.id_task+'" data-stt="'+data.index_task+'">'+
                '<img src="../images/scroll.png" alt="" class="icon icon-drop">'+
                '<p class="stt-work">'+data.index_task+'</p>'+
                '<p class="name-work">'+data.name_task+'</p>'+
            '</div>'
    await $("#project-"+data.id_project+" .todo").append(html);
    dropAndDrag();
});
// sửa trạng thái của nhiệm vụ
socket.on("server-drapanddrop-task", function(data){
    if(account_current !== data.account_current){
        if($(".row-item.task-"+data.id_task).length > 0){
            $(".column-item."+data.name_column).append($(".row-item.task-"+data.id_task));
            autoSort(".column-item.autosort");
        }
    }
});
// function kéo thả
dropAndDrag();
function dropAndDrag(){
    // khai báo các biến
    var item_row = $(".row-item");
    var item_column = $(".column-item");
    var dragItem = null;
    var id_task = null;
    var index_task = null;

    // Lặp item start
    for(var item_start of item_row){
        item_start.addEventListener('dragstart', dragStart);
        item_start.addEventListener('dragend', dragEnd);
    }
    // Lặp item end
    for(var item_end of item_column){
        item_end.addEventListener('dragover', dragOver);
        item_end.addEventListener('dragenter', dragEnter);
        item_end.addEventListener('dragleave', dragLeave);
        item_end.addEventListener('drop', Drop);
    }
}
function dragStart(){
    dragItem = this;
    id_task = $(this).data('id');
    index_task = $(this).data('stt');
    setTimeout(() => {
        this.style.display = "none";
    }, 0);
}
function dragEnd(){
    setTimeout(() => {
        this.style.display = "block";
    }, 0);
    dragItem = null;
}
function dragOver(e){
    e.preventDefault();
    this.style.border = "2px dotted #74FAE0";
}
function dragEnter(e){
    e.preventDefault();
}
function dragLeave(){
    this.style.border = "2px solid #ffffff";
}
// sự kiện kéo thành công
function Drop(){
    const object = {
        account_current: account_current,
        name_column: $(this).data('column'),
        id_task: id_task,
        index_task: index_task,
    }
    socket.emit("client-drapanddrop-task", object);
    this.append(dragItem);
    this.style.border = "2px solid #ffffff";
    autoSort(".column-item.autosort");
    // ajax call data when click one task 
    getTaskDetail();
}
function autoSort(className){
    $(className).each(function(){
        $(this).html($(this).children('.row-item').sort(function(a, b){
            return ($(b).data('stt')) < ($(a).data('stt')) ? 1 : -1;
        }));
    });
}
// ajax call data when click one task 
getTaskDetail();
function getTaskDetail(){
    $(".row-item").click(function(){
        const object = {
            id: $(this).data("id")
        }
        $.ajax({
            url: url_getDataDetail+$(this).data("id"),
            type: "GET",
            data: object,
            success: function(data){
              if(data.status === true){
                var htmlAccount = ''
                data.list_account.forEach(element => {
                    if(element._id === data.taskDetail.id_react){
                        htmlAccount += '<option value="'+element._id+'" selected>'+element.name+'</option>'
                    }else{
                        htmlAccount += '<option value="'+element._id+'">'+element.name+'</option>'
                    }
                });
                var html =  '<form id="form_update_task">'+
                                '<div class="task-detail">'+
                                    '<div class="header">'+
                                        '<p class="index-task">'+data.taskDetail.index_task+'</p>'+
                                        '<img src="../images/more.png" class="icon icon-more" alt="">'+
                                    '</div>'+
                                    '<div class="content">'+
                                        '<div class="item-task name-task">'+
                                            '<p>Tên nhiệm vụ</p>'+
                                            '<input type="text" name="name_task" value="'+data.taskDetail.name_task+'">'+
                                        '</div>'+
                                        '<div class="item-task estimate-task">'+
                                            '<p>Thời gian nhiệm vụ</p>'+
                                            '<input type="text" name="estimate_task" value="'+data.taskDetail.estimate_task+'">'+
                                        '</div>'+
                                        '<div class="item-task reporter-task">'+
                                            '<p>Người tạo</p>'+
                                            '<p>'+data.account_created_task.name+'</p>'+
                                        '</div>'+
                                        '<div class="item-task assgin-task">'+
                                            '<p>Người thực hiện</p>'+
                                            '<select name="id_react">'+htmlAccount+'</select>'+
                                        '</div>'+
                                    '<div class="item-task created-task">'+
                                            '<p>Thời gian tạo</p>'+
                                            '<p>'+data.taskDetail.created_date+'</p>'+
                                        '</div>'+
                                        '<div class="item-task description-task">'+
                                            '<p>Mô tả</p>'+
                                            '<textarea name="description_task" cols="30" rows="16">'+data.taskDetail.description_task+'</textarea>'+
                                    '</div>'+
                                    '</div>'+
                                    '<div class="footer">'+
                                        '<button type="button" data-id="'+data.taskDetail._id+'" id="updateTask" class="btn">Lưu</button>'+
                                        '<button type="button" class="btn cancel" onclick="closeFormTaskDetail()">Đóng</button>'+
                                    '</div>'+
                                '</div>'+
                            '</form>';
                if($(".body-content .right .content-task-detail .task-detail").length > 0){
                    $(".body-content .right .content-task-detail .task-detail").remove();
                }
                $(".body-content .right").css("display", "block");
                $(".body-content .right .content-task-detail").append(html);
                // call function update task
                update_task();
              }
            }
        });
    });
}
// update task
function update_task(){
    $("#updateTask").click(function(){
        let object = {};
        $.each($('#form_update_task').serializeArray(), function(_, kv) {
            object[kv.name] = kv.value;
        });
        $.ajax({
            url: url_getDataDetail+$(this).data("id"),
            type: "PATCH",
            data: object,
            success: function(data){
              if(data.status === true){
                showToast(true, "Chúc mừng bạn đã đăng ký thành công");
                // window.location.reload();
              }
            }
        });
    });
}