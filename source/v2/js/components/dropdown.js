
/*
new Layout(function( self ){
    $body.on('click.dropdownUnfocusLinkNotTriggered', '.dropdown', function( evt ){
        console.log(evt)
        evt.preventDefault()
    })
})
*/

new Component('.dropdown', 'dropdown-init', function( el ){
    let $el = $(el)
    
    $el.on('click.unfocusLinkNotTriggered', 'a', function( evt ){
        if( !$el.is(':focus') ){
            evt.preventDefault()
            $el.focus()
            return false
        }
    }).on('focus', '.dropdown-menu *', function( evt ){
        $el.focus()
    })
});