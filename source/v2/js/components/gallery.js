

new Component('.gallery','gallery-init',function( el ) {
    let $el = $(el)
        ,$items = $el.find('dl')
        ,$template = $el.find('template')
        ,imgs = []
        ,options = {}
    
    $items.each(function(i, dl){
        let $dl = $(dl)
            ,$img = $dl.find('img')
            ,$link = $dl.find('a')
        imgs.push({
            'id':       $dl.attr('id') || null,
            'src':      $img.attr('data-src') || $img.attr('src'),
            'link':     $link && $link.length ? $link.attr('href') : '',
            //'modal':    $link && $link.length && $link.attr('modal') ? $link.attr('modal') : '',
            'width':    parseInt( $img.attr('data-width') ),
            'height':   parseInt( $img.attr('data-height') )
        })
    })
    
    options.template = function( data ){
        //console.log( data )
        return `<div class="photo-container" style="height:${data.displayHeight}px;margin-right:${data.marginRight}px;">`
                //+ `<a href="${data.src}" modal="picviewer" modal-url="${data.src}">`
                + `<a href="${ data.link || data.src}" target="_blank"${ data.modal ? ` modal="${data.modal}"` : '' }>`
                + `<img class="image-thumb lazy" src="${data.src}" data-src="${data.src}" style="width:${data.displayWidth}px;height:${data.displayHeight}px;" >`
                + `</a>`
                + `</div>`
    }
    
    new Gallery(
        imgs,
        $('<div class="gallery-row"/>').appendTo( $el ),
        options
    )
    
    $items.remove()
})





class Gallery{
    constructor( data_imgs, $container, options ){
        this.settings = $.extend( {}, Gallery.defaults, options, true )
        this.settings.images = data_imgs
        /**
         * data_imgs    ARRAY
         * {
         *      src     // STRING 原始图片地址
         *      width   // NUMBER 原始图片宽度
         *      height  // NUMBER 原始图片高度
         * }
         */
        //console.log(this.settings)
        
        $window.on('resized', () => {
            $container.justifiedImages(this.settings)
        })
        
        return $container.justifiedImages(this.settings)
    }
}
Gallery.defaults = {
    // http://nitinhayaran.github.io/Justified.js/demo/index.html
    
    /*
    template: function(photo){
        return htmlImage
    }
    */
    
    //imageContainer:   'photo-container',
    //imageSelector:    'image-thumb',
    
    /*
    appendBlocks: function(){
        return {
                rowNum : 1, // in which row should this block go, -1 indicates last row
                width : 150, // width of the desired block
                html : 'Add Photo' // html inside this block
            }
    }
    */
    
    getSize: function(photo){
        return {
            width:   photo.width,
            height:  photo.height
        }
    },
    thumbnailPath: function(photo, width, height){
        return photo.thumbnail || photo.src
    },
    rowHeight:      150,
    maxRowHeight:   350,
    margin:         2
}