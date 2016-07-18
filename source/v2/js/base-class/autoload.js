class Autoload{
    
    /**
     * 创建自动读取
     * @param {element} el - 输入框元素，可为原生元素对象也可为jQuery对象
     * @param {object} callbacks - 回调函数，当前支持 queryBeforeSend
     */
    constructor( el, type, callbacks ){
        Autoload.index++
        
        let $el
        if( el instanceof jQuery ){
            $el = el
            el = $el[0]
        }else{
            $el = $(el)
        }
        
        this.el = el
        this.$ = $el
        this.index = Autoload.index
        
        /**
         * this.type            列表类型
         * this.lastItem        [jQuery DOM] 已显示的最后一个条目的
         * this.lastItemId      已显示的最后一个条目的ID
         * this.containerMore   [jQuery DOM] 更多信息容器
         * this.btnMore         [jQuery DOM] 加载更多按钮
         * this.template        [jQuery DOM] 模板元素
         * this.templateHTML
         * this.querying = false
         * this.complete = false    已无更多内容
         */
        this.ids = []       // 已显示的条目ID集合
        this.page = 1       // 当前页码
        
        // 获取更多按钮的绝对位置
        this.moreOffset = {
            top: 0, left: 0
        }
        
        // 获取推文模板
        this.template = this.$.find('template')
        
        // 如果没有模板，终止，该元素不会自动获取更多
        if( !this.template || !this.template.length )
            return this
        
        // 确定列表类型
        if( type ){
            this.type = type
        }else{
            if( this.$.hasClass('list-thread') ){
                this.type = 'thread'
            }else{
                this.type = 'tweet'
            }
        }
        this.idAttr = Autoload.idAttr[this.type]
        
        if( this.idAttr ){        
            /**
             * 判断是否已有条目
             * 如果有，存储最后一条条目信息，显示加载更多按钮，并绑定onscrolled事件
             * 如果没有，终止，该元素不会自动获取更多
             */
            this.$.children(`dl[${this.idAttr}]`).each( ( index, el ) => {
                this.ids.unshift( el.getAttribute( this.idAttr ) )
            })    
            
            this.updatelastItem()
            
            if( !this.lastItemId )
                return el
        }else{
            this.updatelastItem( this.$.children('dl:last-of-type') )
        }
        
        /**
         * 回调函数
         */
        this.callbacks = callbacks || {}
        this.cb = {
            
            // 查询开始前
            'queryBeforeSend': () => {
                this.querying = true;
                if( this.callbacks.queryBeforeSend )
                    this.callbacks.queryBeforeSend()
            },
            
            // 查询成功
            'querySuccess': ( data, textStatus, jqXHR ) => {
                //console.log(data)
                
                // 过滤条目ID
                let dataList = data.data || data || {}
                dataList = dataList.list || dataList.threads || dataList.datas || []
                dataList = dataList.filter( ( d ) => {
                    let id = d.id || d.tid || d.image || 0
                    
                    if( id && this.ids.indexOf( id ) > -1 ){
                        // 已存在该条目，过滤
                        return false
                    }
                    
                    // 将ID存入ID集合
                    this.ids.unshift( id )
                    
                    // 注入DOM
                    this.appendItem( d )
                    
                    return true
                })
                
                if( this.type == 'thread' || this.type == 'pics' )
                    this.page++
                
                if( this.callbacks.querySuccess )
                    this.callbacks.querySuccess( data, textStatus, jqXHR )
                
                this.btnMoreLoadComplete( !dataList.length )
                
                // resized
                $window.trigger('resized')
            },
            
            // 查询出错
            'queryError': ( jqXHR, textStatus, errorThrown ) => {
                if( this.callbacks.queryError )
                    this.callbacks.queryError( jqXHR, textStatus, errorThrown )
            },
            
            // 查询过程完成
            'queryComplete': ( jqXHR, textStatus ) => {
                if( this.callbacks.queryComplete )
                    this.callbacks.queryComplete( jqXHR, textStatus )
                this.querying = false
            },
            
            // 筛选结果
            'resultFilter': ( o ) => {
                if( this.callbacks.resultFilter )
                    return this.callbacks.resultFilter( o )
                return true
            }
            
        }
    
        /**
         * 初始化流程
         */
            
        // 已有推文，继续进行
        this.containerMore = $('<div class="list-tweet-more"/>')
            .append(
                this.btnMore = $('<button/>',{
                    'type':     'button',
                    'class':    'button button-large',
                    'html':     '加载更多...'
                }).on( 'click', () => {this.load()} )
            )
            .insertAfter( this.lastItem )
        this.$.addClass( 'list-tweet-has-more' )
        
        // 定位更多信息容器
        this.getMoreOffset()
        
        /* 绑定scrolled & resized事件，实现自动加载
        */
        $document.on(
            'scrolled.componentListTweet-' + Autoload.index,
            () => {this.scrollHandler()}
        )
        $window.on(
            'resized.componentListTweet-' + Autoload.index,
            () => {this.resizeHandler()}
        )
        
        return this
    }
    
    /**
     * 更新最后一个条目的信息
     */
    updatelastItem( item ){
        if( item ){
            this.lastItem = item
            this.lastItemId = item.attr( this.idAttr || '' )
        }else{
            //console.log( this.idAttr )
            this.lastItem = this.$.find( `[${this.idAttr}]:last-of-type` )
            this.lastItemId = this.lastItem.attr( this.idAttr )
        }
    }
    
    /**
     * 计算更多信息容器的位置
     */
    getMoreOffset(){
        if( !this.containerMore || !this.containerMore.length )
            this.moreOffset = {top: 0, left: 0}
        else{
            let offset = this.containerMore.offset()
            this.moreOffset = {
                top: offset.top - stickyTop,
                left: offset.left
            }
        }
        return this.moreOffset
    }
    
    /**
     * 加载更多
     * AJAX请求
     * 返回的结果逐条和已显示条目比对，过滤掉重复项目
     * 返回结果时，重新计算加载更多按钮位置，更新最后一个条目信息
     */
    load(){
        if( this.querying || this.complete )
            return this.btnMore
            
        console.log('[PrPr-Autoload] 自动加载更多内容 - 开始')
        
        let api = typeof API[this.type] == 'string' ? API[this.type] : API[this.type].load
            ,data = {}
        
        switch( this.type ){
        case 'tweet':
            data = {
                'type':     itemType,
                'prpr_id':  itemId,
                'tw_id':    this.lastItemId,
                'limit':    20
            }
            break;
        case 'thread':
            data = {
                'circle_id':circleId,
                'p':        this.page + 1
            }
            break;
        case 'pics':
            data = {
                'data_id':  itemId,
                'pageNum':  this.page + 1,
                'pageSize': 10
            }
            break;
        }

        $.ajax({
            'beforeSend': this.cb.queryBeforeSend,
            
            'url':      api,
            'method':   'GET',
            'data':     data,
            'dataType': 'json',
            
            'success':  this.cb.querySuccess,
            'error':    this.cb.queryError,
            'complete': this.cb.queryComplete
        })
    }
    
    /**
     * 加载更多按钮
     * 加载中、加载完成、已没有更多内容
     */
    btnMoreLoadStart(){
        if( this.querying )
            return this.btnMore
        
        this.btnMore.attr('disabled', 'disabled')
            .addClass('state-loading')
            .html('加载中...')
        
        //this.querying = true
        
        return this.btnMore
    }
    btnMoreLoadComplete( isNoMore ){
        this.btnMore.removeClass('state-loading')
        console.log('[PrPr-Autoload] 自动加载更多内容 - 结束')
        
        if( isNoMore ){
            this.btnMore.html('已无更多内容').attr('disabled', 'disabled')
            $document.off( 'scrolled.componentListTweet-' + this.index )
            $window.off( 'resized.componentListTweet-' + this.index )
            this.complete = true
        }else{
            this.btnMore.html('加载更多...').removeAttr('disabled')
            this.scrollHandler()
        }
        
        this.getMoreOffset()
        this.querying = false
        
        return this.btnMore
    }
    
    /**
     * scrolled & resized事件函数
     */
    scrollHandler(){
        //console.log( documentScrollTop + viewHeight, containerMoreOffset.top - 100 )
        // 判断当前页面滚动条位置是否接近更多信息容器，如果是，加载更多
        if( documentScrollTop + viewHeight >= this.moreOffset.top - 100 )
            this.load()
    }
    resizeHandler(){
        // 重新计算更多信息容器的位置
        this.getMoreOffset()
    }
    
    /**
     * 添加新条目
     */
    appendItem( data ){
        //console.log(data)
        if( !this.templateHTML )
            this.templateHTML = this.template.html()
        
        let html = Autoload.templateFilter[this.type]( this.templateHTML, data )
        
        function _replace( search, replaced ){
            let reg = new RegExp(`\{${search}\}`, 'gm');
            /*
            if( _dateFormat && _dateFormat.length > 1 ){
                let time = new Date( parseInt( replaced ) * 1000 ) // PHP格式时间处理
                    ,formats = {
                        '1': 'yyyy年m月d日',
                        '2': "yyyy-mm-dd'T'HH:MM:ss'Z'"
                    }
                html = html.replace( reg, time.format( formats[_dateFormat[1]] ) )
            }*/
            html = html.replace( reg, replaced )            
            return html
        }
        
        for( let i in data ){
            if( typeof data[i] == 'object' ){
                for( let j in data[i] ){
                    _replace( `${i}_${j}`, data[i][j] )
                    //let reg = new RegExp(`\{${i}_${j}\}`, 'gm');
                    //html = html.replace( reg, data[i][j] )
                }                
            }else{
                _replace( i, data[i] )
                //let reg = new RegExp(`\{${i}\}`, 'gm');
                //html = html.replace( reg, data[i] )
            }
        }
        
        let searchRes
            ,scrapePtrn = /\{([^\{\}]+)_format_([^\{\}]+)\}/gm
        while( (searchRes = scrapePtrn.exec(html)) !== null ){
            try{
                if( searchRes && searchRes.length > 2 ){
                    let time = new Date( parseInt( data[searchRes[1]] ) * 1000 ) // PHP格式时间处理
                        ,formats = {
                            '1': 'yyyy年m月d日 HH:MM',
                            '2': "yyyy-mm-dd'T'HH:MM:sso"
                        }
                    html = html.replace( searchRes[0], time.format( formats[searchRes[2]] ) )
                }
            }catch(e){}
        }
        
        let $item = $(html).insertAfter( this.lastItem )
        Component.initAll( $item )
        
        //console.log( $item )
        
        this.updatelastItem( $item )
        
        return $item
    }
}

Autoload.idAttr = {
    'tweet':    'data-tweetid',
    'thread':   'data-tid'
}

Autoload.index = 0

/**
 * 模板处理
 */
Autoload.templateFilter = {}
Autoload.templateFilter.tweet = function( html, data ){
    if( data.type != 4 ){
        html = html.replace( /\<div class=\"retweet\"\>([\s\S]+?)\<\/div\>/gm, '' )
    }
    
    //( data.quote && parseInt(data.is_quote_status) )
    if( !data.quote || !parseInt(data.is_quote_status) ){
        html = html.replace( /\<div class=\"quote\"\>([\s\S]+?)\<\/div\>/gm, '' )
    }
    
    if( !data.rename_img ){
        html = html.replace( /\<p class=\"media\"\>([\s\S]+?)\<\/p\>/gm, '' )
    }
    
    return html
}
Autoload.templateFilter.thread = function( html, data ){
    return html
}
Autoload.templateFilter.pics = function( html, data ){
    return html
}