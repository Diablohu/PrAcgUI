/**
 * 自动读取，通常用于自动刷新更多内容的列表
 */

new Component('[prpr-autoload]', 'prpr-autoload-init', function( el ){
    let type = el.getAttribute('prpr-autoload')
    //console.log( type )
    if( type !== 'false' || !type )
        new Autoload( el, type === 'true' || type === 'prpr-autoload' ? null : type )
})