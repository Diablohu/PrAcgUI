/* 主题相关
 */

// 获取主题名称
function getTheme( el, getFullName ){
    if( !el || typeof el == 'string' || typeof el == 'number' || typeof el == 'boolean' )
        return getTheme( $body, el )

    if( el instanceof jQuery )
        el = el[0]

	let theme = /theme\-([^ ]+)/g.exec(el.className);
    
    if( theme && theme.length >= 2 ){
        theme = theme[1]
        theme = (getFullName ? 'theme-' : '') +theme
    }else{
        theme = ''
    }

	return theme.trim()
}

// 改变主题
function changeTheme( el, theme ){
    if( !el || typeof el == 'string' || typeof el == 'number' )
        return changeTheme( $body, el )

    if( el instanceof jQuery )
        el = el[0]
    
    let oldTheme = getTheme(el, true)
        ,newTheme = theme ? 'theme-' + theme : ''
    
    if( oldTheme )
	    return el.className = el.className.replace( getTheme(el, true), newTheme );
    
    return el.className+= ' ' + newTheme
}