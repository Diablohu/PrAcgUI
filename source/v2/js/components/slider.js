class Slider{
    constructor( el, settings ){
        if( typeof Slider.index == 'undefined' ){
            Slider.index = 0
        }

        if( typeof el == 'object' && el.el )
            return new Slider( el.el, el )
        
        delete settings.el

        this._ = $.extend({}, Slider.defaults, settings, true)

        this.$el = this.getEl( el )
        this.$slides = this.getEl( this._.elSlides )
        this.$controls = this.getEl( this._.elControls ) || $('<div class="controls"/>').appendTo( this.$el )
        this.radios = []
        this.switches = []
        this.cur = 1
        this.count = this.$slides.length
        this.timeoutNext = this.timeoutStart()
        this.index = Slider.index
        
        this.$slides.each( (i, slide) => {
            this.slideInit(i, slide)
        } )

        this.$el.on( 'change.radioChange', 'input[type="radio"]', (evt) => {this.radioChange(evt)} )
            .on( 'mousemove.radioChange', () => {this.timeoutClear()} )
            .hover( () => {
                return this.timeoutNext = this.timeoutStart()
            } )
            
        // prev
        $('<button/>',{
            'type':     'button',
            'class':    'prev'
        }).on('click', () => {this.goPrev()}).prependTo(this.$controls)
            
        // next
        $('<button/>',{
            'type':     'button',
            'class':    'next'
        }).on('click', () => {this.goNext()}).appendTo(this.$controls)
        
        Slider.index++;
    }

    getEl( el ){
        if( el ){
            if( el instanceof jQuery ){
                return el
            }else if( typeof el == 'string' ){
                return this.$el.find( el )
            }else{
                return $(el)
            }
        }
        return false
    }
        
    slideInit( i, slide ){
        // radio
        this.radios[i] = $('<input/>',{
            'type':     'radio',
            'name':     `page-home-section-hot-${this.index}`,
            'id':       `page-home-section-hot-${this.index}-${i+1}`,
            'value':    i+1
        }).prop('checked', !i).prependTo(this.$el)
        
        // label
        this.switches[i] = this._.createSwitch(
            `page-home-section-hot-${this.index}-${i+1}`,
            i+1
        ).appendTo(this.$controls)

        return this._.callbackSlideInit( i, slide )
    }
    
    radioChange( evt ){
        //console.log( evt.currentTarget.getAttribute('value'), count )
        this.cur = parseInt( evt.currentTarget.getAttribute('value') );
    }
    
    goPrev(){
        this.go( this.cur - 1 )
    }
    
    goNext(){
        this.go( this.cur + 1 )
    }
    
    getOrder( order ){
        order = parseInt( order )
        if( order < 1 )
            order = this.count
        if( order > this.count )
            order = 1
        if( !order )
            return false
        return order
    }
    
    getOrderNext(){
        return this.getOrder( this.cur + 1 )
    }
    
    go( order ){
        if( typeof order == 'undefined' )
            return 
            
        order = this.getOrder(order)
        
        this.radios[order - 1].prop('checked', true).trigger('change')
        
        this.timeoutStart()
    }
    
    timeoutStart( time ){
        time = time || 5000
        this.timeoutClear()
        //console.log( 'timeoutStart' )
        this.$el.attr('pending', this.getOrderNext())
        return this.timeoutNext = setTimeout( () => {
            this.goNext()
        }, this._.interval )
    }
    
    timeoutClear(){
        if( !this.timeoutNext )
            return true
        //console.log( 'timeoutClear' )
        clearTimeout( this.timeoutNext )
        this.timeoutNext = null
        this.$el.removeAttr('pending')
        return true
    }
}

Slider.defaults = {
    // 自动翻页的时间间隔，毫秒单位
    'interval': 5000,

    /**
     * el开头的属性均为元素，可为CSS选择器、jQuery对象或原生NodeList/element
     * elSlides     幻灯片的分页
     * elControls   控制区域
     */
    'elSlides':   '.slide',
    'elControls': null,

    /**
     * 创建切换按钮元素
     * @param {number} i - index，从0开始
     * @param {element} slide - 分页元素，原生element
     */
    'createSwitch': function( id, order ){
        return $('<label/>',{
            'for':      id,
            'data-order':order//,
            //'html':     order
        })
    },

    /**
     * 初始化幻灯片分页各页
     * @param {number} i - index，从0开始
     * @param {element} slide - 分页元素，原生element
     */
    'callbackSlideInit': function( /*i, slide*/ ){}
}