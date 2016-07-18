let componentForm = new Component('form', 'form-init', function( el ){
    let $el = $(el)
    
    for( let i in componentForm.types ){
        componentForm.types[i]( el, $el )
    }
})

componentForm.types = {}

componentForm.types.autocompleteTag = function( el, $el ){
    $el.find('[prpr-autocomplete="tag"]').each(function( index, input ){
        input = $(input)
        let autocomplete = input.data('Autocomplete')
            ,taglist = $el.parent()
            ,taglistInput = $el.find('[name="tags"]')
            ,taglistArray = []
        
        if( !autocomplete )
            autocomplete = new Autocomplete( input )
        
        $el.on('click.deleteTag', '.tag.is-editable s', deleteTag)
        
        taglist.find('.tag[tag-id]').each(function(index, el){
            taglistArray.push( parseInt( el.getAttribute('tag-id') ) )
        })
        updateTaglist()

        //console.log( autocomplete )
        
        autocomplete.callbacks.resultFilter = function( o ){
            return !(taglistArray.indexOf( o.tag_id ) > -1)
        }
        
        autocomplete.callbacks.resultSelect = function(evt){
            let id = parseInt(evt.currentTarget.getAttribute('item-id'))
            
            evt.preventDefault()
            
            // 检查是否存在该结果
            if( taglistArray.indexOf( id ) > -1 )
                return
            
            $('<span/>',{
                'class':    'tag is-editable',
                'html':     evt.currentTarget.innerHTML,
                'tag-id':   id
            }).append(
                $('<s>×</s>')
            ).insertBefore( input )
            
            taglistArray.push( id )

            updateTaglist()
            
            // 清空输入框中内容
            input.val('').focus()
            autocomplete.cur = null
        }
        
        function updateTaglist(){
            let v = taglistArray.join(',')
            taglistInput.val( v )
            //console.log( v )
            return v
        }
        
        function deleteTag( evt ){
            let el = evt.currentTarget.parentNode
                ,id = parseInt(el.getAttribute('tag-id'))
                ,index = taglistArray.indexOf( id )
            
            taglistArray.splice( index, 1)
            el.parentNode.removeChild(el)
            updateTaglist()
        }
    })
}

componentForm.types.uploader = function( el, $el ){
    if( $el.hasClass('form--uploader') ){
        new Uploader( el )
    }
}

new Layout(function( /*self*/ ){
    
    /**
     * 取消按钮
     */
    $body.on('click.formCancel', 'form [button="cancel"]', function( evt ){
        //if( isIframe && document.referrer && document.referrer != top.location.href ){
        //    top.modal.hide()
        //    evt.preventDefault()
        //}else{
        let el = evt.currentTarget
        if( !(el.tagName == 'A' && el.getAttribute('href') && el.getAttribute('href') != '#' && el.getAttribute('href').substr(0,10) != 'javascript') ){
            history.back()
            evt.preventDefault()
        }
        //}
    });

    /**
     * 所有输入框，如果有内容加入 hasvalue 属性
     */
    $body.on('input.checkHasValue change.checkHasValue', 'input, textarea', function( evt ){
        let el = evt.currentTarget;
        if( el.value )
            el.setAttribute( 'hasvalue', true )
        else
            el.setAttribute( 'hasvalue', false )
    });

    /**
     * 大尺寸表单
     */
    $body.on('focus', '.form-full .form-item', function(evt){
        let input = evt.target;
        if( !input.disabled && !input.readOnly )
            evt.currentTarget.setAttribute( 'is-focus', true );
    }).on('blur', '.form-full .form-item', function(evt){
        evt.currentTarget.removeAttribute( 'is-focus' );
    })
    
});

class Uploader{
    constructor( form ){
        let $el
        if( form instanceof jQuery ){
            $el = el
            form = $el[0]
        }else{
            $el = $(form)
        }
        
        this.el = form
        this.$ = $el

        this.type = this.el.getAttribute('type')
        if( !this.type ){
            var QueryString = function () {
                // http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-url-parameter
                // This function is anonymous, is executed immediately and
                // the return value is assigned to QueryString!
                var query_string = {};
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    // If first entry with this name
                    if (typeof query_string[pair[0]] === "undefined") {
                        query_string[pair[0]] = decodeURIComponent(pair[1]);
                        // If second entry with this name
                    } else if (typeof query_string[pair[0]] === "string") {
                        var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                        query_string[pair[0]] = arr;
                        // If third or later entry with this name
                    } else {
                        query_string[pair[0]].push(decodeURIComponent(pair[1]));
                    }
                } 
                return query_string;
            }();
            this.type = QueryString.type || QueryString.uploader || 'circle_thread'
        }

        this.loader = $('<div class="form-loading"><span class="loader-circle"></span></div>').appendTo( this.$ )

        this.lod = new LOD({
            name: 'uploader',
            resources: {
                'cssBasic': ['css', API.dropzone + Uploader.files['cssBasic'] ],
                'cssFull':  ['css', API.dropzone + Uploader.files['cssFull'] ],
                'cssSite':  ['css', API.common.css + '/lod-uploader.css' ],
                'js':       ['js',  API.dropzone + Uploader.files['js'] ],
                'modules':  ['js',  API.dropzone + Uploader.files['modules'] ]
            },
            ready: () => {
                this.ready()
            }
        })

        this.lod.load( 'cssBasic', () => {
            this.lod.load( 'cssFull' )
            this.lod.load( 'cssSite' )
            this.lod.load( 'js', () => {
                this.lod.load( 'modules' )
            } )
        } )
    }

    ready(){
        $('<input type="file" name="file" />').appendTo( this.$.addClass('dropzone') )
        this.loader.remove()
        this.$.dropzone({
            url: API.upload + '&type=' + this.type
        });
    }
}

Uploader.files = {
    'cssBasic': '/basic.min.css',
    'cssFull':  '/dropzone.min.css',
    'js':       '/dropzone.min.js',
    'modules':  '/dropzone-amd-module.min.js'
}