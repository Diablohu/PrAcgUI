'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || !1; descriptor.configurable = !0; if ("value" in descriptor) descriptor.writable = !0; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var API = {
    'common': {
        'js': '/dist/v2/js',
        'css': '/dist/v2/css'
    },

    'tweet': 'json-sample/tweets.json',
    'thread': 'json-sample/circle-thread-list.json',
    'pics': 'json-sample/img-list.json',

    'autocomplete': {
        'item': '',
        'tag': 'json-sample/autocomplete-tag.json'
    },
    'evaluate': 'json-sample/evaluate-list.json',
    'circle': {
        'subcribe': 'json-sample/autocomplete-tag.json?c=circle&a=follow&do=1',
        'unsubcribe': 'json-sample/autocomplete-tag.json?c=circle&a=follow&do=0',
        'userlevel': 'http://circle.prpracg.com/index.php?c=circle&a=changeLevel'
    }
};

API.trumbowyg = {
    'path': '/dist/trumbowyg'
};
API.trumbowyg.js = API.trumbowyg.path + '/trumbowyg.min.js';
API.trumbowyg.css = API.trumbowyg.path + '/ui/trumbowyg.min.css';
API.trumbowyg.svg = API.trumbowyg.path + '/ui/icons.svg';
API.trumbowyg.langs = API.trumbowyg.path + '/langs/';
API.trumbowyg.plugins = API.trumbowyg.path + '/plugins/';
API.trumbowyg.plugin = {
    'upload': API.trumbowyg.plugins + '/upload/trumbowyg.upload.min.js'
};

API.dropzone = '/dist/dropzone';
API.upload = 'http://g.pracg.com/index.php?c=upload&a=image';

var $document = $(document),
    $html,
    $head,
    $body,
    $window,
    $layout,
    $nav,
    $header,
    $headerNav,
    $main,
    $footer,
    navHeight = 0,
    stickyTop = 0,
    documentScrollTop = 0,
    documentScrollLeft = 0,
    viewWidth = 0,
    viewHeight = 0,
    uid,
    isItemPage,
    itemType,
    itemId,
    itemFollowed,
    isCirclePage,
    circleId,
    circleFollowed,
    isThreadPage,
    tid,
    pid,
    threadEditable,
    flagMap = {
    'uid': 'uid',
    'item_type': 'itemType',
    'item_id': 'itemId',
    'item_is_followed': 'itemFollowed',
    'circle_id': 'circleId',
    'circle_is_followed': 'circleFollowed',
    'tid': 'tid',
    'pid': 'pid',
    'thread_editable': 'threadEditable'
},
    isIframe = top != window,
    pageUrl = location.href;

var themes = ['red', 'pink', 'purple', 'deeppurple', 'indigo', 'blue', 'lightblue', 'cyan', 'teal', 'green', 'lightgreen', 'lime', 'yellow', 'amber', 'orange', 'deeporange', 'bluegrey'];

NodeList.prototype.forEach = Array.prototype.forEach;

function getDomain(hostname) {
    var l = hostname.lastIndexOf('.');
    if (l > -1) return hostname.substr(hostname.lastIndexOf('.', l - 1) + 1);
    return hostname;
}

var domain = getDomain(location.hostname);

if (domain) document.domain = domain;

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$.ajaxSetup({
    'isLocal': !!domain
});

$.getCSS = function (url, callback) {
    $.get(url, function () {
        $('<link>', { rel: 'stylesheet', type: 'text/css', 'href': url }).appendTo('head');
        if (callback) callback();
    });
};

function imgOk(img, callback) {
    var $img = void 0;
    if (img instanceof jQuery) {
        $img = img;
        img = $img[0];
    } else {
        $img = $(img);
    }

    $img.on('load error', callback);

    if (!img.complete) {
        return !1;
    }

    if (typeof img.naturalWidth !== "undefined" && img.naturalWidth === 0) {
        return !1;
    }

    $img.trigger('load');
    return !0;
}

var cssCheck = {};

cssCheck.calc = function () {
    if (typeof cssCheck._calc != 'undefined') return cssCheck._calc;

    function check(prefix) {
        prefix = prefix || '';
        var el = document.createElement('div');
        el.style.cssText = prefix + 'width: calc(1px);';
        return !!el.style.length;
    }

    cssCheck._calc = check('-webkit-') || check('-moz-') || check();

    return cssCheck._calc;
};

cssCheck.value = function (value) {
    var d = document.createElement('div');
    d.style.width = value;
    return d.style.width === value;
};

function dateParserISO8601(str) {
    var timestamp = Date.parse(str);

    if (!timestamp || isNaN(timestamp)) {
        var numericKeys = [1, 4, 5, 6, 7, 10, 11],
            struct = void 0,
            minutesOffset = 0;

        if (struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(str)) {
            for (var i = 0, k; k = numericKeys[i]; ++i) {
                struct[k] = +struct[k] || 0;
            }

            struct[2] = (+struct[2] || 1) - 1;
            struct[3] = +struct[3] || 1;

            if (struct[8] !== 'Z' && struct[9] !== undefined) {
                minutesOffset = struct[10] * 60 + struct[11];

                if (struct[9] === '+') {
                    minutesOffset = 0 - minutesOffset;
                }
            }

            timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
        } else {
            timestamp = NaN;
        }
    }

    return timestamp;
}

dateFormat.i18n = {
    dayNames: ["日", "一", "二", "三", "四", "五", "六", "周日", "周一", "周二", "周三", "周四", "周五", "周六"],
    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月", "一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
};

var Autocomplete = function () {
    function Autocomplete(el, callbacks) {
        var _this2 = this;

        _classCallCheck(this, Autocomplete);

        var $el = void 0;
        if (el instanceof jQuery) {
            $el = el;
            el = $el[0];
        } else {
            $el = $(el);
        }

        this.el = el;
        this.$ = $el;

        if ($el.data('Autocomplete')) return $el.data('Autocomplete');

        this.type = el.getAttribute('prpr-autocomplete') || 'item';
        if (this.type === 'true' || this.type === !0 || this.type === 'prpr-autocomplete') this.type = 'item';

        this.callbacks = callbacks || {};
        this.cb = {
            'queryBeforeSend': function queryBeforeSend() {
                if (_this2.callbacks.queryBeforeSend) _this2.callbacks.queryBeforeSend();
            },

            'querySuccess': function querySuccess(data, textStatus, jqXHR) {
                if (_this2.callbacks.querySuccess) _this2.callbacks.querySuccess(data, textStatus, jqXHR);
            },

            'queryError': function queryError(jqXHR, textStatus, errorThrown) {
                if (_this2.callbacks.queryError) _this2.callbacks.queryError(jqXHR, textStatus, errorThrown);
            },

            'queryComplete': function queryComplete(jqXHR, textStatus) {
                if (_this2.callbacks.queryComplete) _this2.callbacks.queryComplete(jqXHR, textStatus);

                _this2.querying = !1;
                _this2.query();
            },

            'resultSelect': function resultSelect(evt) {
                if (_this2.callbacks.resultSelect) _this2.callbacks.resultSelect(evt);

                _this2.resultHide(!0);
            },

            'resultFilter': function resultFilter(o) {
                if (_this2.callbacks.resultFilter) return _this2.callbacks.resultFilter(o);
                return !0;
            }
        };

        $el.on({
            'input': function input() {
                _this2.onInput();
            },
            'focus': function focus() {
                _this2.onFocus();
            },
            'blur': function blur() {
                _this2.onBlur();
            }
        }).data('Autocomplete', this);

        return this;
    }

    _createClass(Autocomplete, [{
        key: 'onInput',
        value: function onInput() {
            var _this3 = this;

            clearTimeout(this.resultFrameHiding);
            setTimeout(function () {
                _this3.query();
            }, 100);
        }
    }, {
        key: 'onFocus',
        value: function onFocus() {
            clearTimeout(this.resultFrameHiding);
            if (this.cur) {
                this.resultShow();
                if (!this.querying) {
                    this.resultUpdate(Autocomplete.cache[this.type + '::' + this.cur]);
                }
            }
        }
    }, {
        key: 'onBlur',
        value: function onBlur() {
            this.resultHide();
        }
    }, {
        key: 'query',
        value: function query(content) {
            var _this4 = this;

            content = content || this.$.val();
            if (!content || content == this.cur) return;

            if (this.querying) return this.cur;

            this.cur = content;
            this.querying = !0;

            if (Autocomplete.cache[this.type + '::' + content]) {
                if (this.cb.querySuccess) this.cb.querySuccess();
                if (this.cb.queryComplete) this.cb.queryComplete();
                return this.resultUpdate(Autocomplete.cache[this.type + '::' + content]);
            } else {
                this.resultUpdate('querying');

                $.ajax({
                    'beforeSend': this.cb.queryBeforeSend,

                    'url': this.el.getAttribute('prpr-autocomplete-api') || API.autocomplete[this.type],
                    'method': 'GET',
                    'data': {
                        'word': content
                    },
                    'dataType': 'json',

                    'success': function success(data, textStatus, jqXHR) {
                        Autocomplete.cache[_this4.type + '::' + content] = data.data || [];
                        if (_this4.cb.querySuccess) _this4.cb.querySuccess(data, textStatus, jqXHR);
                        return _this4.resultUpdate(data.data || []);
                    },

                    'error': this.cb.queryError,
                    'complete': this.cb.queryComplete
                });
            }
        }
    }, {
        key: 'resultUpdate',
        value: function resultUpdate(results) {
            var _this5 = this;

            this.resultShow();
            this.resultFrame.empty();

            if (results == 'querying') return this.resultFrame.html('<div class="menuitem">查询中……</div>');else if ((typeof results === 'undefined' ? 'undefined' : _typeof(results)) == 'object') {
                if (!results.length) return this.resultFrame.html('<div class="menuitem">暂无结果……</div>');else {
                    results = results.filter(this.cb.resultFilter);
                    if (results.length) {
                        results.forEach(function (o) {
                            $('<a href="' + Autocomplete.result.url(_this5.type, o.tag_id) + '" class="menuitem" item-id="' + o.tag_id + '">' + o.name + '</a>').appendTo(_this5.resultFrame);
                        });
                    } else {
                        this.resultFrame.html('<div class="menuitem">暂无更多结果……</div>');
                    }
                    return this.resultFrame;
                }
            }
        }
    }, {
        key: 'resultCreate',
        value: function resultCreate() {
            var _this6 = this;

            if (this.resultFrame) return this.resultFrame;

            this.resultFrame = Autocomplete.frameCreate('mod-' + this.type);
            this.resultFrame.on('click.resultSelect', '[item-id]', this.cb.resultSelect).on({
                'mousedown': function mousedown() {
                    clearTimeout(_this6.resultFrameHiding);
                    setTimeout(function () {
                        clearTimeout(_this6.resultFrameHiding);
                    }, 10);
                }
            });

            return this.resultFrame;
        }
    }, {
        key: 'resultShow',
        value: function resultShow() {
            if (this.resultShowing) return this.resultFrame;

            var offset = this.$.offset() || { left: 0, top: 0 };

            this.resultCreate().css({
                'width': this.$.outerWidth(),
                'left': offset.left,
                'top': offset.top + this.$.outerHeight()
            }).addClass('on');
            this.resultShowing = !0;

            return this.resultFrame;
        }
    }, {
        key: 'resultHide',
        value: function resultHide(forceHide) {
            var _this7 = this;

            if (!this.resultShowing) return !1;

            clearTimeout(this.resultFrameHiding);

            this.resultFrameHiding = setTimeout(function () {
                _this7.resultFrame.css({
                    'width': '',
                    'top': '',
                    'left': ''
                }).removeClass('on');
                _this7.resultShowing = !1;

                return !0;
            }, forceHide ? 0 : 50);
        }
    }]);

    return Autocomplete;
}();

Autocomplete.cache = {};

Autocomplete.frameCreate = function (className) {
    if (!Autocomplete.frameContainer) Autocomplete.frameContainer = $('<div id="autocomplete"/>').appendTo($body);

    return $('<div/>', {
        'class': 'result ' + (className || '')
    }).appendTo(Autocomplete.frameContainer);
};

Autocomplete.result = {
    'url': function url(t, id) {
        switch (t) {
            case 'tag':
                return '/tag/' + id;break;
        }
    }
};

var Autoload = function () {
    function Autoload(el, type, callbacks) {
        var _this8 = this;

        _classCallCheck(this, Autoload);

        Autoload.index++;

        var $el = void 0;
        if (el instanceof jQuery) {
            $el = el;
            el = $el[0];
        } else {
            $el = $(el);
        }

        this.el = el;
        this.$ = $el;
        this.index = Autoload.index;

        this.ids = [];
        this.page = 1;
        this.moreOffset = {
            top: 0, left: 0
        };

        this.template = this.$.find('template');

        if (!this.template || !this.template.length) return this;

        if (type) {
            this.type = type;
        } else {
            if (this.$.hasClass('list-thread')) {
                this.type = 'thread';
            } else {
                this.type = 'tweet';
            }
        }
        this.idAttr = Autoload.idAttr[this.type];

        if (this.idAttr) {
            this.$.children('dl[' + this.idAttr + ']').each(function (index, el) {
                _this8.ids.unshift(el.getAttribute(_this8.idAttr));
            });

            this.updatelastItem();

            if (!this.lastItemId) return el;
        } else {
            this.updatelastItem(this.$.children('dl:last-of-type'));
        }

        this.callbacks = callbacks || {};
        this.cb = {
            'queryBeforeSend': function queryBeforeSend() {
                _this8.querying = !0;
                if (_this8.callbacks.queryBeforeSend) _this8.callbacks.queryBeforeSend();
            },

            'querySuccess': function querySuccess(data, textStatus, jqXHR) {
                var dataList = data.data || data || {};
                dataList = dataList.list || dataList.threads || dataList.datas || [];
                dataList = dataList.filter(function (d) {
                    var id = d.id || d.tid || d.image || 0;

                    if (id && _this8.ids.indexOf(id) > -1) {
                        return !1;
                    }

                    _this8.ids.unshift(id);

                    _this8.appendItem(d);

                    return !0;
                });

                if (_this8.type == 'thread' || _this8.type == 'pics') _this8.page++;

                if (_this8.callbacks.querySuccess) _this8.callbacks.querySuccess(data, textStatus, jqXHR);

                _this8.btnMoreLoadComplete(!dataList.length);

                $window.trigger('resized');
            },

            'queryError': function queryError(jqXHR, textStatus, errorThrown) {
                if (_this8.callbacks.queryError) _this8.callbacks.queryError(jqXHR, textStatus, errorThrown);
            },

            'queryComplete': function queryComplete(jqXHR, textStatus) {
                if (_this8.callbacks.queryComplete) _this8.callbacks.queryComplete(jqXHR, textStatus);
                _this8.querying = !1;
            },

            'resultFilter': function resultFilter(o) {
                if (_this8.callbacks.resultFilter) return _this8.callbacks.resultFilter(o);
                return !0;
            }

        };

        this.containerMore = $('<div class="list-tweet-more"/>').append(this.btnMore = $('<button/>', {
            'type': 'button',
            'class': 'button button-large',
            'html': '加载更多...'
        }).on('click', function () {
            _this8.load();
        })).insertAfter(this.lastItem);
        this.$.addClass('list-tweet-has-more');

        this.getMoreOffset();

        $document.on('scrolled.componentListTweet-' + Autoload.index, function () {
            _this8.scrollHandler();
        });
        $window.on('resized.componentListTweet-' + Autoload.index, function () {
            _this8.resizeHandler();
        });

        return this;
    }

    _createClass(Autoload, [{
        key: 'updatelastItem',
        value: function updatelastItem(item) {
            if (item) {
                this.lastItem = item;
                this.lastItemId = item.attr(this.idAttr || '');
            } else {
                this.lastItem = this.$.find('[' + this.idAttr + ']:last-of-type');
                this.lastItemId = this.lastItem.attr(this.idAttr);
            }
        }
    }, {
        key: 'getMoreOffset',
        value: function getMoreOffset() {
            if (!this.containerMore || !this.containerMore.length) this.moreOffset = { top: 0, left: 0 };else {
                var offset = this.containerMore.offset();
                this.moreOffset = {
                    top: offset.top - stickyTop,
                    left: offset.left
                };
            }
            return this.moreOffset;
        }
    }, {
        key: 'load',
        value: function load() {
            if (this.querying || this.complete) return this.btnMore;

            console.log('[PrPr-Autoload] 自动加载更多内容 - 开始');

            var api = typeof API[this.type] == 'string' ? API[this.type] : API[this.type].load,
                data = {};

            switch (this.type) {
                case 'tweet':
                    data = {
                        'type': itemType,
                        'prpr_id': itemId,
                        'tw_id': this.lastItemId,
                        'limit': 20
                    };
                    break;
                case 'thread':
                    data = {
                        'circle_id': circleId,
                        'p': this.page + 1
                    };
                    break;
                case 'pics':
                    data = {
                        'data_id': itemId,
                        'pageNum': this.page + 1,
                        'pageSize': 10
                    };
                    break;
            }

            $.ajax({
                'beforeSend': this.cb.queryBeforeSend,

                'url': api,
                'method': 'GET',
                'data': data,
                'dataType': 'json',

                'success': this.cb.querySuccess,
                'error': this.cb.queryError,
                'complete': this.cb.queryComplete
            });
        }
    }, {
        key: 'btnMoreLoadStart',
        value: function btnMoreLoadStart() {
            if (this.querying) return this.btnMore;

            this.btnMore.attr('disabled', 'disabled').addClass('state-loading').html('加载中...');

            return this.btnMore;
        }
    }, {
        key: 'btnMoreLoadComplete',
        value: function btnMoreLoadComplete(isNoMore) {
            this.btnMore.removeClass('state-loading');
            console.log('[PrPr-Autoload] 自动加载更多内容 - 结束');

            if (isNoMore) {
                this.btnMore.html('已无更多内容').attr('disabled', 'disabled');
                $document.off('scrolled.componentListTweet-' + this.index);
                $window.off('resized.componentListTweet-' + this.index);
                this.complete = !0;
            } else {
                this.btnMore.html('加载更多...').removeAttr('disabled');
                this.scrollHandler();
            }

            this.getMoreOffset();
            this.querying = !1;

            return this.btnMore;
        }
    }, {
        key: 'scrollHandler',
        value: function scrollHandler() {
            if (documentScrollTop + viewHeight >= this.moreOffset.top - 100) this.load();
        }
    }, {
        key: 'resizeHandler',
        value: function resizeHandler() {
            this.getMoreOffset();
        }
    }, {
        key: 'appendItem',
        value: function appendItem(data) {
            if (!this.templateHTML) this.templateHTML = this.template.html();

            var html = Autoload.templateFilter[this.type](this.templateHTML, data);

            function _replace(search, replaced) {
                var reg = new RegExp('{' + search + '}', 'gm');

                html = html.replace(reg, replaced);
                return html;
            }

            for (var i in data) {
                if (_typeof(data[i]) == 'object') {
                    for (var j in data[i]) {
                        _replace(i + '_' + j, data[i][j]);
                    }
                } else {
                        _replace(i, data[i]);
                    }
            }

            var searchRes = void 0,
                scrapePtrn = /\{([^\{\}]+)_format_([^\{\}]+)\}/gm;
            while ((searchRes = scrapePtrn.exec(html)) !== null) {
                try {
                    if (searchRes && searchRes.length > 2) {
                        var time = new Date(parseInt(data[searchRes[1]]) * 1000),
                            formats = {
                            '1': 'yyyy年m月d日 HH:MM',
                            '2': "yyyy-mm-dd'T'HH:MM:sso"
                        };
                        html = html.replace(searchRes[0], time.format(formats[searchRes[2]]));
                    }
                } catch (e) {}
            }

            var $item = $(html).insertAfter(this.lastItem);
            Component.initAll($item);

            this.updatelastItem($item);

            return $item;
        }
    }]);

    return Autoload;
}();

Autoload.idAttr = {
    'tweet': 'data-tweetid',
    'thread': 'data-tid'
};

Autoload.index = 0;

Autoload.templateFilter = {};
Autoload.templateFilter.tweet = function (html, data) {
    if (data.type != 4) {
        html = html.replace(/\<div class=\"retweet\"\>([\s\S]+?)\<\/div\>/gm, '');
    }

    if (!data.quote || !parseInt(data.is_quote_status)) {
        html = html.replace(/\<div class=\"quote\"\>([\s\S]+?)\<\/div\>/gm, '');
    }

    if (!data.rename_img) {
        html = html.replace(/\<p class=\"media\"\>([\s\S]+?)\<\/p\>/gm, '');
    }

    return html;
};
Autoload.templateFilter.thread = function (html, data) {
    return html;
};
Autoload.templateFilter.pics = function (html, data) {
    return html;
};

var LOD = function () {
    function LOD(settings) {
        _classCallCheck(this, LOD);

        if (!settings.name) return;

        this._ = $.extend({}, LOD.defaults, settings);

        if (!LOD.ready[this._.name]) {
            LOD.ready[this._.name] = {};
            for (var i in this._.resources) {
                LOD.ready[this._.name][i] = !1;
            }
        }

        this.readyState = LOD.ready[this._.name];
        this.readyCheck();

        return this;
    }

    _createClass(LOD, [{
        key: 'ready',
        value: function ready() {
            this._.ready();
        }
    }, {
        key: 'readyCheck',
        value: function readyCheck() {
            var r = !0;

            for (var name in this.readyState) {
                if (this.readyState[name] !== !0) r = !1;
            }

            if (!r) return !1;

            return this.ready();
        }
    }, {
        key: 'load',
        value: function load(name, callback) {
            var _this9 = this;

            if (!name || typeof this.readyState[name] == 'undefined') return !1;

            var cb = function cb() {
                if (callback) callback();
                _this9.readyState[name] = !0;
                _this9.readyCheck(name);
            };

            if (this.readyState[name] === !0) return cb();

            this.readyState[name] = 'loading';

            var type = this._.resources[name][0],
                url = this._.resources[name][1];

            if (type == 'css') $.getCSS(url, cb);else $.getScript(url, cb);
        }
    }]);

    return LOD;
}();

LOD.defaults = {
    resources: {},

    ready: function ready() {}
};

LOD.ready = {};
$document.ready(function () {
    console.log('[TRIGGER] $document - ready');

    $html = $('html');
    $head = $('head');
    $body = $('body');
    $window = $(window);
    $layout = $('#layout');
    $nav = $('#nav');
    $header = $('#header');
    $headerNav = $header.find('.header-nav');
    $main = $('#main');
    $footer = $('#footer');

    documentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    documentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;

    viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    var windowResizeDebouncingTimeout = void 0;
    $window.on({
        'resize.resizeDebouncing': function resizeResizeDebouncing() {
            viewWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
            viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
            clearTimeout(windowResizeDebouncingTimeout);
            windowResizeDebouncingTimeout = setTimeout(function () {
                $window.trigger('resized');
            }, 100);
        }
    });

    var isScrolling = !1;
    function scrollHandlerNew() {
        documentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        documentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
        if (!isScrolling) {
            requestAnimationFrame(scrollY);
        }
        isScrolling = !0;
    }
    function scrollY() {
        $document.trigger('scrolled');
        isScrolling = !1;
    }
    if (window.requestAnimationFrame) {
        $document.on({
            'scroll.scrollDebouncing': scrollHandlerNew
        });
    } else {
        (function () {
            var windowScrollDevouncingTimeout = void 0;
            $document.on({
                'scroll.scrollDebouncing': function scrollScrollDebouncing() {
                    clearTimeout(windowScrollDevouncingTimeout);
                    windowScrollDevouncingTimeout = setTimeout(function () {
                        documentScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                        documentScrollLeft = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0;
                        $document.trigger('scrolled');
                    }, 100);
                }
            });
        })();
    }

    var windowResizeAutoTriggerScrolledDebouncing = void 0,
        now = new Date().valueOf();
    $window.on({
        'resized.autoTriggerScrolled': function resizedAutoTriggerScrolled() {
            console.log('[TRIGGER] $window - resized');
            clearTimeout(windowResizeAutoTriggerScrolledDebouncing);
            windowResizeAutoTriggerScrolledDebouncing = setTimeout(function () {
                $document.trigger('scrolled');
            }, 100);
        },
        'load.autoTriggerResized': function loadAutoTriggerResized() {
            console.log('[TRIGGER] $window - load');
            setTimeout(function () {
                $window.trigger('resized');
            }, 100);
        }
    });
    $document.on({
        'scrolled': function scrolled(evt, scrollTop, scrollLeft) {
            if (typeof scrollTop != 'undefined') documentScrollTop = scrollTop;
            if (typeof scrollLeft != 'undefined') documentScrollLeft = scrollLeft;
        }
    });

    $window.trigger('resized');

    $head.find('meta').each(function (index, el) {
        var name = el.getAttribute('name');
        if (flagMap[name]) window[flagMap[name]] = el.getAttribute('content');
    });
    if (itemType && itemId) isItemPage = !0;
    if (circleId) isCirclePage = !0;
    if (tid) isThreadPage = !0;

    if (isIframe) {
        $body.addClass('mod-iframe');

        if (top.location.href != location.href) top.history.replaceState({
            'type': 'iframe',
            'url': location.href
        }, document.title, location.href);
    }

    $window.on('popstate', function (evt) {
        var state = evt.originalEvent.state || {};


        if (!state.type) {
            if (modal.showing) {
                modal.hide();
            } else location.reload();
            return;
        }

        if (state.type == 'iframe') {
            modal.show(state.url, !0);
            return;
        }
    });

    Layout.initAll();
    Component.initAll($layout);
});

var Layout = function Layout(functionInit) {
    var _this10 = this;

    _classCallCheck(this, Layout);

    Layout.items.push(this);
    functionInit = functionInit || function () {};
    this.init = function () {
        if (_this10.inited) return _this10;

        functionInit(_this10);
        _this10.inited = !0;
    };
};

Layout.items = [];

Layout.initAll = function () {
    Layout.items.forEach(function (item) {
        if (item.init) item.init();
    });
};

var overlay = {
    'on': function on() {
        var scrollbar = window.innerWidth - document.documentElement.clientWidth;
        $body.addClass('mod-overlay-on' + (scrollbar ? ' mod-overlay-on-scrollbar' : '')).css('margin-right', scrollbar);
    },
    'off': function off() {
        $body.removeClass('mod-overlay-on mod-overlay-on-scrollbar').css('margin-right', '');
    }
};

var Component = function Component(selector, attrInit, functionInit) {
    _classCallCheck(this, Component);

    Component.items.push(this);
    functionInit = functionInit || function () {};
    this.init = function ($container) {
        $container.find(selector).each(function (index, el) {
            if (!el.getAttribute(attrInit)) {
                functionInit(el);
                el.setAttribute(attrInit, !0);
            }
        });
    };
};

Component.items = [];

Component.initAll = function ($container) {
    Component.items.forEach(function (item) {
        if (item.init) item.init($container);
    });

    var $imgs = $container.find('img');
    objectFitImages($imgs);
    $imgs.filter('.lazy').lazyload({
        'event': 'scrolled'
    });
};
var componentForm = new Component('form', 'form-init', function (el) {
    var $el = $(el);

    for (var i in componentForm.types) {
        componentForm.types[i](el, $el);
    }
});

componentForm.types = {};

componentForm.types.autocompleteTag = function (el, $el) {
    $el.find('[prpr-autocomplete="tag"]').each(function (index, input) {
        input = $(input);
        var autocomplete = input.data('Autocomplete'),
            taglist = $el.parent(),
            taglistInput = $el.find('[name="tags"]'),
            taglistArray = [];

        if (!autocomplete) autocomplete = new Autocomplete(input);

        $el.on('click.deleteTag', '.tag.is-editable s', deleteTag);

        taglist.find('.tag[tag-id]').each(function (index, el) {
            taglistArray.push(parseInt(el.getAttribute('tag-id')));
        });
        updateTaglist();

        autocomplete.callbacks.resultFilter = function (o) {
            return !(taglistArray.indexOf(o.tag_id) > -1);
        };

        autocomplete.callbacks.resultSelect = function (evt) {
            var id = parseInt(evt.currentTarget.getAttribute('item-id'));

            evt.preventDefault();

            if (taglistArray.indexOf(id) > -1) return;

            $('<span/>', {
                'class': 'tag is-editable',
                'html': evt.currentTarget.innerHTML,
                'tag-id': id
            }).append($('<s>×</s>')).insertBefore(input);

            taglistArray.push(id);

            updateTaglist();

            input.val('').focus();
            autocomplete.cur = null;
        };

        function updateTaglist() {
            var v = taglistArray.join(',');
            taglistInput.val(v);

            return v;
        }

        function deleteTag(evt) {
            var el = evt.currentTarget.parentNode,
                id = parseInt(el.getAttribute('tag-id')),
                index = taglistArray.indexOf(id);

            taglistArray.splice(index, 1);
            el.parentNode.removeChild(el);
            updateTaglist();
        }
    });
};

componentForm.types.uploader = function (el, $el) {
    if ($el.hasClass('form--uploader')) {
        new Uploader(el);
    }
};

new Layout(function () {
    $body.on('click.formCancel', 'form [button="cancel"]', function (evt) {
        var el = evt.currentTarget;
        if (!(el.tagName == 'A' && el.getAttribute('href') && el.getAttribute('href') != '#' && el.getAttribute('href').substr(0, 10) != 'javascript')) {
            history.back();
            evt.preventDefault();
        }
    });

    $body.on('input.checkHasValue change.checkHasValue', 'input, textarea', function (evt) {
        var el = evt.currentTarget;
        if (el.value) el.setAttribute('hasvalue', !0);else el.setAttribute('hasvalue', !1);
    });

    $body.on('focus', '.form-full .form-item', function (evt) {
        var input = evt.target;
        if (!input.disabled && !input.readOnly) evt.currentTarget.setAttribute('is-focus', !0);
    }).on('blur', '.form-full .form-item', function (evt) {
        evt.currentTarget.removeAttribute('is-focus');
    });
});

var Uploader = function () {
    function Uploader(form) {
        var _this11 = this;

        _classCallCheck(this, Uploader);

        var $el = void 0;
        if (form instanceof jQuery) {
            $el = el;
            form = $el[0];
        } else {
            $el = $(form);
        }

        this.el = form;
        this.$ = $el;

        this.type = this.el.getAttribute('type');
        if (!this.type) {
            var QueryString = function () {
                var query_string = {};
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i = 0; i < vars.length; i++) {
                    var pair = vars[i].split("=");

                    if (typeof query_string[pair[0]] === "undefined") {
                        query_string[pair[0]] = decodeURIComponent(pair[1]);
                    } else if (typeof query_string[pair[0]] === "string") {
                            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                            query_string[pair[0]] = arr;
                        } else {
                                query_string[pair[0]].push(decodeURIComponent(pair[1]));
                            }
                }
                return query_string;
            }();
            this.type = QueryString.type || QueryString.uploader || 'circle_thread';
        }

        this.loader = $('<div class="form-loading"><span class="loader-circle"></span></div>').appendTo(this.$);

        this.lod = new LOD({
            name: 'uploader',
            resources: {
                'cssBasic': ['css', API.dropzone + Uploader.files['cssBasic']],
                'cssFull': ['css', API.dropzone + Uploader.files['cssFull']],
                'cssSite': ['css', API.common.css + '/lod-uploader.css'],
                'js': ['js', API.dropzone + Uploader.files['js']],
                'modules': ['js', API.dropzone + Uploader.files['modules']]
            },
            ready: function ready() {
                _this11.ready();
            }
        });

        this.lod.load('cssBasic', function () {
            _this11.lod.load('cssFull');
            _this11.lod.load('cssSite');
            _this11.lod.load('js', function () {
                _this11.lod.load('modules');
            });
        });
    }

    _createClass(Uploader, [{
        key: 'ready',
        value: function ready() {
            $('<input type="file" name="file" />').appendTo(this.$.addClass('dropzone'));
            this.loader.remove();
            this.$.dropzone({
                url: API.upload + '&type=' + this.type
            });
        }
    }]);

    return Uploader;
}();

Uploader.files = {
    'cssBasic': '/basic.min.css',
    'cssFull': '/dropzone.min.css',
    'js': '/dropzone.min.js',
    'modules': '/dropzone-amd-module.min.js'
};


new Layout(function () {

    $body.on('click.externalLinks pointerdown.externalLinks', 'a', function (evt) {
        if (!evt.currentTarget.getAttribute('target')) {
            var href = evt.currentTarget.getAttribute('href');
            if (location.host) {
                if (['/', '#', '?'].indexOf(href.substr(0, 1)) >= 0) {
                    return evt.currentTarget.setAttribute('target', '_self');
                } else if (href.indexOf('//') > -1 && href.indexOf('//' + domain) < 0) {
                        return evt.currentTarget.setAttribute('target', '_blank');
                    }
            } else {
                if (href.indexOf('://') > -1) {
                    return evt.currentTarget.setAttribute('target', '_blank');
                }
            }
        }
    }).on('click.disableLink', 'a select', function (evt) {
        evt.preventDefault();
        return !1;
    });
});

function getTheme(el, getFullName) {
    if (!el || typeof el == 'string' || typeof el == 'number' || typeof el == 'boolean') return getTheme($body, el);

    if (el instanceof jQuery) el = el[0];

    var theme = /theme\-([^ ]+)/g.exec(el.className);

    if (theme && theme.length >= 2) {
        theme = theme[1];
        theme = (getFullName ? 'theme-' : '') + theme;
    } else {
        theme = '';
    }

    return theme.trim();
}

function changeTheme(el, theme) {
    if (!el || typeof el == 'string' || typeof el == 'number') return changeTheme($body, el);

    if (el instanceof jQuery) el = el[0];

    var oldTheme = getTheme(el, !0),
        newTheme = theme ? 'theme-' + theme : '';

    if (oldTheme) return el.className = el.className.replace(getTheme(el, !0), newTheme);

    return el.className += ' ' + newTheme;
}


var layoutHeader = new Layout(function (self) {
    self.getHeaderNavOffsetTop = function () {
        $layout.removeClass('mod-header-sticky');
        navHeight = $nav.css('position') == 'fixed' ? $nav.height() : 0;
        var headerNavHeight = $headerNav.height();
        self.headerHeight = $header.outerHeight(!0);
        self.headerNavOffsetTop = self.headerHeight - headerNavHeight - navHeight;
        stickyTop = headerNavHeight + navHeight + 30;

        return self.headerNavOffsetTop;
    };

    self.getHeaderNavOffsetTop();


    function headerSticky() {
        if (!navHeight) return;

        if (!isIframe) {
            if (documentScrollTop >= navHeight * 2 / 3) {
                $nav.addClass('mod-solid');
            } else {
                $nav.removeClass('mod-solid');
            }
        }

        if (!self.headerNavOffsetTop) return;

        if (!isIframe) {
            if (documentScrollTop >= self.headerNavOffsetTop && !$layout.hasClass('mod-header-sticky')) {
                $layout.addClass('mod-header-sticky');
            } else if (documentScrollTop < self.headerNavOffsetTop && $layout.hasClass('mod-header-sticky')) {
                $layout.removeClass('mod-header-sticky');
            }
        } else {
            if (documentScrollTop >= self.headerNavOffsetTop) {
                $layout.addClass('mod-header-sticky');
                $headerNav.css('transform', 'translateY(' + documentScrollTop + 'px)');
            } else {
                $layout.removeClass('mod-header-sticky');
                $headerNav.css('transform', '');
            }
        }
    }

    var banner = $header.find('.header-banner-img'),
        img = void 0;
    function headerBannerParallax() {
        if (!banner.length || documentScrollTop > self.headerHeight) return;
        banner.css('transform', 'translate3d(0, ' + Math.max(0, documentScrollTop) / 3 + 'px, 0)');
    }

    if (banner.length && cssCheck.value('1vw')) {
        img = $('<img src="' + banner.css('background-image').slice(4, -1).replace(/["|']/g, "") + '"/>').appendTo(banner);
        imgOk(img, function (evt) {
            $('<span/>').css('background-image', 'url(' + img.attr('src') + ')').appendTo(banner);
            banner.addClass('is-loaded').css('background-image', '');
        });
    }

    function headerScrollHandler() {
        headerSticky();
        headerBannerParallax();
    }
    function headerResizeHandler() {
        self.getHeaderNavOffsetTop();
        headerSticky();
    }
    $document.on({
        'scrolled.headerSticky': headerScrollHandler
    });
    $window.on({
        'resized.recalculateHeaderSticky': headerResizeHandler
    });

    $header.on('click.headerButton', '.header-subcribe', function (evt) {
        var action = evt.currentTarget.getAttribute('button');
        if (isItemPage) {} else if (isCirclePage) {
            switch (action) {
                case 'subcribe':
                case 'unsubcribe':
                    $.ajax({
                        'beforeSend': function beforeSend() {
                            evt.currentTarget.setAttribute('disabled', 'progress');
                            evt.currentTarget.removeAttribute('is-hover');
                        },

                        'url': API.circle[action],
                        'method': 'GET',
                        'data': {
                            'circle_id': circleId,
                            'uid': uid
                        },
                        'dataType': 'json',

                        'success': function success(data, textStatus, jqXHR) {
                            evt.currentTarget.setAttribute('button', action == 'subcribe' ? 'unsubcribe' : 'subcribe');
                            evt.currentTarget.innerHTML = action == 'subcribe' ? '已订阅' : '订阅';
                        },

                        'error': function error(jqXHR, textStatus, errorThrown) {},

                        'complete': function complete(jqXHR, textStatus) {
                            evt.currentTarget.removeAttribute('disabled');
                        }
                    });
                    break;
            }
        } else if (isThreadPage) {}
    });
    $header.on('mouseenter.headerButtonUnsubcribe', '.header-subcribe[button="unsubcribe"]', function (evt) {
        evt.currentTarget.innerHTML = '取消订阅';
        evt.currentTarget.setAttribute('is-hover', !0);
    });
    $header.on('mouseout.headerButtonUnsubcribe', '.header-subcribe[button="unsubcribe"]', function (evt) {
        evt.currentTarget.innerHTML = '已订阅';
        evt.currentTarget.removeAttribute('is-hover');
    });

    $body.on('actionSuccess', '[action="user-logout"]', function (evt, data, textStatus, jqXHR) {
        if (!data.errno) {
            location.reload();
        } else {
            alert('发生错误 [' + data.errno + '] ' + data.msg);
        }
    });
});

new Layout(function (self) {
    function backToTop(evt) {
        if (evt.currentTarget == evt.target) {
            $body.animate({
                scrollTop: 0
            }, 200);
        }
    }
    $nav.on('click.backToTop', backToTop);
});

new Layout(function () {
    $body.on('click.action', '.action', function (evt) {

        evt.preventDefault();

        if (evt.currentTarget.getAttribute('disabled')) {
            return !1;
        }

        var el = evt.currentTarget,
            $el = $(el),
            type = void 0,
            count = void 0,
            countReg = new RegExp('\(([0-9]+)\)', 'g');

        if (el.getAttribute('disabled')) return el;

        if ($el.hasClass('action-plus')) {
            type = 'plus';
            if ($el.hasClass('action-plus-on')) {
                type = 'plus-minus';
            }
            count = countReg.exec(el.innerHTML);
            if (count && count.length > 1) count = parseInt(count[1]);else count = null;
        }

        if ($el.hasClass('action-confirm')) {
            type = 'confirm';
        }

        if (type == 'confirm') {
            if (!window.confirm('确认' + el.innerHTML + '操作？')) {
                $el.trigger('actionCancel');
                return el;
            }
        }

        if (type) {

            $.ajax({
                'beforeSend': function beforeSend() {
                    el.setAttribute('disabled', 'progress');
                },

                'url': el.getAttribute('href'),
                'method': 'GET',

                'success': function success(data, textStatus, jqXHR) {
                    if (type == 'plus') {
                        $el.addClass('action-plus-on');
                        if (typeof count == 'number') el.innerHTML = el.innerHTML.replace(countReg, count + 1);
                    } else if (type == 'plus-minus') {
                        $el.removeClass('action-plus-on');
                        if (typeof count == 'number') el.innerHTML = el.innerHTML.replace(countReg, count - 1);
                    }
                    $el.trigger('actionSuccess', [data, textStatus, jqXHR]);
                },

                'error': function error(jqXHR, textStatus, errorThrown) {
                    $el.trigger('actionError', [jqXHR, textStatus, errorThrown]);
                    alert(el.innerHTML + '操作发生错误 [' + textStatus + '] ' + errorThrown);
                },

                'complete': function complete(jqXHR, textStatus) {
                    setTimeout(function () {
                        el.removeAttribute('disabled');
                        $el.trigger('actionComplete', [jqXHR, textStatus]);
                    }, 100);
                }
            });
        }
    });
});


new Component('.row-2col', 'row-2col-init', function (el) {
    if (!cssCheck.calc()) {
        var $el = $(el),
            $colAside = $el.find('.col-aside'),
            colAsideH = $colAside.height(),
            $colMain = $el.find('.col-main');
        $el.addClass('mod-old');
        if ($colMain.height() < colAsideH) {
            $colMain.height(colAsideH);
        }
    }
});

new Component('.dropdown', 'dropdown-init', function (el) {
    var $el = $(el);

    $el.on('click.unfocusLinkNotTriggered', 'a', function (evt) {
        if (!$el.is(':focus')) {
            evt.preventDefault();
            $el.focus();
            return !1;
        }
    }).on('focus', '.dropdown-menu *', function (evt) {
        $el.focus();
    });
});


new Component('.evaluate-list', 'evaluate-list-init', function (el) {
    var $contTitleA = $(el).find('.evaluate-list-title a');
    $(el).find('.user-new').show();
    $contTitleA.hover(function (e) {
        $(this).addClass("user-on").siblings().removeClass("user-on");
        var userClass = $(this).data('cont');

        $(el).find("." + userClass).show().siblings('.evaluate-list-cont').hide();
    }, function () {});

    evaluate.init();
});

var evaluate = {
    data: {
        code: 200,
        result: {
            pageinfo: {
                total_items: 2,
                total_pages: 1,
                remain_items: 0,
                current_page: 1
            },
            datas: [{
                id: "3",
                content: "收电费收费1",
                score: "7.0",
                uid: "7",
                username: "tianruijie",
                time: "1星期前",
                face: "http://img.acgn.prpracg.com/00/00752575cc0b2e1e3e349aee7060a825.jpeg"
            }, {
                id: "1",
                content: "dgdg",
                score: "8.0",
                uid: "2",
                username: "",
                time: "-1年前"
            }]

        }
    },

    getCookie: function getCookie(cookie_name) {
        var allCookie = document.cookie;
        var cookie_pos = allCookie.indexOf(cookie_name);
        if (cookie_pos != -1) {
            cookie_pos += cookie_name.length + 1;
            var cookie_end = allCookie.indexOf(';', cookie_pos);
            if (cookie_end == -1) {
                cookie_end = allCookie.length;
            }
            var value = unescape(allCookie.substring(cookie_pos, cookie_end));
        }
    },
    sendAjax: function sendAjax() {
        var _this = this;
        var sid = _this.getCookie('session_aone');
        $.ajax({
            url: API.evaluate,
            type: "get",
            dataType: "jsonp",
            jsonp: "callback",

            success: function success(data, textStatus) {
                if (data.code == 200) {
                    _this.drawHtml(data, 0, 1);
                    _this.drawHtml(data, 2, 1);
                    _this.drawHtml(data, 3, 1);
                }
            },
            error: function error() {}
        });
    },
    drawHtml: function drawHtml(data, type, page) {
        var self = this;
        var htmlArr = [];
        var result = self.data.result.datas;
        console.log(result);
        for (var i = 0, len = result.length; i < len; i++) {
            htmlArr.push('<dl class="evaluate-list-item">');
            htmlArr.push('<dt><a href=""> <img src="' + result[i].face + '"></a></dt>');
            htmlArr.push('<dd class="evaluate-list-desc"> <h5><a href="">' + result[i].username + '</a><span>' + result[i].time + '</span></h5><p>' + result[i].content + '</p></dd>');
            htmlArr.push('<dd class="evaluate-list-num">' + result[i].score + '</dd>');
            htmlArr.push('</dt>');
        }
        var html = htmlArr.join('');
        switch (type) {
            case 2:
                $('user-praise').prepend(html);
                break;
            case 3:
                $('.user-bad').prepend(html);
                break;
            default:
                $('.user-new').prepend(html);
                break;
        }
    },
    init: function init() {
        var self = this;
        self.sendAjax();
    }
};

new Component('.gallery', 'gallery-init', function (el) {
    var $el = $(el),
        $items = $el.find('dl'),
        $template = $el.find('template'),
        imgs = [],
        options = {};

    $items.each(function (i, dl) {
        var $dl = $(dl),
            $img = $dl.find('img'),
            $link = $dl.find('a');
        imgs.push({
            'id': $dl.attr('id') || null,
            'src': $img.attr('data-src') || $img.attr('src'),
            'link': $link && $link.length ? $link.attr('href') : '',

            'width': parseInt($img.attr('data-width')),
            'height': parseInt($img.attr('data-height'))
        });
    });

    options.template = function (data) {
        return '<div class="photo-container" style="height:' + data.displayHeight + 'px;margin-right:' + data.marginRight + 'px;">' + ('<a href="' + (data.link || data.src) + '" target="_blank"' + (data.modal ? ' modal="' + data.modal + '"' : '') + '>') + ('<img class="image-thumb lazy" src="' + data.src + '" data-src="' + data.src + '" style="width:' + data.displayWidth + 'px;height:' + data.displayHeight + 'px;" >') + '</a>' + '</div>';
    };

    new Gallery(imgs, $('<div class="gallery-row"/>').appendTo($el), options);

    $items.remove();
});

var Gallery = function Gallery(data_imgs, $container, options) {
    var _this12 = this;

    _classCallCheck(this, Gallery);

    this.settings = $.extend({}, Gallery.defaults, options, !0);
    this.settings.images = data_imgs;


    $window.on('resized', function () {
        $container.justifiedImages(_this12.settings);
    });

    return $container.justifiedImages(this.settings);
};

Gallery.defaults = {

    getSize: function getSize(photo) {
        return {
            width: photo.width,
            height: photo.height
        };
    },
    thumbnailPath: function thumbnailPath(photo, width, height) {
        return photo.thumbnail || photo.src;
    },
    rowHeight: 150,
    maxRowHeight: 350,
    margin: 2
};

var componentListTweet = new Component('.list-tweet', 'list-tweet-init', function (el) {
    new Autoload(el);
});

new Layout(function () {

    $body.on('click.modal', '[modal]', function (evt) {
        var el = evt.currentTarget,
            url = el.getAttribute('modal');
        if (url == 'true' || url == !0) url = el.getAttribute('href');
        if (url) {
            modal.show(url);
            evt.preventDefault();
        }
    });
});

var modal = {

    create: function create() {
        if (this.frame) return this.frame;

        this.frame = $('<div id="modal"/>').append(this.container = $('<div class="body" frameborder="0"/>').on('click.cancelHideTimeout', function () {
            modal.cancelHiding();
        })).append(this.btnClose = $('<button type="button" class="button-close"/>').on('click.hide', function () {
            modal.hide();
        })).append(this.loader = $('<span class="loader-circle"/>')).prependTo($body.on('click.modalHideTimeout', function () {
            clearTimeout(modal.hiding);
            modal.hiding = setTimeout(function () {
                modal.hide();
            }, 10);
        })).on('scrolled', function () {
            if (modal.iWindow) {
                modal.iWindow.$document.trigger('scrolled', [modal.scrollTop - modal.marginTop * 2 + 2]);
            }
        });

        this.iframe = $('<iframe scrolling="no" seamless="seamless"/>').on({
            'load': function load() {
                modal.frame.removeClass('is-loading');
                modal.frame.scrollTop(0);
                modal.iWindow = modal.iframe[0].contentWindow;
                modal.iWindow.$window.on('resized.iframe', function () {
                    modal.iframeResize();
                });
                modal.iframeResize();
            },
            'error': function error() {
                modal.frame.removeClass('is-loading');
            }
        });

        this.isScrolling = !1;
        function scrollHandlerNew() {
            modal.scrollTop = modal.frame[0].scrollTop || 0;
            modal.scrollLeft = modal.frame[0].scrollLeft || 0;
            if (!modal.isScrolling) {
                requestAnimationFrame(scrollY);
            }
            modal.isScrolling = !0;
        }
        function scrollY() {
            modal.frame.trigger('scrolled');
            modal.isScrolling = !1;
        }
        if (window.requestAnimationFrame) {
            modal.frame.on({
                'scroll.scrollDebouncing': scrollHandlerNew
            });
        } else {
            (function () {
                var windowScrollDevouncingTimeout = void 0;
                modal.frame.on({
                    'scroll.scrollDebouncing': function scrollScrollDebouncing() {
                        clearTimeout(windowScrollDevouncingTimeout);
                        windowScrollDevouncingTimeout = setTimeout(function () {
                            modal.scrollTop = modal.frame[0].scrollTop || 0;
                            modal.scrollLeft = modal.frame[0].scrollLeft || 0;
                            modal.frame.trigger('scrolled');
                        }, 100);
                    }
                });
            })();
        }

        return this.frame;
    },

    show: function show(o, noHistory) {
        if (top != self) return top.modal.show(o);

        this.create().addClass('on');
        this.iWindow = null;

        if (typeof o == 'string') {
            if (this.iframe.attr('src') == o && this.showing == 'iframe') {
                return this.frame;
            } else {
                if (!noHistory) {
                    top.history.pushState({
                        'type': 'iframe',
                        'url': o
                    }, '', o);
                }
                console.log(o);
                this.frame.addClass('is-loading');
                return this.show(this.iframe.attr('src', o).height(''));
            }
        }

        if (this.cur) this.cur.detach();

        o.appendTo(this.container);
        this.cancelHiding();
        this.showing = !0;
        this.cur = o;

        overlay.on();

        this.frame.scrollTop(0);
        this.marginTop = parseInt(this.container.css('margin-top'));

        return this.frame;
    },

    hide: function hide() {
        if (!this.showing) return !0;

        if (location.href != pageUrl) {
            top.history.pushState({}, '', pageUrl);
        }

        this.create().removeClass('on is-loading');
        if (this.cur) this.cur.detach();
        this.showing = !1;
        this.iWindow = null;

        this.iframe.attr('src', '').height('');

        overlay.off();

        return !0;
    },

    cancelHiding: function cancelHiding() {
        setTimeout(function () {
            clearTimeout(modal.hiding);
        }, 5);
    },

    iframeResize: function iframeResize() {
        if (this.iWindow && this.iWindow.$window) {
            this.iframe.height(this.iWindow.$header[0].scrollHeight + this.iWindow.$main[0].scrollHeight || this.iWindow.$layout[0].scrollHeight || this.iWindow.document.documentElement.scrollHeight);
        }
    }

};


new Component('.self-grade', 'self-grade-init', function (el) {
    var $el = $(el);
    $el.find('.self-grade-do a').on('click', function (e) {
        $(this).addClass('on');
        $(this).siblings().removeClass('on');
    });

    $el.find('.u-form').on('submit', function (e) {
        if ($(this).find('.user-grade-submit').val() == '') {

            return !1;
        }
    });
    $el.find('.user-grade-list').on('click', 'a', function (e) {
        e.preventDefault();
        var val = $(this).data('val');
        console.log(2);
        $el.find('.user-grade-pf-ipt').val(val);
    });
});

new Component('[prpr-autocomplete]', 'prpr-autocomplete-init', function (el) {
    new Autocomplete(el);
});


new Component('[prpr-autoload]', 'prpr-autoload-init', function (el) {
    var type = el.getAttribute('prpr-autoload');

    if (type !== 'false' || !type) new Autoload(el, type === 'true' || type === 'prpr-autoload' ? null : type);
});
new Component('.relative-time[data-time]', 'relative-time-init', function (el) {
    new RelativeTime(el);
});

var RelativeTime = function () {
    function RelativeTime(el, timestamp) {
        _classCallCheck(this, RelativeTime);

        if (el instanceof jQuery) {
            el = el[0];
        }

        this.el = el;

        if (typeof timestamp == 'undefined') {
            timestamp = dateParserISO8601(el.getAttribute('data-time'));
        } else {
            timestamp = parseInt(timestamp);
        }

        if (!timestamp) return el;

        this.timestamp = timestamp;
        this.time = new Date(timestamp);

        if (this.calc() < 2 * 24 * 60 * 60 * 1000) RelativeTime.els.push(this);

        return this;
    }

    _createClass(RelativeTime, [{
        key: 'calc',
        value: function calc() {
            var now = new Date(),
                diff = now.valueOf() - this.timestamp,
                sec = diff / 1000;
            if (sec < 60 * 2) {
                this.el.innerHTML = '刚刚';
                return diff;
            }

            var min = sec / 60;

            if (min < 60) {
                this.el.innerHTML = Math.floor(min) + '分钟';
                return diff;
            }

            var hour = min / 60;
            if (hour < 24) {
                this.el.innerHTML = Math.floor(hour) + '小时';
                return diff;
            }

            var day = hour / 24;
            if (day < 1) {
                this.el.innerHTML = '昨天';
                return diff;
            }
            if (day < 3) {
                this.el.innerHTML = Math.floor(day) + '天';
                return diff;
            }

            if (now.getFullYear() == this.time.getFullYear()) this.el.innerHTML = this.time.format('m月d日');else this.el.innerHTML = this.time.format('yyyy年m月d日');
            return diff;
        }
    }]);

    return RelativeTime;
}();

RelativeTime.els = [];

setInterval(function () {
    RelativeTime.els.forEach(function (el) {
        el.calc();
    });
}, 60 * 1000);

var Slider = function () {
    function Slider(el, settings) {
        var _this13 = this;

        _classCallCheck(this, Slider);

        if (typeof Slider.index == 'undefined') {
            Slider.index = 0;
        }

        if ((typeof el === 'undefined' ? 'undefined' : _typeof(el)) == 'object' && el.el) return new Slider(el.el, el);

        delete settings.el;

        this._ = $.extend({}, Slider.defaults, settings, !0);

        this.$el = this.getEl(el);
        this.$slides = this.getEl(this._.elSlides);
        this.$controls = this.getEl(this._.elControls) || $('<div class="controls"/>').appendTo(this.$el);
        this.radios = [];
        this.switches = [];
        this.cur = 1;
        this.count = this.$slides.length;
        this.timeoutNext = this.timeoutStart();
        this.index = Slider.index;

        this.$slides.each(function (i, slide) {
            _this13.slideInit(i, slide);
        });

        this.$el.on('change.radioChange', 'input[type="radio"]', function (evt) {
            _this13.radioChange(evt);
        }).on('mousemove.radioChange', function () {
            _this13.timeoutClear();
        }).hover(function () {
            return _this13.timeoutNext = _this13.timeoutStart();
        });

        $('<button/>', {
            'type': 'button',
            'class': 'prev'
        }).on('click', function () {
            _this13.goPrev();
        }).prependTo(this.$controls);

        $('<button/>', {
            'type': 'button',
            'class': 'next'
        }).on('click', function () {
            _this13.goNext();
        }).appendTo(this.$controls);

        Slider.index++;
    }

    _createClass(Slider, [{
        key: 'getEl',
        value: function getEl(el) {
            if (el) {
                if (el instanceof jQuery) {
                    return el;
                } else if (typeof el == 'string') {
                    return this.$el.find(el);
                } else {
                    return $(el);
                }
            }
            return !1;
        }
    }, {
        key: 'slideInit',
        value: function slideInit(i, slide) {
            this.radios[i] = $('<input/>', {
                'type': 'radio',
                'name': 'page-home-section-hot-' + this.index,
                'id': 'page-home-section-hot-' + this.index + '-' + (i + 1),
                'value': i + 1
            }).prop('checked', !i).prependTo(this.$el);

            this.switches[i] = this._.createSwitch('page-home-section-hot-' + this.index + '-' + (i + 1), i + 1).appendTo(this.$controls);

            return this._.callbackSlideInit(i, slide);
        }
    }, {
        key: 'radioChange',
        value: function radioChange(evt) {
            this.cur = parseInt(evt.currentTarget.getAttribute('value'));
        }
    }, {
        key: 'goPrev',
        value: function goPrev() {
            this.go(this.cur - 1);
        }
    }, {
        key: 'goNext',
        value: function goNext() {
            this.go(this.cur + 1);
        }
    }, {
        key: 'getOrder',
        value: function getOrder(order) {
            order = parseInt(order);
            if (order < 1) order = this.count;
            if (order > this.count) order = 1;
            if (!order) return !1;
            return order;
        }
    }, {
        key: 'getOrderNext',
        value: function getOrderNext() {
            return this.getOrder(this.cur + 1);
        }
    }, {
        key: 'go',
        value: function go(order) {
            if (typeof order == 'undefined') return;

            order = this.getOrder(order);

            this.radios[order - 1].prop('checked', !0).trigger('change');

            this.timeoutStart();
        }
    }, {
        key: 'timeoutStart',
        value: function timeoutStart(time) {
            var _this14 = this;

            time = time || 5000;
            this.timeoutClear();

            this.$el.attr('pending', this.getOrderNext());
            return this.timeoutNext = setTimeout(function () {
                _this14.goNext();
            }, this._.interval);
        }
    }, {
        key: 'timeoutClear',
        value: function timeoutClear() {
            if (!this.timeoutNext) return !0;

            clearTimeout(this.timeoutNext);
            this.timeoutNext = null;
            this.$el.removeAttr('pending');
            return !0;
        }
    }]);

    return Slider;
}();

Slider.defaults = {
    'interval': 5000,

    'elSlides': '.slide',
    'elControls': null,

    'createSwitch': function createSwitch(id, order) {
        return $('<label/>', {
            'for': id,
            'data-order': order });
    },

    'callbackSlideInit': function callbackSlideInit() {}
};
new Component('.sticky', 'sticky-init', function (el) {
    var offsetTop = !1,
        $el = $(el);
    function getOffsetTop() {
        el.removeAttribute('sticky');
        offsetTop = $el.offset().top - stickyTop;

        return offsetTop;
    }

    getOffsetTop();
    scrollHandler();


    function scrollHandler() {
        if (offsetTop === !1) return;

        if (documentScrollTop >= offsetTop && !el.getAttribute('sticky')) {
            el.setAttribute('sticky', !0);
        } else if (documentScrollTop < offsetTop && el.getAttribute('sticky')) {
            el.removeAttribute('sticky');
        }
    }

    function resizeHandler() {
        getOffsetTop();
        scrollHandler();
    }

    $document.on({
        'scrolled.headerSticky': scrollHandler
    });
    $window.on({
        'resized.recalculateHeaderSticky': resizeHandler
    });
});
var componentEditor = new Component('textarea[trumbowyg]', 'trumbowyg-init', function (el) {
    new Editor(el);
});

var Editor = function () {
    function Editor(el, settings) {
        var _this15 = this;

        _classCallCheck(this, Editor);

        var $el = void 0;
        if (el instanceof jQuery) {
            $el = el;
            el = $el[0];
        } else {
            $el = $(el);
        }

        this.el = el;
        this.$ = $el;

        this.settings = $.extend({}, Editor.defaults, settings, !0);

        this.loader = $('<div class="trumbowyg-loading"><span class="loader-circle"></span></div>').insertBefore($el);

        this.resources = {
            'css': ['css', API.trumbowyg['css']],
            'js': ['js', API.trumbowyg['js']],
            'lang': ['js', API.trumbowyg.langs + this.settings.lang + '.min.js'],
            'uploader': ['js', API.trumbowyg.plugin.upload]
        };

        this.lod = new LOD({
            name: 'editor',
            resources: this.resources,
            ready: function ready() {
                _this15.ready();
            }
        });

        if ($.trumbowyg) {
            this.ready();
        } else {
            this.lod.load('js', function () {
                _this15.lod.load('lang');
                _this15.lod.load('uploader');
            });
            this.lod.load('css');
        }
    }

    _createClass(Editor, [{
        key: 'ready',
        value: function ready() {
            this.loader.remove();
            return this.init();
        }
    }, {
        key: 'init',
        value: function init() {
            var _this16 = this;

            Editor.init();
            this.$.trumbowyg({
                lang: this.settings.lang,
                removeformatPasted: !1,
                btnsDef: {
                    image: {
                        dropdown: ['insertImage', 'upload', 'base64', 'noEmbed'],
                        ico: 'insertImage'
                    }
                },
                btns: [['viewHTML'], ['undo', 'redo'], ['formatting'], 'btnGrp-design', ['link'], 'insertImage', ['justifyLeft', 'justifyCenter', 'justifyRight'], 'btnGrp-lists', ['horizontalRule'], ['removeformat'], ['fullscreen']],
                plugins: {
                    upload: {
                        serverPath: 'https://api.imgur.com/3/image',
                        fileFieldName: 'img',

                        urlPropertyName: 'data.link',
                        data: [{
                            'name': 'circle_id',
                            'value': circleId
                        }, {
                            'name': 'tid',
                            'value': tid
                        }, {
                            'name': 'pid',
                            'value': pid
                        }]
                    }
                }
            });

            this.trumbowyg = this.$.data('trumbowyg');

            this.$ed = this.trumbowyg.$ed.on({
                'input': function input() {
                    clearTimeout(_this16.editorSyncTimeout);
                    _this16.editorSyncTimeout = setTimeout(function () {
                        _this16.trumbowyg.syncTextarea();
                    }, 100);
                }
            });

            this.trumbowyg.semanticCode = function (force, full) {
                var t = this;
                t.saveRange();
                t.syncCode(force);

                $(t.o.tagsToRemove.join(','), t.$ed).remove();

                if (t.o.semantic) {
                    t.semanticTag('b', 'strong');
                    t.semanticTag('i', 'em');
                    t.semanticTag('strike', 'del');

                    if (full) {
                        var inlineElementsSelector = t.o.inlineElementsSelector,
                            blockElementsSelector = ':not(' + inlineElementsSelector + ')';

                        t.$ed.contents().filter(function () {
                            return this.nodeType === 3 && this.nodeValue.trim().length > 0;
                        }).wrap('<span data-tbw/>');

                        var wrapInlinesInParagraphsFrom = function wrapInlinesInParagraphsFrom($from) {
                            if ($from.length !== 0) {
                                var $finalParagraph = $from.nextUntil(blockElementsSelector).andSelf().wrapAll('<p/>').parent(),
                                    $nextElement = $finalParagraph.nextAll(inlineElementsSelector).first();
                                $finalParagraph.next('br').remove();
                                wrapInlinesInParagraphsFrom($nextElement);
                            }
                        };
                        wrapInlinesInParagraphsFrom(t.$ed.children(inlineElementsSelector).first());

                        t.semanticTag('div', 'p', !0);

                        t.$ed.find('p').filter(function () {
                            if (t.range && this === t.range.startContainer) {
                                return !1;
                            }
                            return $(this).text().trim().length === 0 && $(this).children().not('br,span').length === 0;
                        }).contents().unwrap();

                        $('[data-tbw]', t.$ed).contents().unwrap();
                    }

                    t.restoreRange();

                    t.syncTextarea();
                }
            };

            return this.$;
        }
    }]);

    return Editor;
}();

Editor.defaults = {
    'lang': 'zh_cn'
};

Editor.init = function () {
    if ($.trumbowyg.initOnce) return !0;

    $window.on({
        'tbwinit': function tbwinit() {
            $window.trigger('resized');
        }
    });

    $.trumbowyg.svgPath = API.trumbowyg.svg;

    $.trumbowyg.initOnce = !0;
};