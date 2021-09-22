var url_logout = null;
var url_project = null;
if(document.domain === "localhost"){
	url_logout = "http://localhost:1234/logout";
	url_project = "http://localhost:1234/project";
}else{
	// url_logout = "http://localhost:1234/logout";
	
}
$("#logout").click(function(){
    const id_account_current = $("#id-current-account").val();
    const object = {
        method: "logout",
        id_account_current: id_account_current
    };
    $.ajax({
        url: url_logout,
        type: "POST",
        data: object,
        success: function(data){
          if(data.status === true){
            window.location.reload();
          }
        }
    });
});

// Tạo một dự án mới
$("#create_new_prject").click(function(e){
  let object = {};
  $.each($('#myFormPopupProject form').serializeArray(), function(_, kv) {
      object[kv.name] = kv.value;
  });
  // object.list_member = Object.assign({}, $(".chosen-select").chosen().val());
  object.list_member = $(".chosen-select").chosen().val();
  // console.log(object);
  $.ajax({
      url: url_project,
      type: "POST",
      data: object,
      success: function(data){
        if(data.status === true){
          window.location.reload();
        }
      }
  });
});
