var API = {
    'common':{
        'js':       '/dist/v2/js',
        'css':      '/dist/v2/css'
    },

    'tweet':    'json-sample/tweets.json',
    'thread':   'json-sample/circle-thread-list.json',
    'pics':     'json-sample/img-list.json',
    
    'autocomplete': {
        'item':     '',
        'tag':      'json-sample/autocomplete-tag.json'
    },
    'evaluate': 'json-sample/evaluate-list.json',
    'circle': {
        'subcribe':     'json-sample/autocomplete-tag.json?c=circle&a=follow&do=1',
        'unsubcribe':   'json-sample/autocomplete-tag.json?c=circle&a=follow&do=0',
        'userlevel':    'http://circle.prpracg.com/index.php?c=circle&a=changeLevel'
    }
}

// 可见即所得编辑器相关素材地址
API.trumbowyg = {
    'path':     '/dist/trumbowyg'
}
API.trumbowyg.js        = API.trumbowyg.path + '/trumbowyg.min.js'
API.trumbowyg.css       = API.trumbowyg.path + '/ui/trumbowyg.min.css'
API.trumbowyg.svg       = API.trumbowyg.path + '/ui/icons.svg'
API.trumbowyg.langs     = API.trumbowyg.path + '/langs/'
API.trumbowyg.plugins   = API.trumbowyg.path + '/plugins/'
API.trumbowyg.plugin = {
    'upload':   API.trumbowyg.plugins + '/upload/trumbowyg.upload.min.js'
}

// 资源上传器
API.dropzone = '/dist/dropzone'
API.upload = 'http://g.pracg.com/index.php?c=upload&a=image' // &type=type

