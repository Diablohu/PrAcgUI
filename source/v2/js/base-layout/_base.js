
/** Class representing a page layout component. Unlike Component class, Layout is global, and can only be initiated once per page. */
class Layout{
    /**
     * Create a layout component.
     * @param {layoutInit} functionInit - Callback for initiation.
     */
    constructor( functionInit ){
        Layout.items.push(this);
        functionInit = functionInit || function(){};
        this.init = () => {
            if( this.inited )
                return this;

            /**
             * Initiate the component.
             * @callback layoutInit
             * @param {object} self - this.
             */
            functionInit(this);
            this.inited = true;
        };
    }
}

Layout.items = [];

Layout.initAll = function(){
    Layout.items.forEach(function(item){
        if( item.init )
            item.init();
    });
};




var overlay = {
    'on': function(){
        let scrollbar = window.innerWidth - document.documentElement.clientWidth
        $body.addClass('mod-overlay-on'
            + (scrollbar ? ' mod-overlay-on-scrollbar' : '')
        ).css('margin-right', scrollbar)
    },
    'off': function(){
        $body.removeClass('mod-overlay-on mod-overlay-on-scrollbar').css('margin-right', '')
    }
}