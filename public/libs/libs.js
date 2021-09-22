let toast = document.getElementById("toast");
function showToast(status, message){
    let x;
    clearTimeout(x);
    if(status === true){
        $("#toast .left img.icon-message").attr("src","../images/checked.png");
        $("#toast .right p:first-child").html("Thành công");
    }else{
        $("#toast .left img.icon-message").attr("src","../images/cancel.png");
        $("#toast .right p:first-child").html("Thất bại");
    }
    $("#toast .right p:last-child").html(message);
    toast.style.opacity = "1";
    // toast.style.display = "block";
    x = setTimeout(()=>{
        toast.style.opacity = "0"
        // toast.style.display = "none"
    }, 4000);
}
function closeToast(){
    toast.style.opacity = "0";
    // toast.style.display = "none";
}