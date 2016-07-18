/*评分业务逻辑*/

new Component('.self-grade','self-grade-init',function(el) {
    var $el = $(el);
    $el.find('.self-grade-do a').on('click',function(e) {
        $(this).addClass('on');
        $(this).siblings().removeClass('on')
    });

    //提交后端
    $el.find('.u-form').on('submit',function(e) {
        if($(this).find('.user-grade-submit').val() == '') {

            return false;
        }
    });
    $el.find('.user-grade-list').on('click','a',function(e) {
        e.preventDefault();
        var val = $(this).data('val');
        console.log(2);
        $el.find('.user-grade-pf-ipt').val(val);
    });
});
