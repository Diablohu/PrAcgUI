class LOD{
    constructor( settings ){
        if( !settings.name )
            return

        this._ = $.extend( {}, LOD.defaults, settings )

        if( !LOD.ready[this._.name] ){
            LOD.ready[this._.name] = {}
            for( let i in this._.resources ){
                LOD.ready[this._.name][i] = false
            }
        }

        this.readyState = LOD.ready[this._.name]
        this.readyCheck()

        return this
    }
    
    // 素材文件已全部读取完毕
    ready(){
        this._.ready()
    }
    
    // 检查素材文件是否已全部读取完毕
    readyCheck( /* t */ ){
        let r = true
        
        for( let name in this.readyState ){
            if( this.readyState[name] !== true )
                r = false
        }
        
        if( !r )
            return false
        
        return this.ready()
    }
    
    // 获取素材文件
    load( name, callback ){
        if( !name || typeof this.readyState[name] == 'undefined' )
            return false

        let cb = () => {
            if( callback )
                callback()
            this.readyState[name] = true
            this.readyCheck(name)
        }
        
        if( this.readyState[name] === true )
            return cb()
        
        this.readyState[name] = 'loading'

        let type = this._.resources[name][0]
            ,url = this._.resources[name][1]
        
        if( type == 'css' )
            $.getCSS( url, cb )
        else
            $.getScript( url, cb )
    }
}

LOD.defaults = {
    // name: STRING
    resources: {
        // name: [type, url]
    },

    ready: function(){}
}

LOD.ready = {}