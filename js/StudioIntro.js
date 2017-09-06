$(function () {
    $(".SubmitBtn").on("click", function () {
        window.location.href = "//artist.momentcam.cn/page/ChooseType.html";
    });

    var a = getQueryString("a");
    $(".return").on("click", function () {
         history.go(-1);
    });
})