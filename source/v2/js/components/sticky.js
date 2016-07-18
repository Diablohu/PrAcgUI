new Component('.sticky', 'sticky-init', function( el ){
    let offsetTop = false
        ,$el = $(el)
    function getOffsetTop(){
        el.removeAttribute('sticky')
        offsetTop = $el.offset().top - stickyTop;
        //scrollHandler()
        return offsetTop
    }
    
    //setTimeout(function(){
    getOffsetTop();
    scrollHandler();
    //}, 200)
        
    function scrollHandler(){
        if( offsetTop === false )
            return
        
        if( documentScrollTop >= offsetTop && !el.getAttribute('sticky') ){
            el.setAttribute('sticky', true);
        }else if( documentScrollTop < offsetTop && el.getAttribute('sticky') ){
            el.removeAttribute('sticky');
        }
    }
    
    function resizeHandler(){
        getOffsetTop()
        scrollHandler()
    }
    
    $document.on({
        'scrolled.headerSticky': scrollHandler
    });
    $window.on({
        'resized.recalculateHeaderSticky': resizeHandler
    })
});