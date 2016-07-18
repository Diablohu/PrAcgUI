/*个人中心相关js*/
$(function() {
    var conts = $('.friend-operate');
    conts.each(function(index,ele){
        var isClicked = true;
        $(ele).find('.c-zan').on('click', function() {
            var text = parseInt($(this).find('b').text());
            if(isClicked) {
                $(this).find('b').text(text+1);
                isClicked = false;
            } else {
                $(this).find('b').text(text-1);
                isClicked = true;
            }
        });

    });

    $('.news-list li').hover(function() {
        $(this).find('.del').show();
    },function() {
        $(this).find('.del').hide();
    });

    $('.news-list .del').on('click', function() {
        $(this).closest('li').remove();
    });


});
