new Component('.page-register','page-register-init',function( el ) {
    let $el = $(el)
        ,eula = $el.find('#eula')

    $el.find('#toggle-eula').on('click', function(){
        eula.toggleClass('show')
        $window.trigger('resized')
    })
})