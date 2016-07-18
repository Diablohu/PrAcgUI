
new Layout(function( /*self*/ ){
    $body.on('click.action', '.action', function( evt ){

        evt.preventDefault();

        if( evt.currentTarget.getAttribute('disabled') ){
            return false
        }
        
        let el = evt.currentTarget
            ,$el = $(el)
            ,type
            ,count
            ,countReg = new RegExp('\(([0-9]+)\)', 'g')
        
        if( el.getAttribute('disabled') )
            return el
            
        if( $el.hasClass('action-plus') ){
            type = 'plus'
            if( $el.hasClass('action-plus-on') ){
                type = 'plus-minus'
                //return el
            }
            count = countReg.exec( el.innerHTML )
            if( count && count.length > 1 )
                count = parseInt(count[1])
            else
                count = null
        }

        if( $el.hasClass('action-confirm') ){
            type = 'confirm'
        }
        
        if( type == 'confirm' ){
            if( !window.confirm( `确认${el.innerHTML}操作？` ) ){
                $el.trigger('actionCancel')
                return el
            }
        }
        
        if( type ){
            
            $.ajax({
                'beforeSend': function(){
                    el.setAttribute('disabled', 'progress')
                },
                
                'url':      el.getAttribute('href'),
                'method':   'GET',
                
                'success': function( data, textStatus, jqXHR ){
                    if( type == 'plus' ){
                        $el.addClass('action-plus-on');
                        if( typeof count == 'number' )
                            el.innerHTML = el.innerHTML.replace( countReg, count+1 )
                    }else if( type == 'plus-minus' ){
                        $el.removeClass('action-plus-on')
                        if( typeof count == 'number' )
                            el.innerHTML = el.innerHTML.replace( countReg, count-1 )
                    }
                    $el.trigger('actionSuccess', [data, textStatus, jqXHR])
                },
                
                'error': function( jqXHR, textStatus, errorThrown ){
                    $el.trigger('actionError', [jqXHR, textStatus, errorThrown])
                    alert( `${el.innerHTML}操作发生错误 [${textStatus}] ${errorThrown}` )
                },
                
                'complete': function( jqXHR, textStatus ){
                    setTimeout( () => {
                        el.removeAttribute('disabled')
                        $el.trigger('actionComplete', [jqXHR, textStatus])
                    }, 100)
                }
            })

        }
    });
});