var $document = $(document)
    ,$html
    ,$head
    ,$body
    ,$window
    ,$layout
    ,$nav
    ,$header, $headerNav
    ,$main
    ,$footer
    
    /* Sticky状态顶部边距，会自动计算为全站导航高度+头部导航高度，可直接调用该变量
     */
    ,navHeight = 0
    ,stickyTop = 0
    
    /* 当前页面滚动位置
     */
    ,documentScrollTop = 0
    ,documentScrollLeft = 0
    
    /* 当前页面可视区域/窗口尺寸
     */
    ,viewWidth = 0
    ,viewHeight = 0
    
    /* 页面全局Flag
     */
    ,uid
    ,isItemPage, itemType, itemId, itemFollowed
    ,isCirclePage, circleId, circleFollowed
    ,isThreadPage, tid, pid, threadEditable
    ,flagMap = {
        'uid':                  'uid',
        'item_type':            'itemType',
        'item_id':              'itemId',
        'item_is_followed':     'itemFollowed',
        'circle_id':            'circleId',
        'circle_is_followed':   'circleFollowed',
        'tid':                  'tid',
        'pid':                  'pid',
        'thread_editable':      'threadEditable'
    }
    
    // 是否处于iframe中
    ,isIframe = (top != window)
    
    ,pageUrl = location.href
