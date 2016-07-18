/* 页面 - 帖子
 */

new Component('.postrow-actions','postrow-actions-init',function( el ) {
//new Layout(function( /*self*/ ){
    
    /**
     * {
     * errno: 0     // 0表示成功
     * msg: "111"
     * data: []
     * }
     */
    
    //$('.postrow-actions').on('actionSuccess', '.action', function( evt, data, textStatus, jqXHR ){
    $(el)
    .on('actionSuccess', '.action', function( evt, data, textStatus, jqXHR ){
        // action 成功
        //console.log( 'actionSuccess', evt, data, textStatus, jqXHR )
        if( !data.errno ){
            switch( evt.currentTarget.getAttribute('action') ){
            case 'hide':
            case 'delete':
                alert( `操作成功，即将返回上一页面` )
                history.back()
                break;
            case 'reply':
            case 'like':
            case 'fav':
                //
                break;
            default:
                alert( `操作成功` )
                break;
            }
        }else{
            alert( `发生错误 [${data.errno}] ${data.msg}` )
        }
    })
    .on('actionSuccess', '.action-extra .action', function( evt ){
        location.reload()
    })/*.on('actionError', '.action', function( evt, jqXHR, textStatus, errorThrown ){
        // action 报错
        //console.log( 'actionError', evt, jqXHR, textStatus, errorThrown )
        //alert( `发生错误 [${textStatus}] ${errorThrown}` )
    }).on('actionComplete', '.action', function( evt, jqXHR, textStatus ){
        // action 完成
        //console.log( 'actionComplete', evt, jqXHR, textStatus )
    }).on('actionCancel', '.action', function( evt ){
        // action 被取消
        //console.log( 'actionCancel', evt )
    })
    */
});