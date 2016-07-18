
new Layout(function(self){

/**
 * 返回顶部
 * 点击 nav 的非链接、按钮区域时，返回页顶
 */
    function backToTop(evt){
        if( evt.currentTarget == evt.target ){
            $body.animate({
                scrollTop: 0
            }, 200)
        }
    }
    $nav.on('click.backToTop', backToTop)
});