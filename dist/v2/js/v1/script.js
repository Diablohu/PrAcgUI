/**
 * 
 * 鍔ㄦ极鐧剧index.js
 */
var Global = typeof Global =='undefined' ? {} : Global;
$(function() {
	Global.dm = {

		/**
		 * [switchTab tab切换]
		 * @param  {[string]} tabBtnName  [切换按钮父级类]
		 * @param  {[string]} tabContName [切换内容父级类]
		 * @return {[type]}             [undefined]
		 */
        fixNav:null,
		switchTab: function(tabBtnName, tabContName) {
			var that = this;
			var $tab =$(tabBtnName).find('.tab-i');
			var $cont = $(tabContName).find('.tab-cont');
			$(tabContName).find(".tab-cont[data-tab=0]").show();
			var that = this;
			$tab.on('click', function() {
				var tabIndex = $(this).attr('data-tab');
				$(this).siblings('.tab-i').removeClass('cur');
				$(this).addClass('cur');
				$(tabContName).find('.tab-cont').hide();
				$(tabContName).find('.tab-cont[data-tab='+tabIndex+']').show();
				that.neverBottomFooter();
			});
		},
		toolTipJs: function() {
			var $tipA = $('.s-num a');
			var $toolC = $('.js-tooltip');
			var x= 0,
				y = 0;
			$tipA.hover(function(e) {
				//mouse hover
				if(e.target.tagName.toUpperCase() == 'A') {
					var x = $(this).position().left +  $(this).width() + 10;
					y = $(this).position().top + $(this).height()/2;
					var jpTitle = $(this).attr('data-jptitle') || '',
					 	chTitle = $(this).attr('data-chtitle') || '',
						playdDate = $(this).attr('data-play') || '',
						playTime = $(this).attr('data-time') || '',
						$parentW = $('.tool-info'),
						$toolJpTitle =$parentW.find('.jp-t'),
						$toolChTitle =$parentW.find('.ch-t'),
						$toolPlayDate =$parentW.find('.play-date'),
						$toolPlayTime =$parentW.find('.play-time');
						if(!jpTitle && !chTitle && !playdDate && !playTime ) {
							return false;
						}
						$toolJpTitle.text(jpTitle);
						$toolChTitle.text(chTitle);
						$toolPlayDate.text(playdDate);
						$toolPlayTime.text(playTime);
						$toolC.css({
							'top': y + 'px',
							'left': x + 'px'
						}).show();
				}
			}, function(e){
				//mouse leave
				$toolC.hide();
			});

		},
        hoverShow: function(hoverCont,showInfo) {
            var hoverWrap = hoverCont || '.top-info';
            var showinfo = showInfo || '.operat-broad';
            $(hoverWrap).hover(function() {

                $(this).find(showinfo).show();
            }, function(){
                $(this).find(showinfo).hide();
            });
        },
		viewBookList: function() {
			var viewTab = $('.view-tab').find('.d-view');
			var that = this;
			viewTab.on('click', function(e) {

				var $viewCont = $('.view-list-w');
				if(e.target.className == 'i-grid') {
					$(this).siblings(viewTab).removeClass('view-choose');
					$(this).addClass('view-choose');
					$viewCont.find('.view-list').removeClass('type-g').addClass('type-l');
				}else {
					$(this).siblings(viewTab).removeClass('view-choose');
					$(this).addClass('view-choose');
					$viewCont.find('.view-list').removeClass('type-l').addClass('type-g');
				}
				//footer 永远在底部
				that.neverBottomFooter();
			})

		},
		/**
		 * [moreDetial description]
		 * @param  {[string]} btn        [内容更多按钮]
		 * @param  {[string]} moreDetial [更多内容的类名]
		 */
		moreDetial2: function(btn, moreCount ) {
			var cont = $(moreCount);
			if(cont.length) {
				$(btn).on('click', function() {
					cont.show();
					$(btn).remove();
				});
			}

		},

		fold: function(foldbtn) { //展开全部
			var foldbtn = foldbtn || '.shortbtn';
			$(document).on('click', foldbtn, function(e) {
				e.preventDefault();
				$(this).closest('.short').hide().siblings('.long').show();
			});

		},
		neverBottomFooter: function() {
		
			var footer = $('.bd'),
				footerHeight = 0,
				footerTop = 0;
			function fixedFooter() {
				footerHeight = footer.height();

				footerTop = ($(window).scrollTop()+ $(window).height - footerHeight-48) + 'px';
				if(($('body').height()+footerHeight) < $(window).height()) {

					footer.css({
						position: "absolute",
						bottom: 0,
						left: 0
					});
				} else {
					footer.css({
						position: "static"
					})
				}
			}
			fixedFooter();
		},
		reply: function(delbtn, replybtn) { //个人主页的删除和回复功能
			var delbtn = delbtn || '.delete-btn' ,
				replybtn = replybtn || '.reply-btn';

			$(document).on('click', delbtn, function() {
				$(this).closest('li').remove();

			});
			$(document).on('click', replybtn, function(e) {
				var name = $(this).parent().parent().find('.name-id').text();
				var comment = $('#commend');
				comment.val("回复@："+name);


			})
		},
		navMenu: function() {
			var $topMenu = $('.nav-menu');
			var drop = '.menu-drop';
			var arrowup = 'arrow-up';
			var arrowdown = 'arrow-down';
            var timer= null;

            function show($this) {
                $this.find(drop).show();
                $this.find('.arrow').removeClass(arrowup).addClass(arrowdown);
            }
            function hide($this) {
                timer = setTimeout(function(){
                    $this.find(drop).hide();
                    $this.find('.arrow').removeClass(arrowdown).addClass(arrowup);
                });
            }
			$topMenu.on('mouseenter',function() {
                $this= $(this);
                show($this);
			});
            $topMenu.on('mouseleave',function() {
                $this= $(this);
                hide($this);
            });

            $(drop).on('mouseenter', function() {
                $(this).show();
            });

		},
		hideNavMenu: function(e) {
			if ($(e.target).parents().hasClass('nav-menu') || $(e.target).hasClass('user-info') || $(e.target).parents().hasClass('menu-drop')) return;
			$('.menu-drop').hide();
			$('.arrow').removeClass('arrow-down').addClass('arrow-up');
		},
        share: function() {
            var url= '',
                pic= '',
                title ='';
                function shareTxt($el) { //当前this上的txt
                    var sHtml=[];
                    var share= $el;
                    var shareHtml='';
                        url= $el.data('url');
                        pic= $el.data('pic');
                        title =$el.data('title');
                    sHtml.push('<ul class="share-cont">');
                    sHtml.push('<li><a href="javascript:;" class="xlweibo">新浪微博</a></li>');
                    sHtml.push('<li><a href="javascript:;" class="qq">新浪微博</a></li>');
                    sHtml.push('<li><a href="javascript:;" class="weixin">新浪微博</a></li>');
                    sHtml.push('<li><a href="javascript:;" class="qqweibo">新浪微博</a></li>');
                    sHtml.push('</ul>');
                    shareHtml= sHtml.join("");
                    return shareHtml;
                }

                //share 按钮分享
                $(document).on('click','.share-btn',function(e) {

                    if($(this).find('.share-cont').length>0) {
                        $(this).find('.share-cont').toggle();
                    } else {
                        var shareHtml = shareTxt($(this));
                        $(this).append(shareHtml);
                    }

                });
                //点击别地方隐藏分享隐藏
                $(document).on('click', function(e) {
                    if(e.target.className !== 'share-btn') {
                        $('.share-cont').hide();
                    }

                });

            //新浪微博点击事件
            $(document).on('click', '.xlweibo', function() {
                window.open('http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&pic='+pic, '_blank');
                return false;
            });
        },
        /*commentDailog: function() {
            var self = this;
            $(document).on('click','.comment-btn', function() {
                var opt={
                    width: 568,
                    height: 476,
                    thinkDo: true,
                    myApprise: true,
                    multiIpt:true,
                    offenIpt: true,
                    shortComment: true,
                    bottom: true,
                    title: "想看"
                }
                if($('body').find('.overlay').length>0) {
                    $('body .overlay').toggle();
                } else {
                    $('body').append(Global.commentDiago.renderHtml(opt));

                }

                var ulHeight = $('.o-cont').height()+20;
                $(document).find('.overlay').show().css('height',ulHeight);
                $(document).find('.o-cont').css('height',ulHeight);
                Global.commentDiago.verticalCenterPop(".overlay");
                var onTitle = $(document).find('.t-on').text();
                $(document).find('.do-txt').text(onTitle);

            });
            if($('.share-btn').closest('.o-info').length) {
                self.share();
            }
        },*/
        commentDailog: function() {
            $(document).off('click','.comment-btn').on('click','.comment-btn', function() {
                var opt ={
                    isClose:true,
                    isHeader:true,
                    initTitle:"想看",
                    closeClassName:"close"
                }
                Global.commentDiago(opt).createWrap().createToDo(["想看","在看","看过","搁置","抛弃"]).createApprise(["很差","较差","还行","推荐","力荐"]).createGoodsApprise(["剧情","画面","音乐","人设","声优"],["juqing","huamian","music","renwen","shengyou"]).createLabel(["1","2","3","4","5","6","7","8"]).createCommonLabel(["8","7","6","5","4","3","2","8"]).createDiscus().createShare();
            });
        },
        unfoldAll: function(parentNode, curNode,inputClass,limitNum, btn) {//parentNode 父级class,curNode当前class，limitNum限制的字数,点击事件的按钮
            var parentN= $(parentNode); //p-detail
            var PLen= parentN.length;
            var totalText= [];
            if(PLen>1) {
                $.each(parentN,function(i,ele) {
                    var $this= $(ele);
                    var current = $this.find(curNode);
                    var currentNum= $.trim(current.text());
                    totalText.push(current.text());
                    var txtNum = $this.find(inputClass).attr('value');
                    if(txtNum< limitNum) {
                        $this.find(btn).hide();
                    } else{
                        var curNum= currentNum.substr(0,limitNum);
                        $this.find(curNode).text(curNum+'....');
                        $this.find(btn).show();
                    }
                });
                var showbtn= $(parentNode).find(btn);
                showbtn.each(function(i,e){
                    $(this).click(function(){
                        $(this).parent().text(totalText[i]);
                    });
                });

            } else {
                var current= $(parentNode).find(curNode); //p-detail
                var txtNum = $(inputClass).attr('value');
                var currentNum= $.trim(current.text());
                if(txtNum< limitNum) {
                    $(parentNode).find(btn).hide();
                } else {
                    var curNum= currentNum.substr(0,limitNum);
                    current.text(curNum+'....');
                    $(parentNode).find(btn).show();
                }
                $(btn).on('click', function(e) {
                    e.preventDefault();
                    $(this).prev().text(currentNum);
                    $(this).remove();

                });
            }

        },
        fixNav: function (){
            var top= $('.hd');
            if(Global.dm.scrollNav) clearTimeout(Global.dm.scrollNav);
            Global.dm.scrollNav= setTimeout(function() {
                if($(document).scrollTop() > 40) {
                    top.addClass('fix-nav');
                } else {
                    top.removeClass('fix-nav');
                }

            },100);

        },
		init: function() {
            var self = this;
			this.switchTab('.m-struct-switch','.m-struct-t');
			this.viewBookList();
			this.unfoldAll('.product','.p-detail','.detail-text',276, '.show-all');
            this.unfoldAll('.JS-info','.js-des','.vfigure_len',156, '.JS-more');
			this.hoverShow();
			this.toolTipJs();
			this.neverBottomFooter();
			this.fold();
			this.reply();
			this.navMenu();
            this.share();
            this.commentDailog();
            $(window).bind('scroll',self.fixNav);
			//$(document).on('click',Global.dm.hideNavMenu);
			var that = this;
			//窗口变化
			$(window).on('resize', function() {
				if(Global.dm.timer) {
					clearTimeout(Global.dm.timer)
				}
                Global.dm.timer = setTimeout(function() {
					that.neverBottomFooter();
				},500)
			});
        }
	}
    Global.dm.init();

	//检索页列表偶数加背景
	$('.filter-box').find('li:odd').addClass('bg');
   // $('.menu-drop').find('a:last').css('margin-bottom',0);
	//个人设置页最后一个去掉右边框
	lastNone('.think-list','a','br-none');


    lastNone('.fridend-list','li','bt-none');

	//我的广播最后li去掉底边框
	lastNone('.broadcat-list','li','btnone');

    lastNone('.top-list','li','bt-none');
	/**
	 * [lastNone description]
	 * @param  {[type]} className [ 父级]
	 * @param  {[type]} tagName   [找到最后一个的标签]
	 * @param  {[type]} addClass  [去掉的样式class]
	 * @return {[type]}           [undifined]
	 */
	function lastNone(className, tagName , addClass) {
		$(className).find( tagName + ':last').addClass(addClass);
	}


	

});

