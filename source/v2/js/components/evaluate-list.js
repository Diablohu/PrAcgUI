/**
 * Created by i on 2016/5/23.
 */

new Component('.evaluate-list', 'evaluate-list-init', function(el) {
    var $contTitleA = $(el).find('.evaluate-list-title a');
    $(el).find('.user-new').show();
    $contTitleA.hover(function(e) {
        $(this).addClass("user-on").siblings().removeClass("user-on");
        var userClass = $(this).data('cont');

        $(el).find("."+userClass).show().siblings('.evaluate-list-cont').hide();
    },function() {

    });

    evaluate.init();

});

var evaluate = {
    data:{
            code: 200,
            result: {
                pageinfo: {
                    total_items: 2,
                    total_pages: 1,
                    remain_items: 0,
                    current_page: 1
                },
                datas: [
                    {
                        id: "3",
                        content: "收电费收费1",
                        score: "7.0",
                        uid: "7",
                        username: "tianruijie",
                        time: "1星期前",
                        face: "http://img.acgn.prpracg.com/00/00752575cc0b2e1e3e349aee7060a825.jpeg"
                    },
                    {
                        id: "1",
                        content: "dgdg",
                        score: "8.0",
                        uid: "2",
                        username: "",
                        time: "-1年前"
                    }
                ]

            }
        },

    getCookie: function(cookie_name) {
        var allCookie = document.cookie;
        var cookie_pos = allCookie.indexOf(cookie_name);
        if(cookie_pos != -1) {
            cookie_pos += cookie_name.length+1;
            var cookie_end = allCookie.indexOf(';',cookie_pos);
            if(cookie_end == -1) {
                cookie_end = allCookie.length;

            }
            var value = unescape(allCookie.substring(cookie_pos, cookie_end));
        }

    },
    sendAjax: function() {
        var _this = this;
        var sid = _this.getCookie('session_aone');
        $.ajax({
            url: API.evaluate,
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",
            /*data:{
                sort:sort,
                data_id:data_id,
                page:page,
                type:data_type
            },*/
            success: function(data, textStatus) {
                if(data.code == 200) {
                    _this.drawHtml(data,0,1);
                    _this.drawHtml(data,2,1);
                    _this.drawHtml(data,3,1);
                }

            },
            error: function() {

            }
        })

    },
    drawHtml: function(data,type,page) {
        var self = this;
        var htmlArr = [];
        var result = self.data.result.datas;
        console.log(result);
        for(var i= 0, len= result.length; i<len; i++) {
            htmlArr.push('<dl class="evaluate-list-item">');
            htmlArr.push('<dt><a href=""> <img src="'+result[i].face+'"></a></dt>');
            htmlArr.push('<dd class="evaluate-list-desc"> <h5><a href="">'+result[i].username+'</a><span>'+result[i].time+'</span></h5><p>'+result[i].content+'</p></dd>');
            htmlArr.push('<dd class="evaluate-list-num">'+result[i].score+'</dd>');
            htmlArr.push('</dt>');

        }
        var html = htmlArr.join('');
        switch(type) {
            case 2:
                $('user-praise').prepend(html);
                break;
            case 3:
                $('.user-bad').prepend(html);
                break;
            default :
                $('.user-new').prepend(html);
                break;
        }


    },
    init: function() {
        var self = this;
        self.sendAjax();
    }
};