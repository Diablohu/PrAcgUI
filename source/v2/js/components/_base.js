
/** Class representing a page component. */
class Component{
    /**
     * Create a component.
     * @param {string} selector - CSS selector.
     * @param {string} attrInit - Attribute name that identify this component is inited.
     * @param {componentInit} functionInit - Callback for initiation.
     */
    constructor( selector, attrInit, functionInit ){
        Component.items.push(this);
        functionInit = functionInit || function(){};
        this.init = function( $container ){
            $container.find( selector ).each(function(index, el){
                if( !el.getAttribute( attrInit ) ){

                    /**
                     * Initiate the component.
                     * @callback componentInit
                     * @param {object} el - Container element.
                     */
                    functionInit( el );
                    el.setAttribute( attrInit, true );
                }
            });
        };
    }
}

Component.items = [];

Component.initAll = function( $container ){
    Component.items.forEach(function(item){
        if( item.init )
            item.init( $container );
    });
    
    /**
     * 处理图片
     */
    let $imgs = $container.find('img')
    objectFitImages( $imgs );
    $imgs.filter('.lazy').lazyload({
        'event':    'scrolled'
    }); //图片img上加class="lazy" data-original="真正的图片地址"
};