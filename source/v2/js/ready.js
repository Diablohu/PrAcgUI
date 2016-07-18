$document.ready(function(){
    console.log('[TRIGGER] $document - ready')

    /* 全局 jQuery 元素变量
     */
    $html = $('html');
    $head = $('head');
    $body = $('body');
    $window = $(window);
    $layout = $('#layout');
    $nav = $('#nav');
    $header = $('#header');
    $headerNav = $header.find('.header-nav');
    $main = $('#main');
    $footer = $('#footer');

    documentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
    documentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
    
    viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)

    /* Debouncing window resize
     * 自定义事件: $window.resized
     * $window 的 resize 事件会有 100ms 的延迟时间，在延迟结束后，resized 事件会触发
     * 针对窗口尺寸更变的开发需使用 resized 事件，不建议使用原有的 resize 事件
     * 当前窗口尺寸存储于 viewWidth 与 viewHeight 全局变量中
     */
    let windowResizeDebouncingTimeout
    $window.on({
        'resize.resizeDebouncing': function(){
            viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
            viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            clearTimeout( windowResizeDebouncingTimeout )
            windowResizeDebouncingTimeout = setTimeout(function(){
                $window.trigger('resized')
            }, 100)
        }
    })

    /* Debouncing document scroll
     * 自定义事件: $document.scrolled
     * $document 的 scroll 事件会有延迟时间，在延迟结束后，scrolled 事件会触发
     * 对于现代浏览器，采用 requestAnimationFrame 方式，对于不支持的浏览器采用传统延迟时间方式
     * 针对页面滚动的开发需使用 scrolled 事件，不建议使用原有的 scroll 事件
     * 当前页面滚动位置存储于 documentScrollTop 与 documentScrollLeft 全局变量中
     */
    let isScrolling = false
    function scrollHandlerNew(){
        documentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        documentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        if( !isScrolling ){
            requestAnimationFrame(scrollY);
        }
        isScrolling = true;
    }
    function scrollY(){
        $document.trigger('scrolled')
        isScrolling = false;
    }
    if( window.requestAnimationFrame ){
        $document.on({
            'scroll.scrollDebouncing': scrollHandlerNew
        });
    }else{
        let windowScrollDevouncingTimeout
        $document.on({
            'scroll.scrollDebouncing': function(){
                clearTimeout( windowScrollDevouncingTimeout )
                windowScrollDevouncingTimeout = setTimeout(function(){
                    documentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                    documentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
                    $document.trigger('scrolled')
                }, 100)
            }
        });
    }
    
    /* 在窗口尺寸修改后（$window onresized），延迟 100ms 自动触发 $document onscrolled 事件
     * 在 body onload 后，延迟 100ms 自动触发 $window onresized 事件
     */
    let windowResizeAutoTriggerScrolledDebouncing
        ,now = (new Date()).valueOf()
    $window.on({
        'resized.autoTriggerScrolled': function(){
            console.log('[TRIGGER] $window - resized')
            clearTimeout( windowResizeAutoTriggerScrolledDebouncing )
            windowResizeAutoTriggerScrolledDebouncing = setTimeout(function(){
                $document.trigger('scrolled')
            }, 100)
        },
        'load.autoTriggerResized': function(){
            console.log('[TRIGGER] $window - load')
            setTimeout(function(){
                $window.trigger('resized')
            }, 100)
        }
    })
    $document.on({
        'scrolled': function( evt, scrollTop, scrollLeft ){
            //console.log('[TRIGGER] $document - scrolled')
            if( typeof scrollTop != 'undefined' )
                documentScrollTop = scrollTop
            if( typeof scrollLeft != 'undefined' )
                documentScrollLeft = scrollLeft
        }
    })
    
    /* 自动触发一次 $window onresized 事件
     */
    $window.trigger('resized')
    
    /* 页面全局Flag赋值
     */
    $head.find('meta').each(function(index, el){
        let name = el.getAttribute('name')
        if( flagMap[name] )
            window[flagMap[name]] = el.getAttribute('content')
    })
    if( itemType && itemId )
        isItemPage = true
    if( circleId )
        isCirclePage = true
    if( tid )
        isThreadPage = true
    
    /**
     * 检查当前是否处于iframe中，如果是，进行标记
     */
    if( isIframe ){
        $body.addClass('mod-iframe')
        //console.log( top.location.href , location.href, top.location.href != location.href )
        if( top.location.href != location.href )
            top.history.replaceState({
                'type': 'iframe',
                'url':  location.href
            }, document.title, location.href);
    }
    
    /** 历史记录事件 $window.onpopstate
     * 如果 state 状态中不存在 type 属性，且遮罩层 modal 没有在显示，重载当前URL，如果 modal 在显示，关闭 modal
     * 如果 state.type 为 iframe，使用遮罩层 modal 载入该 state.url
     */
    $window.on('popstate', function(evt){
        let state = evt.originalEvent.state || {}
        //console.log( state )
        
        if( !state.type ){
            if( modal.showing ){
                modal.hide()
            }else
                location.reload()
            return
        }
        
        if( state.type == 'iframe' ){
            modal.show(state.url, true)
            return
        }
    })
    
    /* 初始化所有页面框架和页面元素
     */
    Layout.initAll();
    Component.initAll( $layout );
});