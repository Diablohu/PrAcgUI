function trimmedHtml(element){
    // http://stackoverflow.com/questions/32763232/how-to-remove-indents-from-multi-line-string-given-by-html-method
  var html = $(element).html();

  // find shortest html element indent
  var shortestIndent;
  html = html.split('\n');
  for(var i = 0; i < html.length; i++){
    // for each line
    var line = html[i];
    // ignore comment lines in searching
    if( $.trim(line).substring(0, 4) != "<!--" ){
      // count number of spaces before code for current line
      var spaces = line.search(/\S/);
      if( (shortestIndent > spaces || shortestIndent == undefined) && spaces >= 0 ){
        shortestIndent = spaces;
      }
    }
  }

  // remove spaces before each line (align to shortest indent)
  for(var i = 0; i < html.length; i++){
    // for each line
    var line = html[i];
    if( $.trim(line).substring(0, 4) != "<!--" ){
      // if line is not a comment, remove spaces
      html[i] = line.substring(shortestIndent, line.length);
    } else {
      // if line is a comment:
      // remove it's spaces
      html[i] = $.trim(line);
      // align to shortest line, and add 2 spaces
      for (space = 0; space < 2; space++) {
        html[i] = " " + html[i];
      }
    }
  }

  // join all lines
  html = html.join("\n");
  return html;
}




$document.ready(function(){
    
    // 随机颜色主题
    changeTheme( themes[getRandomIntInclusive( 0, themes.length-1 )] )
    
    // 自动生成目录
    var $toc = $('#doc-front-end-toc-list')
    $('#doc-front-end-main > h2').each(function(index, el){
        var $el = $(el)
        var text = $el.text()
        el.setAttribute('id', 'doc-'+text)
        $toc.append(
            $('<li/>').append(
                $('<a/>',{
                    'html':     text,
                    'href':     '#doc-' + text
                })
            )
        )
    })
    
    // 自动生成头部控制
    let classnames = []
    $('#doc-front-end-frame-header button[type="button"]').each(function(index, el){
        let m = el.getAttribute('header-mod')
        if( m ){
            classnames.push(m)
            $(el).on('click', function(){
                $header.removeClass(classnames.join(' ')).addClass(m)
                $document.trigger('resized')
            })
        }else{
            $(el).on('click', function(){
                $header.removeClass(classnames.join(' '))
                $document.trigger('resized')
            })
        }
    })
})

    
    // 自动生成示例代码
    $('.doc-sample').each(function(index, el){
        var $el = $(el)
            ,siblings = $el.children()
        if( !siblings.length || ( siblings.length == 1 && siblings[0].tagName == 'FIGURE' ) ){
            $el.addClass('mod-only-code')
            return
        }
        var html = trimmedHtml(el).trim()
        $el.append(
            $('<figure/>').append(
                $('<pre/>').append(
                    $('<code/>').text(html)
                )
            )
        )
    })