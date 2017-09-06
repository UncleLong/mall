var part3_height = 0;
var urlLinks = window.location.search == "" ? "?v=1" : window.location.search;
var loadingIconURL = "https://mall-res.manboker.com/newmall/CN/loading.gif";
var fromMagicShop = $.cookie("fromMagicshop");
var GetProduct = function () {
    var t = new Date().getTime();
    $.ajax({
        type: "get",
        async: true,
        url: app.urls.GetMartDailyCN + "&title=shouye",
        timeout: 25000,
        cache: false,
        beforeSend: function () {
            var html = '<div class="waiting">' +
				'<img src="https://mall-res.manboker.com/newmall/CN/loading.gif" />' +
				'</div>';
            $(".hotList").append(html);
        },
        success: function (result) {
            console.log(result);
            try {
                if (result.StatusCode == 0) {
                    var resultData = result.Response[0];
                    var html1 = "",
						html2 = "",
						html3 = "";
                    var Defaultdiagram = app.getOptimizedImgUrl("https://mall-res.manboker.com/newmall/DefaultPicture/Defaultdiagram.jpg", 100);
                    for (var i = 0; i < resultData.Places.length; i++) {
                        for (var j = 0; j < resultData.Places[i].Products.length; j++) {
                            var t = true;
                            if (resultData.Places[i].Products[j].ProductId == "46643") {
                                var ver = "";
                                if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                                    ver = getQueryString("ver");
                                    if (ver < "406") {
                                        t = false;
                                    }
                                } else {
                                    ver = getQueryString("versionName");
                                    if (ver < "4.0.4") {
                                        t = false;
                                    }
                                }
                                function getQueryString(name) {
                                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                                    var r = window.location.search.substr(1).match(reg);
                                    if (r != null) return unescape(r[2]); return null;
                                }
                            }
                            if (t) {
                                var imgsrc = resultData.Places[i].Products[j].ShowImage.replace("http://", "https://");
                                var Iconsrc = resultData.Places[i].Products[j].AvatarIcon.replace("http://", "https://");
                                imgsrc = app.getOptimizedImgUrl(imgsrc, 200);
                                Iconsrc = app.getOptimizedImgUrl(Iconsrc, 100);
                                if (resultData.Places[i].Title == "人气热卖") {
                                    html1 += '<div class="hotDetail" id="' + resultData.Places[i].Products[j].ProductId + '">' +
                                        '<div class="hotPic">' +
                                        '<img class="icon lazy" src="' + Defaultdiagram + '" data-original="' + Iconsrc + '" />' +
                                        '<div class="goodsBox" style="background:url(' + imgsrc + ') no-repeat center;background-size:contain;">' +
                                        '</div>' +
                                        '</div>' +
                                        '<p class="goodsName"><img src="' + app.appendWebpForImgUrl("https://mall-res.manboker.com/newmall/CN/HOT.png") + '" />' + resultData.Places[i].Products[j].CategoryName + '</p>' +
                                        '<p class="goodsNameDetail">' + resultData.Places[i].Products[j].ProductName + '</p>' +
                                        '<p class="Price">¥ ' + resultData.Places[i].Products[j].SalePrice + '</p>' +
                                        '</div>';
                                }
                                if (resultData.Places[i].Title == "新品首发") {
                                    html2 += '<div class="hotDetail" id="' + resultData.Places[i].Products[j].ProductId + '">' +
                                        '<div class="hotPic">' +
                                        '<img class="icon lazy" src="' + Defaultdiagram + '" data-original="' + Iconsrc + '" />' +
                                        '<div class="goodsBox" style="background:url(' + imgsrc + ') no-repeat center;background-size:contain;">' +
                                        '</div>' +
                                        '</div>' +
                                        '<p class="goodsName"><img src="' + app.appendWebpForImgUrl("https://mall-res.manboker.com/newmall/CN/NEW.png") + '" />' + resultData.Places[i].Products[j].CategoryName + '</p>' +
                                        '<p class="goodsNameDetail">' + resultData.Places[i].Products[j].ProductName + '</p>' +
                                        '<p class="Price">¥ ' + resultData.Places[i].Products[j].SalePrice + '</p>' +

                                        '</div>';
                                }
                                if (resultData.Places[i].Title == "猜你喜欢") {
                                    html3 += '<div class="hotDetail" id="' + resultData.Places[i].Products[j].ProductId + '">' +
                                        '<div class="hotPic">' +
                                        '<img class="icon lazy" src="' + Defaultdiagram + '" data-original="' + Iconsrc + '" />' +
                                        '<div class="goodsBox" style="background:url(' + imgsrc + ') no-repeat center;background-size:contain;">' +
                                        '</div>' +
                                        '</div>' +
                                        '<p class="goodsName">' + resultData.Places[i].Products[j].CategoryName + '</p>' +
                                        '<p class="goodsNameDetail">' + resultData.Places[i].Products[j].ProductName + '</p>' +
                                        '<p class="Price">¥ ' + resultData.Places[i].Products[j].SalePrice + '</p>' +

                                        '</div>';
                                }
                            }
                        }
                    }

                    $(".part1 .hotList").html(html1);
                    $(".part3 .hotList").html(html2);
                    $(".part4 .hotList").html(html3);
                    $(".waiting").remove();
                    //获取part3距顶部的高度
                    part3_height = $(".part3").offset().top;
                    $(".main").css("overflow-y", "scroll");
                    part3_show();
                    //点击单个商品跳转
                    $(".hotDetail").on("click", function () {
                        var id = $(this).attr("id");
                        window.location.href = app.urls.ProductDetailURL + id+"&" + urlLinks.split("?")[1];
                    });
                    setTimeout(function () {
                        $("img.lazy").lazyload({
                            effect: "fadeIn",
                            container: $(".main"),
                            threshold: 200
                        });
                        $(window).resize();
                    }, 100);
                }
            } catch (e) { }
        },
        error: function (e) {

        }
    });
};


var Mall = {
    isLoaded: false,
    recommendSaver: {},

    //首页魔法商店 阴影 发现好店部分
    renderRecommend: function (data) {

        try {
            var _ = this;
            CallAjax(app.urls.GetTotalStoreURL, "", "get", function (r) {
                console.log(r)
                try {
                    var TotalStore = r.Data.Count
                    var data = _.recommendSaver;
                    console.log(data);
                    if (data.Data.length != 6) {
                        $(".FindGoodShop").hide();
                    } else {
                        $(".FindGoodShop").append('<div class="FindGoodShopButton" ><div>发现好店</div>  <div class="jiantou">></div> </div>');
                    }
                    var html = "",
                        posterHtml = "",
                        posterIconHtml = "",
                        posterLen = 6,
                        posterIconLen = 4;
                    while (posterLen--) {
                        posterHtml += ' <img src="' + app.appendWebpForImgUrl(data.Data[5 - posterLen].Poster).replace("http://", "https://") + '"/>';
                    }
                    while (posterIconLen--) {
                        posterIconHtml += '<li><img src="' + app.appendWebpForImgUrl(data.Data[5 - posterIconLen].UserIcon).replace("http://", "https://") + '"  uid="' + data.Data[5 - posterIconLen].UserId + '" ></li>';
                    }
                    html += '<div class="top">' + posterHtml + '</div>' +
                            ' <div class="foot">' +
                                '<ul>' + posterIconHtml + ' </ul>' +
                                ' <span class="footWords"><span class="TotalStore">' + TotalStore + '</span>位店主发布了精美商品</span>' +
                                '</div>';
                    $('.Shadowlayer').html(html);


                    $(".FindGoodShop   .FindGoodShopButton").on("click", function () {
                        $('.tabtitle span').eq(1).trigger("click");
                    })
                    $(".FindGoodShop  .yinying").on("click", function () {
                        $('.tabtitle span').eq(1).trigger("click");
                    })
                } catch (e) {
                    console.log(e);
                }
            });
        } catch (e) {
            console.log(e);
        }
    },
    getRecommend: function (callback) {
        try {
            var _ = this;
            var _callback = callback;
            CallAjax(app.urls.StudioRecommendsURL, "", "get", function (data) {
                _.recommendSaver = data;
                if (!fromMagicShop && !callback) {
                    _.renderRecommend(data);
                }
                else
                    return callback(data);
            });
        } catch (e) {
            console.log(e);
        }
    },
    Common: function () {
        GetProduct();
        initSwiper(".header .swiper-container1", '.swiper-pagination1');
        initSwiper(".swiper-container2", '.swiper-pagination2');
        function initSwiper(container, paginaionName) {
            new Swiper(container, {
                direction: 'horizontal',
                touchAngle: 20,
                autoplay: 4000,
                loop: true,
                observer: true,
                observeParents: true,
                pagination: paginaionName,
                autoplayDisableOnInteraction: false
            });
        }
        //判断hotDetail的奇偶性 设置样式
        if ($(".hot .hotDetail").length % 2 == 0) {
            $(".hotDetail:last").css("border-bottom", "none");
            $(".hotDetail:last").prev().css("border-bottom", "none");
        } else {
            $(".hotDetail:last").css("border-bottom", "none");
        }
    },
    Bind: function () {
        $(".mallGoods").on("click", function () {
            var id = $(this).attr("id");
            window.location.href = app.urls.ProductDetailURL + "?productid=" + id;
        });
        $(".mallLogo").on("click", function () {
            window.location.href = "//artist.momentcam.net/page/WorksShow.html";
        });

        //主页返回按钮
        $(".return").on("click", ClientReturn);
        //返回顶部
        $(".GoTop").on("click", function () {
            $('.banxin').animate({
                scrollTop: 0
            }, 1000);
            return false;
        });
        //点击分类按钮 弹出分类
        $(".classification").on("click", function () {
            window.location.href = "Class.html" + urlLinks;
        });


        //点击查看更多
        $(".MoreBtn").on("click", function () {
            var url = $(this).attr("url");
            console.log(url);
            window.location.href = url + urlLinks;
        });

        //点击购物车按钮
        $(".shapCart").on("click", function () {
            var isUserLogin = false;
            mcAPI.isLogin(function (isLogin) {
                isUserLogin = isLogin;
            });
            if (isUserLogin) {
                mcAPI.openCartListActivity();
            } else {
                mcAPI.login();
            }
        });
    },
    init: function () {
        if (!this.isLoaded) {
            fromMagicShop = false;
            this.isLoaded = true;
            this.Common();
            this.Bind();
            this.getRecommend();
        }

    }
};

$(document).ready(function () {

    //首页的两个轮播图
    var htmlHomeTop = '',
        htmlHomeMiddle = '',
        htmlHomeStudio = '';

    //第一个  
    for (var i = 0; i < HomeSwiper.Home.length; i++) {
        htmlHomeTop += ' <div class="swiper-slide" name="' + HomeSwiper.Home[i].name + '">' +
                    ' <img src="' + app.getOptimizedImgUrl(HomeSwiper.Home[i].src, 540).replace("http://", "https://") + '" /></div>';
    }
    $(".header  .swiper-container1  .swiper-wrapper").html(htmlHomeTop);
    //第二个
    for (var i = 0; i < HomeSwiper.HomeMiddle.length; i++) {
        htmlHomeMiddle += ' <div class="swiper-slide" name="' + HomeSwiper.HomeMiddle[i].name + '">' +

                       ' <img src="' + app.getOptimizedImgUrl(HomeSwiper.HomeMiddle[i].src, 540).replace("http://", "https://") + '" /></div>';
    }
    $(".swiper-container2  .swiper-wrapper").html(htmlHomeMiddle);
    //轮播图banner跳转
    $(document).on("click", ".swiper-slide", function () {
        var name = $(this).attr("name");
        Counter("新电商首页banner-" + name + "-点击");
        if ($(this).attr('url')) {
            if ($(this).attr('url') == "StudioIntro.html") {
                window.location.href = $(this).attr('url') + urlLinks;
            } else {
                window.location.href = $(this).attr('url') + urlLinks;
            }
        } else {
            if ($(this).attr('name') == "巧虎") {
                $.cookie("className", $(this).attr('name'));
                window.location.href = "Class.html" + urlLinks;
                return;
            }
            if ($(this).attr('name') == "教师节活动") {
                window.location.href = "bannerHTML/Teacher.html" + urlLinks;
                return;
            }
            if ($(this).attr('name') == "情书") {
                $.cookie("className", $(this).attr('name'));
                window.location.href = app.urls.ProductDetailURL + "2613289&" + urlLinks.split("?")[1];
                return;
            }
            if ($(this).attr('name') == "爱丽丝梦游仙境") {
                window.location.href = app.urls.ProductDetailURL + "3551749&" + urlLinks.split("?")[1];
                return;
            }
            if ($(this).attr('name') == "龙之战") {
                window.location.href = "bannerHTML/Dragon.html" + urlLinks;
                return;
            }
            window.location.href = "items.html" + urlLinks + "&name=" + $(this).attr('name');
        }
    });
    $(".goodsChoose li").on("click", function () {
        var name = $(this).html();
        Counter("新电商首页分类标签-" + name + "-点击");
        if ($(this).hasClass("orange")) {
            window.location.href = "Class.html" + urlLinks;
            return;
        }
        if (name == "巧虎") {
            $.cookie("className", name);
            window.location.href = "Class.html" + urlLinks;
            return;
        }
        if (name == "中国国家图书馆") {
            window.location.href = "bannerHTML/Library.html" + urlLinks;
            return;
        }
        window.location.href = "items.html" + urlLinks + "&name=" + name;
    });

    $(".FollowBtn").on('click', function () {
        $(this).css('background-color', "#FA9C14");
        $(this).css("color", "#ffffff");
    });

    //首页的最顶部的tab栏 切换
    $('.tabtitle span').click(function () {
        $(this).css('color', '#fa9f13').addClass("tabhover").siblings().css('color', '#000').removeClass('tabhover');
        $('.tabcontent').eq($(this).index()).show().siblings('.tabcontent').hide();

        if ($(this).index() == 1) {
            Studio.init();
        } else {
            Mall.init();
        }
        $(".MagicShopwaiting").css("display", "none");
    });

    //获取 url 参数  就是全部小店返回按钮
    if (fromMagicShop == "true") {
        $('.tabtitle span').eq(1).trigger("click");
        $.cookie("fromMagicshop", "false");
        Mall.Bind();
    } else {
        $('.tabtitle span').eq(0).trigger("click");
    }
})
function part3_show() {
    var flag = false;
    $(".banxin").scroll(function () {
        var this_scrollTop = $(this).scrollTop();

        if (this_scrollTop < 10) return;
        if (this_scrollTop > part3_height) {
            $(".GoTop").fadeIn(500).removeClass("goDown").addClass("goUp");
            $(".shapCart").removeClass("goDown").addClass("goUp");
        } else {
            if ($(".GoTop").hasClass("goUp")) {
                $(".GoTop").fadeOut(500).addClass("goDown");
                $(".shapCart").addClass("goDown");
            }
        }
    });
}
var Studio = {
    loadingIconURL: "//mall-res.manboker.com/newmall/CN/loading.gif",
    isLoaded: false,
    loadingDIV: '<div class="waiting"><img src="' + this.loadingIconURL + '" /></div>',
    //初始化
    init: function () {
        if (!this.isLoaded) {
            this.isLoaded = true;
            var htmlMagicShop = '';
            for (var i = 0; i < HomeSwiper.MagicShop.length; i++) {
                htmlMagicShop += ' <div class="swiper-slide"   url="' + HomeSwiper.MagicShop[i].url + '" name="' + HomeSwiper.MagicShop[i].name + '"  style="width:1080px">' +
                              ' <img class="swiper-lazy"   src="' + app.getOptimizedImgUrl(HomeSwiper.MagicShop[i].src, 540).replace("http://", "https://") + '" /></div>';
            }
            $(".swiper-container3  .swiper-wrapper").html(htmlMagicShop);

            var _ = this;

            if (!$.isEmptyObject(Mall.recommendSaver))
                _.getRecommend1(Mall.recommendSaver);
            else {
                CallAjax(app.urls.StudioRecommendsURL, "", "get", function (data) {
                    _.getRecommend1(data);
                });
            }
            this.getBoutiques();
            this.bindClick();
            new Swiper('.header1  .swiper-container3', {
                direction: 'horizontal',
                touchAngle: 20,
                autoplay: 4000,
                loop: true,
                pagination: '.swiper-pagination3',
                autoplayDisableOnInteraction: false
            });
        }
    },
    bindClick: function () {
        //点击跳转到全部小店
        $(".allshop").on("click", function () {
            window.location = "MagicShop.html?isallproduct=true"
        });
        //点击魔法小店的banner 跳转
        $(".header1").on("click", function () {
            window.location = "StudioIntro.html"
        });
    },
    //获取新品推荐
    getRecommend1: function (data) {
        //alert("新品推荐");
        var _ = this;
        $(".NewList").append(this.loadingDIV);
        console.log(data)
        var NewListwidth;
        if (data.Data.length > 6) {
            data.Data.length = 6;
            NewListwidth = 6 * 690;
        } else {
            NewListwidth = data.Data.length * 690
        }
        $(".main1 .NewArrivals .NewBox .NewList").width(NewListwidth);
        var html = '';
        for (var i = 0; i < data.Data.length; i++) {
            var certifiedImgs = ["", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_ordinary.png", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_Artist.png"];
            html += '<div  class="NewModel"  style="background:url(' + app.getOptimizedImgUrl(data.Data[i].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"  pid="' + data.Data[i].ProductId + '"  uid="' + data.Data[i].UserId + '">' +
                     //'<img src="' + data.Data[i].Poster + '"    pid="' + data.Data[i].ProductId + '"     uid="' + data.Data[i].UserId + '"  />' +
                     '<div class="_clickNewModel"   pid="' + data.Data[i].ProductId + '"  uid="' + data.Data[i].UserId + '"></div>' +
                     '<div class="DetailWords">' +
                     '<div class="Detail">' +
                     '<div class="DetailName">' +
                     '<span class="GoodsType  CommodityCategory">' + data.Data[i].CategoryName + '</span>' +
                    '<span class="line"></span>' +
                    '<span class="GoodsName">' + data.Data[i].Name + '</span></div>' +
                    '<div class="DetailPrice">' +
                    '<span>¥</span>' +
                    '<span>' + data.Data[i].Price + '</span> </div>  </div>' +
                    '<div class="Author">' +
                    '<img class="AuthorIcon" src="' + app.appendWebpForImgUrl(data.Data[i].UserIcon).replace("http://", "https://") + '"   uid="' + data.Data[i].UserId + '" />' +
                   '<div ><span>店主: ' + data.Data[i].UserName + ' </span><img  alt="Alternate Text"  src= "' + app.getOptimizedImgUrl(certifiedImgs[data.Data[i].CertifiedType], 350).replace("http://", "https://") + '"   /></div>' +
                    '</div>  </div>  </div>';
        }
        $(".NewList").html(html);
        $('.NewModel').on('click', function () {
            var uid = $(this).attr("uid");
            if (app.config.isMomanApp) {
                mcAPI.openSpecificSpacePageById(uid);
            } else {

                window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
            }


        });
    },
    //获取精品小店
    getBoutiques: function () {
        //alert("精品小店");
        $(".Studio").append(this.loloadingDIV);
        CallAjax(app.urls.BoutiquesURL, "", "get", function (data) {
            console.log(data);
            if (data.StatusCode == 200) {
                var html1 = '';
                for (var i = 0; i < data.Data.length; i++) {

                    var certifiedImgs = ["", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_ordinary.png", "https://mall-res.manboker.com/newmall/CN/newstudio/myspace_Artist.png"];
                    if (data.Data[i].LatestProducts.length > 0) {
                        var santutop = data.Data[i];
                        var santu = data.Data[i].LatestProducts;
                        if (santutop.UserSign == "") {
                            santutop.UserSign = "魔漫相机，遇见更好的自己"
                        }
                        var authorContent = '<div class="StudioAuthor">' +
                                 '<div class="StudioAuthorIcon">' +
                                 '<img src="' + app.getOptimizedImgUrl(santutop.UserIcon).replace("http://", "https://") + '"   uid="' + santutop.UserId + '" /> </div>' +
                                 '<div class="StudioAuthorWords">' +
                                 '<div  ><p  class="StudioAuthorName">店主: ' + santutop.UserName + '</p> <img   src= "' + app.appendWebpForImgUrl(certifiedImgs[data.Data[i].CertifiedType]).replace("http://", "https://") + '"    uid="' + santutop.UserId + '" /></div>' +
                                 '<p class="StudioAuthorDetail">' + eval("'" + santutop.UserSign + "'") + '</p>  </div>' +
                                 ' <div class="FollowBtn"  style="display:none;">关注</div> </div>';
                        if (data.Data[i].LatestProducts.length == 1) {
                            html1 += authorContent +
                                   '<div class="StudioPicList">' +
                                   '<div class="StudioPicListLeft  yitu    pictureClick"    style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"   pid="' + santu[0].ProductId + '"   uid="' + santutop.UserId + '" ></div>  </div>';
                        }

                        if (data.Data[i].LatestProducts.length == 3) {
                            html1 += authorContent +
                                  '<div class="StudioPicList">' +
                                  '<div class="StudioPicListLeft   pictureClick"   style="background:url(' + app.getOptimizedImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"    pid="' + santu[0].ProductId + '"></div>' +
                                  ' <div class="StudioPicListRight">' +
                                  '<div  class="left   pictureClick" style="background:url(' + app.getOptimizedImgUrl(santu[1].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"    pid="' + santu[1].ProductId + '"  uid="' + santutop.UserId + '"></div>' +
                                  '<div class="right    pictureClick" style="background:url(' + app.getOptimizedImgUrl(santu[2].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"    pid="' + santu[2].ProductId + '"   uid="' + santutop.UserId + '"></div> </div> </div>';
                        }

                        if (data.Data[i].LatestProducts.length == 2) {
                            html1 += authorContent +
                                   '<div class="StudioPicList">' +
                                   '<div class="Studioertu-left   pictureClick"  style="background:url(' + app.appendWebpForImgUrl(santu[0].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"    pid="' + santu[0].ProductId + '"></div>' +
                                    '<div class="Studioertu-right   pictureClick"  style="background:url(' + app.appendWebpForImgUrl(santu[1].Poster, 350).replace("http://", "https://") + ' ) no-repeat center center;background-size:cover"    pid="' + santu[1].ProductId + '"></div>' +
                                   '  </div>';
                        }
                    }
                }

                $(".Studio").html(html1);

                $('.StudioAuthor').unbind("click").on('click', function () {
                    var uid = $(this).children(".StudioAuthorIcon").children("img").attr("uid");
                    if (app.config.isMomanApp) {
                        mcAPI.openSpecificSpacePageById(uid);
                    } else {

                        window.location = "https://artist.momentcam.net/page/MySpace.html?language=zh&appversion=87&fromtype=html%3A1.0%3Ah5&userid=" + uid;
                    }

                })


                $('.StudioPicList img').on('click', function () {
                    var pid = $(this).attr("pid");
                    $.cookie("fromMagicshop", "true");
                    var trace = encodeURIComponent("fuid:" + $(this).attr('uid'));
                    window.location = app.urls.ProductDetailURL+ "&trace=" + trace;
                });
                $('.pictureClick ').on('click', function () {
                    var pid = $(this).attr("pid");
                    $.cookie("fromMagicshop", "true");
                    var trace = encodeURIComponent("fuid:" + $(this).attr('uid'));
                    window.location = app.urls.ProductDetailURL+ pid + "&trace=" + trace;
                });
            }
        });
    }
}
function loadImage(a, b) {
    var c = new Image;
    c.onload = function () {
        c.onload = null,
            b(c)
    },
		c.src = a
}
function CallAjax(url, data, type, callback) {
    $.ajax({
        type: type,
        async: true,
        url: url,
        timeout: 25000,
        cache: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            return callback(result);
        }
    });
}