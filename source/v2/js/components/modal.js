
new Layout(function( /*self*/ ){

    $body.on('click.modal', '[modal]', function( evt ){
        //if( !isIframe ){
        let el = evt.currentTarget
            ,url = el.getAttribute('modal')
        if( url == 'true' || url == true )
            url = el.getAttribute('href')
        if( url ){
            modal.show( url )
            evt.preventDefault()
        }
        //}
    })

})









var modal = {
    
    // frame        总框架
    // iframe       iframe元素
    // iWindow
    // cur          当前在框架内的元素
    // container    实际承载元素的容器
    // loader       载入中提示元素
    // showing      是否正在显示
    // hiding       即将隐藏的延迟
    // marginTop
    
    create: function(){
        if( this.frame )
            return this.frame
        
        this.frame = $('<div id="modal"/>')
            .append(
                this.container = $('<div class="body" frameborder="0"/>')
                    .on('click.cancelHideTimeout', function(){
                        modal.cancelHiding()
                    })
            )
            .append(
                this.btnClose = $('<button type="button" class="button-close"/>')
                    .on('click.hide', function(){
                        modal.hide()
                    })
            )
            .append(
                this.loader = $('<span class="loader-circle"/>')
            )
            .prependTo( $body.on('click.modalHideTimeout', function(){
                clearTimeout(modal.hiding)
                modal.hiding = setTimeout(function(){
                    modal.hide()
                }, 10)
            }) )
            .on('scrolled',function(){
                if( modal.iWindow ){
                    modal.iWindow.$document.trigger('scrolled', [modal.scrollTop - modal.marginTop * 2 + 2] )
                }
            })

        this.iframe = $('<iframe scrolling="no" seamless="seamless"/>').on({
            'load': function(){
                modal.frame.removeClass('is-loading')
                modal.frame.scrollTop(0)
                modal.iWindow = modal.iframe[0].contentWindow
                modal.iWindow.$window.on('resized.iframe', function(){
                    modal.iframeResize()
                })
                modal.iframeResize()
            },
            'error': function(){
                modal.frame.removeClass('is-loading')
            }
        })

        // scrolled事件
        this.isScrolling = false
        function scrollHandlerNew(){
            modal.scrollTop = modal.frame[0].scrollTop || 0;
            modal.scrollLeft = modal.frame[0].scrollLeft || 0;
            if( !modal.isScrolling ){
                requestAnimationFrame(scrollY);
            }
            modal.isScrolling = true;
        }
        function scrollY(){
            modal.frame.trigger('scrolled')
            modal.isScrolling = false;
        }
        if( window.requestAnimationFrame ){
            modal.frame.on({
                'scroll.scrollDebouncing': scrollHandlerNew
            });
        }else{
            let windowScrollDevouncingTimeout
            modal.frame.on({
                'scroll.scrollDebouncing': function(){
                    clearTimeout( windowScrollDevouncingTimeout )
                    windowScrollDevouncingTimeout = setTimeout(function(){
                        modal.scrollTop = modal.frame[0].scrollTop || 0;
                        modal.scrollLeft = modal.frame[0].scrollLeft || 0;
                        modal.frame.trigger('scrolled')
                    }, 100)
                }
            });
        }

        return this.frame
    },
    
    show: function( o, noHistory ){
        if( top != self )
            return top.modal.show( o )

        this.create().addClass('on')
        this.iWindow = null

        if( typeof o == 'string' ){
            if( this.iframe.attr('src') == o && this.showing == 'iframe' ){
                return this.frame
            }else{
                if( !noHistory ){
                    //console.log('state pushed')
                    top.history.pushState({
                        'type': 'iframe',
                        'url':  o
                    }, '', o);
                }
                console.log(o)
                this.frame.addClass('is-loading')
                return this.show( this.iframe.attr('src', o).height('') )
            }
        }
        
        if( this.cur )
            this.cur.detach()
        
        o.appendTo( this.container )
        this.cancelHiding()
        this.showing = true
        this.cur = o
        
        overlay.on()
        
        this.frame.scrollTop(0)
        this.marginTop = parseInt(this.container.css('margin-top'))
        
        return this.frame
    },
    
    hide: function(){
        if( !this.showing )
            return true
        
        if( location.href != pageUrl ){
            top.history.pushState({}, '', pageUrl);
        }
        
        this.create().removeClass('on is-loading')
        if( this.cur )
            this.cur.detach()
        this.showing = false
        this.iWindow = null
        
        this.iframe.attr('src', '').height('')
        
        overlay.off()
        
        return true
    },
    
    cancelHiding: function(){
        setTimeout(function(){
            clearTimeout(modal.hiding)
        }, 5)
    },
    
    iframeResize: function(){
        if( this.iWindow && this.iWindow.$window ){
            this.iframe/*.height(10)*/.height(
                this.iWindow.$header[0].scrollHeight + this.iWindow.$main[0].scrollHeight ||
                this.iWindow.$layout[0].scrollHeight ||
                this.iWindow.document.documentElement.scrollHeight
            )
        }
    }
    
}