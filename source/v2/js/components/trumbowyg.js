var componentEditor = new Component('textarea[trumbowyg]', 'trumbowyg-init', function( el ){
    new Editor( el )
})




class Editor{
    
    /**
     * 编辑器
     * @param {element} el - 元素，可为原生元素对象也可为jQuery对象
     */
    constructor( el, settings ){
        let $el
        if( el instanceof jQuery ){
            $el = el
            el = $el[0]
        }else{
            $el = $(el)
        }
        
        this.el = el
        this.$ = $el
        
        this.settings = $.extend({}, Editor.defaults, settings, true)
        
        this.loader = $('<div class="trumbowyg-loading"><span class="loader-circle"></span></div>').insertBefore( $el )

        this.resources = {
            'css':      ['css', API.trumbowyg['css']],
            'js':       ['js', API.trumbowyg['js']],
            'lang':     ['js', API.trumbowyg.langs + this.settings.lang + '.min.js'],
            'uploader': ['js', API.trumbowyg.plugin.upload]
        }

        this.lod = new LOD({
            name: 'editor',
            resources: this.resources,
            ready: () => {
                this.ready()
            }
        })
        
        if( $.trumbowyg ){
            this.ready()
        }else{
            this.lod.load( 'js', () => {
                this.lod.load( 'lang' )
                this.lod.load( 'uploader' )
            } )
            this.lod.load( 'css' )
        }
    }
    
    // 编辑器素材文件已全部读取完毕
    ready(){
        this.loader.remove()
        return this.init()
    }
    
    // 初始化编辑器
    init(){
        Editor.init()
        this.$.trumbowyg({
            lang:   this.settings.lang,
            removeformatPasted: false,
            btnsDef: {
                // Customizables dropdowns
                image: {
                    dropdown: ['insertImage', 'upload', 'base64', 'noEmbed'],
                    ico: 'insertImage'
                }
            },
            btns:   [
                ['viewHTML'],
                ['undo', 'redo'],
                ['formatting'],
                'btnGrp-design',
                ['link'],
                'insertImage',
                //['image'],
                ['justifyLeft', 'justifyCenter', 'justifyRight'/*, 'justifyFull'*/],
                //'btnGrp-justify',
                'btnGrp-lists',
                ['horizontalRule'],
                ['removeformat'],
                ['fullscreen']
            ],
            plugins: {
                // Add imagur parameters to upload plugin
                upload: {
                    serverPath: 'https://api.imgur.com/3/image',
                    fileFieldName: 'img',
                    //headers: {'Authorization': 'Client-ID 9e57cb1c4791cea'},
                    urlPropertyName: 'data.link',
                    data: [{
                        'name':     'circle_id',
                        'value':    circleId
                    },{
                        'name':     'tid',
                        'value':    tid
                    },{
                        'name':     'pid',
                        'value':    pid
                    }]
                }
            }
        })
        
        //this.editorSyncTimeout = null
        this.trumbowyg = this.$.data('trumbowyg')
        
        // 中文输入法fix
        this.$ed = this.trumbowyg.$ed.on({
            'input': () => {
                clearTimeout( this.editorSyncTimeout )
                this.editorSyncTimeout = setTimeout( () => {
                    //console.log( 'editor changed' )
                    this.trumbowyg.syncTextarea()
                }, 100 )
            }
        })
        
        /*
        this.trumbowyg.syncTextarea = () => {
            let t = this.trumbowyg
            clearTimeout( t.syncTextareaTimeout )
            t.syncTextareaTimeout = setTimeout( () => {
                //t.$ta.val(
                //    t.$ed.text().trim().length > 0 || t.$ed.find('hr,img,embed,input').length > 0 ? t.$ed.html() : ''
                //);
                console.log('synced222')
            }, 10 )
        }
        */        // Analyse and update to semantic code
        // @param force : force to sync code from textarea
        // @param full  : wrap text nodes in <p>
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

                    // Wrap text nodes in span for easier processing
                    t.$ed.contents().filter(function () {
                        return this.nodeType === 3 && this.nodeValue.trim().length > 0;
                    }).wrap('<span data-tbw/>');

                    // Wrap groups of inline elements in paragraphs (recursive)
                    var wrapInlinesInParagraphsFrom = function ($from) {
                        if ($from.length !== 0) {
                            var $finalParagraph = $from.nextUntil(blockElementsSelector).andSelf().wrapAll('<p/>').parent(),
                                $nextElement = $finalParagraph.nextAll(inlineElementsSelector).first();
                            $finalParagraph.next('br').remove();
                            wrapInlinesInParagraphsFrom($nextElement);
                        }
                    };
                    wrapInlinesInParagraphsFrom(t.$ed.children(inlineElementsSelector).first());

                    t.semanticTag('div', 'p', true);

                    // Unwrap paragraphs content, containing nothing usefull
                    t.$ed.find('p').filter(function () {
                        // Don't remove currently being edited element
                        if (t.range && this === t.range.startContainer) {
                            return false;
                        }
                        return $(this).text().trim().length === 0 && $(this).children().not('br,span').length === 0;
                    }).contents().unwrap();

                    // Get rid of temporial span's
                    $('[data-tbw]', t.$ed).contents().unwrap();

                    //console.log( t.$ed.find('p:empty') )
                    // Remove empty <p>
                    //t.$ed.find('p:empty').remove();
                }

                t.restoreRange();

                t.syncTextarea();
            }
        }

        
        return this.$
    }
    
}

Editor.defaults = {
    'lang':     'zh_cn'
}

Editor.init = function(){
    if( $.trumbowyg.initOnce )
        return true
    
    // 编辑器初始化完成时触发 $window.onresized
    $window.on({
        'tbwinit': function(){
            $window.trigger('resized')
        }
    })
    
    // 设置相应URL
    $.trumbowyg.svgPath = API.trumbowyg.svg
    
    // 上传图片相关
    
    $.trumbowyg.initOnce = true
}