/**
 * 页面 - 圈子
 */

new Layout(function( /*self*/ ){
    $body.on('change', '.user-controls select', function( evt ){
        let el = evt.currentTarget
        evt.preventDefault()
        
        if( el.getAttribute('disabled') )
            return
            
        $.ajax({
            'beforeSend': function(){
                el.setAttribute('disabled', 'progress')
            },
            
            'url':      API.circle.userlevel,
            'method':   'GET',
            
            'data': {
                'uid':      el.getAttribute('data-uid'),
                'username': el.getAttribute('data-uname'),
                'circle_id':circleId,
                'level':    $(el).val()
                //&uid=10&circle_id=1&level=3&username=%E9%A3%8E%E7%81%AB%E8%BD%AE
            },
            
            'success': function( data, textStatus, jqXHR ){
                alert( `操作完成` )
            },
            
            /*
            'error': function( jqXHR, textStatus, errorThrown ){
            },
            */
            
            'complete': function( jqXHR, textStatus ){
                el.removeAttribute('disabled')
            }
        })
    })
});