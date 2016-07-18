'use strict';

new Component('.postrow-actions', 'postrow-actions-init', function (el) {
    $(el).on('actionSuccess', '.action', function (evt, data, textStatus, jqXHR) {
        if (!data.errno) {
            switch (evt.currentTarget.getAttribute('action')) {
                case 'hide':
                case 'delete':
                    alert('操作成功，即将返回上一页面');
                    history.back();
                    break;
                case 'reply':
                case 'like':
                case 'fav':
                    break;
                default:
                    alert('操作成功');
                    break;
            }
        } else {
            alert('发生错误 [' + data.errno + '] ' + data.msg);
        }
    }).on('actionSuccess', '.action-extra .action', function (evt) {
        location.reload();
    });
});