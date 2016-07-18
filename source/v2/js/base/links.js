/* 链接相关
 */

new Layout(function( /*self*/ ){
    
    $body.on('click.externalLinks pointerdown.externalLinks', 'a', function( evt ){
        // 外部链接默认打开新窗口/标签
        if( !evt.currentTarget.getAttribute('target') ){
            let href = evt.currentTarget.getAttribute('href')
            if( location.host ){
                //if( href.substr(0, 1) == '/' && href.substr(0, 2) != '//' ){
                //if( ['/', '#', '?'].indexOf(href.substr(0, 1)) >= 0 && href.substr(0, 2) != '//' ){
                if( ['/', '#', '?'].indexOf(href.substr(0, 1)) >= 0 ){
                    return evt.currentTarget.setAttribute('target', '_self');
                //}else if( href.indexOf('//') > -1 && href.indexOf('//' + location.host) < 0 ){
                }else if( href.indexOf('//') > -1 && href.indexOf('//' + domain) < 0 ){
                    return evt.currentTarget.setAttribute('target', '_blank');
                }
            }else{
                if( href.indexOf('://') > -1 ){
                    return evt.currentTarget.setAttribute('target', '_blank');
                }
            }
        }
    })
    .on('click.disableLink', 'a select', function( evt ){
        // select子元素不会触发A标签的click
        evt.preventDefault()
        return false
    });
});