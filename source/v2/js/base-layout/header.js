/* 词条页头部
 */

const layoutHeader = new Layout(function(self){

/* 以下变量可访问取值
 * layoutHeader.headerHeight        当前头部区域的高度
 * layoutHeader.headerNavOffsetTop  当前头部导航距页面顶部的距离
 */

// header sticky
// 词条导航随滚动固定（sticky）
    /* layoutHeader.getHeaderNavOffsetTop()
     * 运行该函数后会重新计算词条导航所在Y轴的位置
     */
    self.getHeaderNavOffsetTop = function(){
        $layout.removeClass('mod-header-sticky');
        navHeight = $nav.css('position') == 'fixed' ? $nav.height() : 0
        let headerNavHeight = $headerNav.height()
        self.headerHeight = $header.outerHeight(true)
        self.headerNavOffsetTop = self.headerHeight - headerNavHeight - navHeight;
        stickyTop = headerNavHeight + navHeight + 30
        //headerSticky()
        return self.headerNavOffsetTop
    }
    
    self.getHeaderNavOffsetTop();
    //setTimeout(function(){
    //    self.getHeaderNavOffsetTop();
    //}, 200)
        
    function headerSticky(){
        if( !navHeight )
            return
        
        if( !isIframe ){
            if( documentScrollTop >= navHeight * 2 / 3 ){
                $nav.addClass('mod-solid')
            }else{
                $nav.removeClass('mod-solid')
            }
        }
        
        if( !self.headerNavOffsetTop )
            return
        
        if( !isIframe ){
            if( documentScrollTop >= self.headerNavOffsetTop && !$layout.hasClass('mod-header-sticky') ){
                $layout.addClass('mod-header-sticky');
            }else if( documentScrollTop < self.headerNavOffsetTop && $layout.hasClass('mod-header-sticky') ){
                $layout.removeClass('mod-header-sticky');
            }
        }else{
            if( documentScrollTop >= self.headerNavOffsetTop ){
                $layout.addClass('mod-header-sticky');
                $headerNav.css('transform', `translateY(${documentScrollTop}px)`)
            }else{
                $layout.removeClass('mod-header-sticky');
                $headerNav.css('transform', '')
            }
        }
    }

/**
 * 头部banner图
 * 视差滚动（parallax）
 * 大图尺寸
 */
    let banner = $header.find('.header-banner-img')
        ,img
    function headerBannerParallax(){
        if( !banner.length || documentScrollTop > self.headerHeight )
            return
        banner.css('transform', 'translate3d(0, ' + ( Math.max(0, documentScrollTop) / 3 ) + 'px, 0)')
    }
    //headerBannerParallax();
    /**
     * 如果支持 vw/vh 单位，进行大图处理
     */
    if( banner.length && cssCheck.value('1vw') ){
        img = $(`<img src="${banner.css('background-image').slice(4, -1).replace(/["|']/g, "")}"/>`)
            .appendTo( banner )
        imgOk( img, function(evt){
            $('<span/>').css('background-image', `url(${img.attr('src')})`).appendTo(banner)
            banner.addClass('is-loaded').css('background-image', '')
            /*
            if( $header.hasClass('mod-banner') ){
                let heightOri = $header.height()
                    ,scrollTopOri = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0
                $header.addClass('is-banner-loaded').height( img.height() )
                //console.log( scrollTopOri, img.height(), heightOri, scrollTopOri + (img.height() - heightOri) )
                $body.scrollTop( scrollTopOri + ($header.height() - heightOri) )
                img.remove()
                $window.trigger('resized')
            }
            */
        } )
    }

// 绑定事件
    function headerScrollHandler(){
        headerSticky()
        headerBannerParallax()
    }
    function headerResizeHandler(){
        self.getHeaderNavOffsetTop()
        headerSticky()
    }
    $document.on({
        'scrolled.headerSticky': headerScrollHandler
    });
    $window.on({
        'resized.recalculateHeaderSticky': headerResizeHandler
    })

// 按钮 - 订阅
    /* 如果为词条页面，按钮为词条订阅
     * 如果为圈子页面，按钮为圈子订阅
     */
    //let $headerButton = $header.find('.header-subcribe')
    $header.on('click.headerButton', '.header-subcribe', function( evt ){
        let action = evt.currentTarget.getAttribute('button')
        if( isItemPage ){
            
        }else if( isCirclePage ){
            switch( action ){
            case 'subcribe':
            case 'unsubcribe':
                $.ajax({
                    'beforeSend': function(){
                        evt.currentTarget.setAttribute('disabled', 'progress')
                        evt.currentTarget.removeAttribute('is-hover')
                    },
                    
                    'url':      API.circle[action],
                    'method':   'GET',
                    'data':     {
                        'circle_id':circleId,
                        'uid':      uid
                    },
                    'dataType': 'json',
                    
                    'success': function( data, textStatus, jqXHR ){
                        //console.log(data)
                        evt.currentTarget.setAttribute('button', action == 'subcribe' ? 'unsubcribe' : 'subcribe')
                        evt.currentTarget.innerHTML = action == 'subcribe' ? '已订阅' : '订阅'
                    },
                    
                    'error': function( jqXHR, textStatus, errorThrown ){                        
                    },
                    
                    'complete': function( jqXHR, textStatus ){
                        evt.currentTarget.removeAttribute('disabled')
                    }
                })
                break;
            }
        }else if( isThreadPage ){
            
        }
    });
    $header.on('mouseenter.headerButtonUnsubcribe', '.header-subcribe[button="unsubcribe"]', function( evt ){
        evt.currentTarget.innerHTML = '取消订阅'
        evt.currentTarget.setAttribute('is-hover', true)
    })
    $header.on('mouseout.headerButtonUnsubcribe', '.header-subcribe[button="unsubcribe"]', function( evt ){
        evt.currentTarget.innerHTML = '已订阅'
        evt.currentTarget.removeAttribute('is-hover')
    })

/**
 * 用户登出后处理
 */
    $body.on('actionSuccess', '[action="user-logout"]', function( evt, data, textStatus, jqXHR ){
        // action 成功
        //console.log( 'actionSuccess', evt, data, textStatus, jqXHR )
        if( !data.errno ){
            location.reload()
        }else{
            alert( `发生错误 [${data.errno}] ${data.msg}` )
        }
    })
});