/**
 * 页面 - 首页
 */

/**
 * 热点幻灯片
 */
var pageHomeHot = new Component('.page-home-section[section="hot"]','page-home-section-init',function( el ) {
    let $el = $(el)
    $el.data('slider', new Slider(
        el,
        {
            'callbackSlideInit': function( i, slide ){
                let $slide = $(slide).attr('data-order', i+1)
                    ,imgLoading = 0
                    ,$imgs = $slide.find('img')
                
                // 加入 loading 提示
                let loader = $('<div class="loading vmiddle"><span class="loader-circle vmiddle-body"></span></div>').prependTo( $slide )
                
                // 检查是否有图片
                function imgReady(){
                    //console.log('ready')
                    loader.remove()
                }
                if( $imgs.length ){
                    imgLoading = $imgs.length
                    $imgs.each(function( j, img ){
                        imgOk( img, function(evt){
                            imgLoading--
                            if( !imgLoading )
                                imgReady()
                        } )
                    })
                }else{
                    imgReady()
                }
            }
        }
    ))
});

/**
 * 什么值得舔
 */
var pageHomeHot = new Component('.page-home-section[section="recommended"]','page-home-section-init',function( el ) {
    let $cover = $(el).find('.cover')
    if( !$cover || !$cover.length )
        return false

    let $img = $cover.find('img')
    if( !$img || !$img.length )
        return false
    
    $cover.css('background-image', `url(${$img.attr('src')})`)
})