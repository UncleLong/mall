function getQueryString(key) {
    var url = window.location.search;
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
    var result = url.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
(function () {
    var coupon = getQueryString("coupon") || "";
    var name = decodeURIComponent(getQueryString("name"));
    var urlLinks = window.location.search == "" ? "?v=2" : window.location.search;
    document.title = name;
    var isClient = false;
    var Items = {
        init: function () {
            getData(function (result) {
                console.log(result);
                var html = '';
                var products = result.Response[0].Places[0].Products;
                if (products.length < 2) {
                    $(".box").css("text-align", "left");
                }
                if (name == "TOMIC" || name == "tomic经典款玻璃杯") {
                    html += '<div style="width:100%;overflow:hidden;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/Headbanner/TomicBanner.jpg" /></div>'
                }
                if (name == "国礼瓷") {
                    html += '<div style="width:100%;overflow:hidden;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/goodsImg/topci.jpg" /></div>'
                }
                if (name == "唐妞") {
                    html += '<div style="width:100%;overflow:hidden;margin-bottom:20px;"><img style="display:block;width:100%;" src="https://mall-res.manboker.com/newmall/CN/Activity/Tangniu/tangniu.jpg" /></div>'
                }
                var Defaultdiagram = app.getOptimizedImgUrl("//mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg", 100);
                var photoframe = app.appendWebpForImgUrl("//mall-res.manboker.com/newmall/DefaultPicture/Online-retailers_loading_photoframe.jpg");
                for (var i = 0; i < products.length; i++) {
                    var productThumb = app.appendWebpForImgUrl(products[i].ShowImage).replace("http://", "https://");
                    var headThumb = app.appendWebpForImgUrl(products[i].AvatarIcon).replace("http://", "https://");
                    html += '<div id="' + products[i].ProductId + '" class="pic">' +
                                '<a href="javascript:void(0);">' +
                                    '<img class="tip lazy" src="' + Defaultdiagram + '"  data-original="' + headThumb + '" />' +
                                    '<img class="phone lazy" src="' + photoframe + '" data-original="' + productThumb + '">' +
                                '</a>' +
                                '<a href="javascript:void(0);">' + products[i].ProductName + '</a>' +
                                '<a href="javascript:void(0);">¥ ' + products[i].SalePrice + '.00</a>' +
                            '</div>';
                }
                $(".contain").html(html);
                setTimeout(function () {
                    $("img.lazy").lazyload({
                        placeholder: "//mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg",
                        effect: "fadeIn",
                        threshold: 700,
                        container: $(".box"),
                    });
                    $(window).resize();
                }, 100);
                $(".pic").last().css("margin-bottom", "30px");
                $(".pic").last().prev().css("margin-bottom", "30px");
                $(".pic").on("click", function () {
                    Counter("什么值得买-商品列表页面" + name+"-"+$(this).find("a").eq(1).html() + "-商品点击");
                    var id = $(this).attr("id");
                    setTimeout(function () {
                        var adtValue = getQueryString("adt");
                        window.location.href = "//artist.momentcam.net/page/DetailsPage.html" + urlLinks + "&productid=" + id;
                    }, 500);
                    
                });
                $(".return").on("click", function () {
                    window.history.go(-1);
                    return;
                })
            });
        },
    }
    function getData(callback) {
        $.ajax({
            type: "get",
            async: true,
            url: app.urls.GetMartDailyCN + "&title=" + name,
            timeout: 25000,
            cache: false,
            beforeSend: function () {
                var html = '<div style="position:absolute;left:50%;top:500px;margin-left:-40px;">' +
                    '<img style="width:80px;" src="//mall-res.manboker.com/newmall/CN/loading.gif" />' +
                    '</div>';
                $(".contain").append(html);
            },
            success: function (result) {
                $(".contain").html('');
                return callback(result);
            }
        });
    }
    $(function () {
        $(".TitleBar span").html(name);
      
        try {
            mcAPI.finishloading();
        } catch (e) { }
        Items.init();
    });
})()
