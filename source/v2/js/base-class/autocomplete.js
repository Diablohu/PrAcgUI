class Autocomplete{
    
    /**
     * 创建自动完成
     * @param {element} el - 输入框元素，可为原生元素对象也可为jQuery对象
     * @param {object} callbacks - 回调函数，当前支持 queryBeforeSend, querySuccess, queryError, queryComplete, resultSelect
     */
    constructor( el, callbacks ){
        let $el
        if( el instanceof jQuery ){
            $el = el
            el = $el[0]
        }else{
            $el = $(el)
        }
        
        this.el = el
        this.$ = $el
        
        if( $el.data('Autocomplete') )
            return $el.data('Autocomplete')

        //this.cur = null
        //this.querying = false
        //this.resultShowing = false
        //this.resultFrame = null
        //this.resultFrameHiding = null
        
        this.type = el.getAttribute('prpr-autocomplete') || 'item'
        if( this.type === 'true' || this.type === true || this.type === 'prpr-autocomplete' )
            this.type = 'item'
        
        this.callbacks = callbacks || {}
        this.cb = {
            
            // 查询开始前
            'queryBeforeSend': () => {
                if( this.callbacks.queryBeforeSend )
                    this.callbacks.queryBeforeSend()
            },
            
            // 查询成功
            'querySuccess': ( data, textStatus, jqXHR ) => {
                if( this.callbacks.querySuccess )
                    this.callbacks.querySuccess( data, textStatus, jqXHR )
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
                this.query()
            },
            
            // 选择结果
            'resultSelect': ( evt ) => {
                if( this.callbacks.resultSelect )
                    this.callbacks.resultSelect( evt )
                
                //evt.preventDefault()
                //console.log(evt)
                this.resultHide( true )
            },
            
            // 筛选结果
            'resultFilter': ( o ) => {
                if( this.callbacks.resultFilter )
                    return this.callbacks.resultFilter( o )
                return true
            }
        }
        
        $el.on({
            'input': () => {
                this.onInput()
            },
            'focus': () => {
                this.onFocus()
            },
            'blur': () => {
                this.onBlur()
            }
        }).data('Autocomplete', this)
        
        return this
    }
    
    onInput(){
        //console.log( '[PrPrAutoComplete] input changed: ' + this.$.val() )
        clearTimeout( this.resultFrameHiding )
        setTimeout( () => {
            this.query()
        }, 100 )
    }
    
    onFocus(){
        //console.log( '[PrPrAutoComplete] input focused' )
        clearTimeout( this.resultFrameHiding )
        if( this.cur ){
            this.resultShow()
            if( !this.querying ){
                this.resultUpdate( Autocomplete.cache[ this.type + '::' + this.cur ] )
            }
        }
    }
    
    onBlur(){
        //console.log( '[PrPrAutoComplete] input blurred' )
        this.resultHide()
    }
    
    /**
     * 进行异步查询
     * @param {string} text - [可选] 查询字段，如不存在则使用该类的查询队列的第一项
     * @param {string} type - [可选] 查询类型，如不存在则使用该类的 type 属性
     */
    query( content ){
        content = content || this.$.val()
        if( !content || content == this.cur )
            return
        
        /* 查询流程/步骤
         * 如果正在查询，将“下一项”替换为当前查询项目，并终止流程
         * 保存当前查询状态
         * 查询
         * callback - queryBeforeSend
         * callback - querySuccess
         * callback - queryError
         * callback - queryComplete
         * callback - resultSelect
         * 取消查询中状态
         * 查询队列中的下一项内容
         */
        
        // 如果正在查询，将“下一项”替换为当前查询项目，并终止流程
        if( this.querying )
            return this.cur
        
        // 设置状态：查询中
        this.cur = content
        this.querying = true
        
        // 开始查询流程
        //console.log( this.type, this.cur )
        
        /*
         * 创建搜索结果框，搜索结果框显示为“查询中”，显示搜索结果框
         * 检查有效结果缓存，如果有，直接输出结果
         * callback - queryBeforeSend
         * AJAX查询开始
         * AJAX查询结束
         * 存入有效结果缓存
         * callback - querySuccess
         * callback - queryError
         * callback - queryComplete
         * 检查查询状态是否匹配
         * 如果匹配，调整搜索结果框内容为搜索结果
         * callback - resultSelect
         * 取消查询中状态
         * 查询队列中的下一项内容
         */
        
        if( Autocomplete.cache[ this.type + '::' + content ] ){
            if( this.cb.querySuccess )
                this.cb.querySuccess()
            if( this.cb.queryComplete )
                this.cb.queryComplete()
            return this.resultUpdate( Autocomplete.cache[ this.type + '::' + content ] )
        }else{
            this.resultUpdate( 'querying' )
            
            $.ajax({
                'beforeSend': this.cb.queryBeforeSend,
                
                'url':      this.el.getAttribute('prpr-autocomplete-api') || API.autocomplete[this.type],
                'method':   'GET',
                'data':     {
                    'word':     content
                },
                'dataType': 'json',
                
                'success': ( data, textStatus, jqXHR ) => {
                    Autocomplete.cache[ this.type + '::' + content ] = data.data || []
                    if( this.cb.querySuccess )
                        this.cb.querySuccess( data, textStatus, jqXHR )
                    return this.resultUpdate( data.data || [] )
                },
                
                'error': this.cb.queryError,                
                'complete': this.cb.queryComplete
            })
        }
        
        // 查询流程 - 结束
    }
    
    resultUpdate( results ){
        this.resultShow()
        this.resultFrame.empty()
        
        if( results == 'querying' )
            return this.resultFrame.html( '<div class="menuitem">查询中……</div>' )
        
        else if( typeof results == 'object' ){
            if( !results.length )
                return this.resultFrame.html( '<div class="menuitem">暂无结果……</div>' )
            else{
                //console.log( results )
                results = results.filter( this.cb.resultFilter )
                if( results.length ){
                    results.forEach( (o) => {
                        $(`<a href="${Autocomplete.result.url(this.type, o.tag_id)}" class="menuitem" item-id="${o.tag_id}">${o.name}</a>`).appendTo( this.resultFrame )
                    } )
                }else{
                    this.resultFrame.html( '<div class="menuitem">暂无更多结果……</div>' )
                }
                return this.resultFrame
            }
        }
    }
    
    resultCreate(){
        if( this.resultFrame )
            return this.resultFrame
        
        this.resultFrame = Autocomplete.frameCreate('mod-' + this.type)
        this.resultFrame.on('click.resultSelect', '[item-id]', this.cb.resultSelect)
            .on({
                'mousedown': () => {
                    clearTimeout( this.resultFrameHiding )
                    setTimeout( () => {
                        clearTimeout( this.resultFrameHiding )
                    }, 10 )
                }
            })
        
        return this.resultFrame
    }
    
    resultShow(){
        if( this.resultShowing )
            return this.resultFrame
        
        let offset = this.$.offset() || {left:0, top:0}
        
        this.resultCreate().css({
            'width':    this.$.outerWidth(),
            'left':     offset.left,
            'top':      offset.top + this.$.outerHeight()
        }).addClass('on')
        this.resultShowing = true
        
        return this.resultFrame
    }
    
    resultHide( forceHide ){
        if( !this.resultShowing )
            return false
        
        clearTimeout( this.resultFrameHiding )

        this.resultFrameHiding = setTimeout( () => {            
            this.resultFrame.css({
                'width':    '',
                'top':      '',
                'left':     ''
            }).removeClass('on')//.empty()
            this.resultShowing = false
            
            return true
        }, forceHide ? 0 : 50)
    }
    
}

// 有效结果缓存
Autocomplete.cache = {}

// 搜索结果框存储容器
// Autocomplete.frameContainer = null

// 创建搜索结果框
Autocomplete.frameCreate = function( className ){
    if( !Autocomplete.frameContainer )
        Autocomplete.frameContainer = $('<div id="autocomplete"/>').appendTo($body)
    
    return $('<div/>',{
        'class':    'result ' + (className || '')
    }).appendTo( Autocomplete.frameContainer )
}

// 搜索结果项目相关
Autocomplete.result = {
    'url': function( t, id ){
        switch(t){
            case 'tag':     return `/tag/${id}`;    break;
        }
    }
}