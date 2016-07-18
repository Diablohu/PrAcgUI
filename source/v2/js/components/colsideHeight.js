/*算侧边的高度*/
/*
new Component('.row-2col','row-2col-init',function() {
    var $row2col = $('.row-2col');
    $('.row-2col').each(function (index, ele) {
        var $colAside = $(ele).find('.col-aside'),
            colAsideH = $colAside.height(),
            $colMain = $(ele).find('.col-main');
        if ($colMain.height() < colAsideH) {
            $colMain.height(colAsideH);
        }
    });
});
*/

new Component('.row-2col','row-2col-init',function( el ) {
    if( !cssCheck.calc() ){
        var $el = $(el),
            $colAside = $el.find('.col-aside'),
            colAsideH = $colAside.height(),
            $colMain = $el.find('.col-main');
        $el.addClass('mod-old')
        if ($colMain.height() < colAsideH) {
            $colMain.height(colAsideH);
        }
    }
});