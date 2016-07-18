/**
 * CSS 支持性检查
 */
var cssCheck = {}


// 检查是否支持 calc()
// http://adonisk.com/blog/how-to-check-if-your-browser-supports-CSS3-s-calc-with-javascript.html
cssCheck.calc = function(){
    if( typeof cssCheck._calc != 'undefined' )
        return cssCheck._calc

    function check(prefix){
        prefix = prefix || '';
        var el = document.createElement('div');
        el.style.cssText = prefix + 'width: calc(1px);';
        return !!el.style.length;
    }
    
    cssCheck._calc = check('-webkit-') || check('-moz-') || check();
    
    return cssCheck._calc
}

// 检查是否支持某个CSS单位/值
// http://stackoverflow.com/questions/36191797/how-to-check-if-css-value-is-supported-by-the-browser/36191841
// cssCheck.value('1px')
// cssCheck.value('1vh')
// cssCheck.value('1xxoo')
cssCheck.value = function(value) {
    var d = document.createElement('div');
    d.style.width = value;
    return d.style.width === value;
};
