var socket = "";
var api_get_message = "";
const account_current = $("#account_current").val();

if(document.domain === "localhost"){
	socket = io("http://localhost:1234");
    
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
    console.log(data);
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
}
function autoSort(className){
    $(className).each(function(){
        $(this).html($(this).children('.row-item').sort(function(a, b){
            return ($(b).data('stt')) < ($(a).data('stt')) ? 1 : -1;
        }));
    });
}
