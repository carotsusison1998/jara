function openFormPopup() {
  document.getElementById("myFormPopupTask").style.display = "block";
}

function closeFormPopup() {
  document.getElementById("myFormPopupTask").style.display = "none";
  $("#myFormPopupTask form").trigger("reset");
}
function openAccount() {
  if ($(".content-account-current").css("display") === "block") {
    $(".content-account-current").css("display", "none");
  } else {
    $(".content-account-current").css("display", "block");
  }
}
function openListProject() {
  if ($(".list-project").css("display") === "flex") {
    $(".list-project").css("display", "none");
  } else {
    $(".list-project").css("display", "flex");
  }
}
function openFormPopupProject() {
  $(".chosen-select").chosen();
  document.getElementById("myFormPopupProject").style.display = "block";
}
function closeFormPopupProject() {
  document.getElementById("myFormPopupProject").style.display = "none";
  $(".chosen-select").val("").trigger("chosen:updated");
}
function closeFormTaskDetail() {
  $(".body-content .right").css("display", "none");
}
$(".name-project").keyup(function () {
  ChangeToSlug($(this).val());
});
function ChangeToSlug(title) {
  //Đổi chữ hoa thành chữ thường
  slug = title.toLowerCase();
  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
  slug = slug.replace(/đ/gi, "d");
  //Xóa các ký tự đặt biệt
  slug = slug.replace(
    /\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi,
    ""
  );
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, "-");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-\-/gi, "-");
  slug = slug.replace(/\-\-\-/gi, "-");
  slug = slug.replace(/\-\-/gi, "-");
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = "@" + slug + "@";
  slug = slug.replace(/\@\-|\-\@|\@/gi, "");
  //In slug ra textbox có id “slug”
  $(".slug-project").val(slug);
}
