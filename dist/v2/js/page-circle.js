'use strict';

new Layout(function () {
    $body.on('change', '.user-controls select', function (evt) {
        var el = evt.currentTarget;
        evt.preventDefault();

        if (el.getAttribute('disabled')) return;

        $.ajax({
            'beforeSend': function beforeSend() {
                el.setAttribute('disabled', 'progress');
            },

            'url': API.circle.userlevel,
            'method': 'GET',

            'data': {
                'uid': el.getAttribute('data-uid'),
                'username': el.getAttribute('data-uname'),
                'circle_id': circleId,
                'level': $(el).val()
            },

            'success': function success(data, textStatus, jqXHR) {
                alert('操作完成');
            },

            'complete': function complete(jqXHR, textStatus) {
                el.removeAttribute('disabled');
            }
        });
    });
});