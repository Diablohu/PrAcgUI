
/**
 * 允许原生DOM元素组（element/node）可以使用forEach方法
 */
NodeList.prototype.forEach = Array.prototype.forEach;





/**
 * 获取一级域名
 */
function getDomain( hostname ){
    let l = hostname.lastIndexOf('.')
    if( l > -1 )
        return hostname.substr( hostname.lastIndexOf('.', l-1) + 1 )
    return hostname
}





/**
 * 域名相关
 */
// 一级域名
const domain = getDomain( location.hostname )

// 二级域名跨域访问
if( domain )
    document.domain = domain





/**
 * 生成随机数
 */
function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}




/**
 * AJAX初始化
 */
$.ajaxSetup({
    'isLocal': !(!domain)
});




/**
 * 动态获取CSS
 */
$.getCSS = function( url, callback ){
    $.get( url, function(){
        $('<link>', {rel:'stylesheet', type:'text/css', 'href':url}).appendTo('head')
        if( callback )
            callback()
    } )
};




/**
 * 图片完成
 */
function imgOk( img, callback ){
    let $img
    if( img instanceof jQuery ){
        $img = img
        img = $img[0]
    }else{
        $img = $(img)
    }

    $img.on('load error', callback)

    // http://stackoverflow.com/questions/1977871/check-if-an-image-is-loaded-no-errors-in-javascript
    // During the onload event, IE correctly identifies any images that
    // weren’t downloaded as not complete. Others should too. Gecko-based
    // browsers act like NS4 in that they report this incorrectly.
    if (!img.complete) {
        return false;
    }

    // However, they do have two very useful properties: naturalWidth and
    // naturalHeight. These give the true size of the image. If it failed
    // to load, either of these should be zero.

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return false;
    }

    // No other way of checking: assume it’s ok.
    $img.trigger('load')
    return true;
}