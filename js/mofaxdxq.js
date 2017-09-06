//	==================================将点击切换的函数进行分装==================================
var lastShopID = 0;
var sortType = 1;
var loadingIconURL = "//mall-res.manboker.com/newmall/CN/loading.gif";
var defaultPic = "//moman-res-ali.manboker.com/newmall/DefaultPicture/Online-retailers_loading_photoframe.jpg";
var clickCheck = false;
var AllowClick = true;
var urlLinks = window.location.search == "" ? "?v=2" : window.location.search;
//	==================================将点击切换的函数进行分装==================================

function mfxd(sortType, id, callback) {
    jQuery.ajax({
        type: "get",
        async: true,
        url: app.urls.StudioContentURL + "&sortType=" + sortType + "&lastShopId=" + id,
        timeout: 25000,
        cache: true,
        beforeSend: function (request) {
            $('div').remove('.waiting');
            var html = '<div class="waiting">' +
                       '<img src="' + loadingIconURL + '" />' +
                       '</div>';
            $(".jtnr").append(html); 
            AllowClick = false;
        },
        //==================请求的数据==============================
        success: function (data) {
            $('div').remove('.waiting');
            RenderDom(data);
            setTimeout(function () {
                $("img.lazy").lazyload({
                    threshold: 200,
                    container: $(".banxin"),
                });
                $(window).resize();
            }, 100);
        }
    });
}

$(document).ready(function () {
    $('.tabtitle li ').click(function () {
        var index = $(this).index();
        $(this).children("a").css('color', '#fa9f13').parent().siblings().children("a").css('color', '#000')
        $(this).addClass("tabhover").siblings().removeClass('tabhover');
        $('.tabcontent').eq(index).show().siblings('.tabcontent').hide();
    });
    var _click = 0;
    var __click = 0;
    var ___click = 0;
    var click = 0;    
    //=============销量和获赞数===================
    $(".tap").on("click", function () {
        if (AllowClick) {
            if ($(this).hasClass("active"))
                return;
            $(".zxxd  select").removeClass("active");
            $(this).addClass("active").siblings().removeClass("active");
            if ($("ul .ck span").hasClass("up")) {
                $("ul .ck span").removeClass("up").addClass("down")
            }
            if ($("ul .ck span").hasClass("stopClick")) {
                $("ul .ck span").removeClass("stopClick").addClass("down")
            }
            if ($("ul .ck span").hasClass("down1")) {
                $("ul .ck span").removeClass("down1").addClass("down")
            }
            $("ul .ck span").removeClass("active")
            $("ul .ck .second li").removeClass("active")
            $(".select .second").addClass("hide")
            var sortId = $(this).attr("data-id");
            $(".jtnr").html('');
            mfxd(sortId, 0);
        }
    });
   
})
function RenderDom(data) {
    console.log(data);
    if (data.StatusCode == 200) {
        clickCheck = false;
        if (data.Data.length == 0) {
            $(".Prompt").css("display", "block")
            setTimeout(function () {
                $(".Prompt").css("display","none")
            },1500)
            clickCheck = true;
            return false;
        }
        for (var i = 0; i < data.Data.length; i++) {
  
            var certifiedImgs = ["", "//mall-res.manboker.com/newmall/CN/newstudio/myspace_ordinary.png", "//mall-res.manboker.com/newmall/CN/newstudio/myspace_Artist.png"];
            var html = '';
            if (data.Data.length == 1) {
                if (lastShopID == data.Data[0].Id) {
                    clickCheck = true;
                    return false;
                }
            }

            if (data.Data[i].ProductInfos.length > 0) {
                lastShopID = data.Data[data.Data.length - 1].Id;
                console.log(lastShopID);
                var santutop = data.Data[i];
                var santu = data.Data[i].ProductInfos;
                if (santutop.UserSign == "") {
                    santutop.UserSign = "魔漫相机，遇见更好的自己"
                }
                var authorContent = '<div class="yt-top  clearfix">' +
						                '<div class="yt-top-l">' + 
						                '<img src="' + app.appendWebpForImgUrl(santutop.UserIcon).replace("http://", "https://").replace("http://", "https://") + '"  uid="' + santutop.UserId + '"   CheckImgExists()    alt=""    class="hha"  /></div>' +
						                '<div class="yt-top-c">' +
                                         '<div ><p  class="top">店主: ' + santutop.UserName + '</p> <img src= "' + app.appendWebpForImgUrl(certifiedImgs[data.Data[i].CertifiedType]).replace("http://", "https://") + '" /></div>' +
						                '<p class="bot">' + eval("'" + santutop.UserSign + "'") + '</p> </div>';
                if (data.Data[i].ProductInfos.length == 3) {
                    html += '<div class="santu">' +
						authorContent +
						'<div class="yt-top-r"   style="display:none;">' +
						'<p>关注</p> </div> </div> ' +
						'<div class="st-b-tu  clearfix">' +
						'<div class="st-b-l p   pictureClick"  style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover" uid="' + santutop.UserId + '"  pid="' + santu[0].ProductId + '"></div>' +
						'<div class="st-b-r">' +
						'<div class="st-b-r-t p  pictureClick"    style="background:url(' + app.getOptimizedImgUrl(santu[1].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover" uid="' + santutop.UserId + '"      pid="' + santu[1].ProductId + '"></div>' +
						'<div class="st-b-r-b   p  pictureClick"   style="background:url(' + app.getOptimizedImgUrl(santu[2].Poster, 350).replace("http://", "https://") + ' )no-repeat center center;background-size:cover" uid="' + santutop.UserId + '"      pid="' + santu[2].ProductId + '"></div>' +
						'</div> </div> </div>'

                } else if (data.Data[i].ProductInfos.length == 1) {
                    html += '<div class="ertu">' +
						authorContent +
						'<div class="yt-top-r"  style="display:none;">' +
						'<p>关注</p> </div> </div> ' +
						'<div class="et-b-tu p    pictureClick"  style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' )no-repeat center center;background-size:cover"   uid="' + santutop.UserId + '" pid="' + santu[0].ProductId + '"></div>' +
						'</div> </div>'
                } else if (data.Data[i].ProductInfos.length == 2) {
                    html += '<div class="yitu">' +
						authorContent +
						'<div class="yt-top-r"   style="display:none;">' +
						'<p>关注</p> </div> </div> ' +  
						'<div class="yt-bot clearfix ">' +
						'<div class="yt-bot-l p  pictureClick "  style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"  uid="' + santutop.UserId + '"    pid="' + santu[0].ProductId + '" ></div>' +
						'<div class="yt-bot-r p  pictureClick"  style="background:url(' + app.getOptimizedImgUrl(santu[1].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"   uid="' + santutop.UserId + '"      pid="' + santu[1].ProductId + '" ></div>' +
						'</div>  </div> </div> ';
                  
                }
            }
            $(".jtnr").append(html);
            AllowClick = true;
        }
        $('.yt-top').unbind("click").on('click', function (e) {
            e.preventDefault();
            var uid = $(this).children(".yt-top-l").children("img").attr("uid");
            window.location.href = "//artist.momentcam.net/page/MySpace.html" + urlLinks + "language=zh&appversion=87&fromtype=a&userid=" + uid;
            //mcAPI.openSpecificSpacePageById(uid);
        })     
        $('.pictureClick').on('click', function () {
            var pid = $(this).attr("pid");           
            var trace = encodeURIComponent("fuid:" + $(this).attr('uid'));
            window.location = "//artist.momentcam.net/page/DetailsPage.html" + urlLinks + "&productid=" + pid;
            
        });

    }
}

window.onload = function () {
    mfxd(sortType, 0);
    //进行下拉加载
    $(".banxin").scroll(function () {
        var $this = $(this),
			viewH = $(this).height(), //可见高度
			contentH = $(this).get(0).scrollHeight, //内容高度
			scrollTop = $(this).scrollTop(); //滚动高度
        if (contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
            if (!clickCheck) {
                clickCheck = true;
                if ($('.hzs').hasClass("active")) {
                    sortType = $(".hzs").attr("data-id")
                };
                if ($('.xlyx').hasClass("active")) {
                    sortType = $(".xlyx").attr("data-id")
                };
                if ($(".second  .zxshop").hasClass("active")) {
                    sortType = $(".second  .zxshop").attr("data-id")
                }
                if ($(".second  .zxfb").hasClass("active")) {
                    sortType = $(".second  .zxfb").attr("data-id")
                }
                mfxd(sortType, lastShopID);
            }
        }
    });
    $(".AllShopReturn").on("click", function () {
        $.cookie("fromMagicshop", "true");
        history.go(-1);
    })
}
$(function () {
    $('.select  .ck  span').on('click', function (event) {
        var _this = $(this);

        if (_this.hasClass('down1')) {
            _this.addClass('down').removeClass("down1");
            _this.siblings().addClass('hide').removeClass("show");
            return

        }
        if (_this.hasClass('stopClick') && _this.hasClass('active') && _this.siblings().hasClass('show')) {
            _this.siblings().addClass('hide').removeClass("show");
            _this.addClass('up').removeClass('stopClick')
            return
        }
        if (_this.hasClass('up') && _this.hasClass('active') && _this.siblings().hasClass('hide')) {
            _this.siblings().addClass('show').removeClass("hide");
            //进行图片的旋转
            _this.addClass('stopClick').removeClass('up')
            return
        }
        if (_this.hasClass('down')) {
            $('.select .second').addClass('show').removeClass('hide');
            _this.addClass('down1').removeClass('down')
        } else {
            _this.addClass('down').removeClass('up');
            _this.removeClass("active")
            _this.siblings().addClass('hide').removeClass("show");
        }
    });
    $('.select .ck ul').on('click', "li", function () {
        var _this = $(this);
        _this.parent().parent().parent().parent().siblings('div').removeClass('active')
        $('select .ck ul').css('z-index', '888888')
        _this.addClass('cur').siblings().removeClass('cur');

        var txtx = _this.html();
        if (_this.parent().siblings().hasClass('down1')) {
            _this.parent().siblings().addClass('up').removeClass('down1')
        }
        _this.parent().siblings().addClass('up').removeClass('stopClick')
        _this.parent().siblings('span').html(txtx);
        _this.parent().addClass('hide');
        if (_this.hasClass("cur")) {
            _this.addClass("active").siblings('li').removeClass("active");
        }
        var sortId = $(this).attr("data-id");
        if ($("ul .cur").text() == $("ul .ck span").text()) {
            $("ul .ck span").addClass("active")
        }
        console.log(sortId)
        $(".jtnr").html('');
        mfxd(sortId, 0);

    })

});