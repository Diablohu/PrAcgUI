new Component('.relative-time[data-time]', 'relative-time-init', function( el ){
    new RelativeTime(el)
})

class RelativeTime{
    
    constructor( el, timestamp ){
        if( el instanceof jQuery ){
            el = el[0]
        }
        
        this.el = el
        
        if( typeof timestamp == 'undefined' ){
            timestamp = dateParserISO8601( el.getAttribute('data-time') )
        }else{
            timestamp = parseInt( timestamp )
        }
        
        if( !timestamp )
            return el
        
        this.timestamp = timestamp
        this.time = new Date(timestamp)
        
        if( this.calc() < 2 * 24 * 60 * 60 * 1000 )
            RelativeTime.els.push(this)
        
        return this
    }
    
    calc(){
        let now = new Date()
            ,diff = now.valueOf() - this.timestamp
            ,sec = diff / 1000
        if( sec < 60 * 2 ){
            this.el.innerHTML = '刚刚'
            return diff
        }
        
        let min = sec / 60
        //console.log(min)
        if( min < 60 ){
            this.el.innerHTML = Math.floor(min) + '分钟'
            return diff
        }
        
        let hour = min / 60
        if( hour < 24 ){
            this.el.innerHTML = Math.floor(hour) + '小时'
            return diff
        }
        
        let day = hour / 24
        if( day < 1 ){
            this.el.innerHTML =  '昨天'
            return diff
        }
        if( day < 3 ){
            this.el.innerHTML =  Math.floor(day) + '天'
            return diff
        }
        //this.el.innerHTML =  Math.floor(day) + '天'
        if( now.getFullYear() == this.time.getFullYear() )
            this.el.innerHTML =  this.time.format('m月d日')
        else
            this.el.innerHTML =  this.time.format('yyyy年m月d日')
        return diff
    }
    
}

RelativeTime.els = []

setInterval( function(){
    RelativeTime.els.forEach(function(el){
        el.calc()
    })
}, 60 * 1000)