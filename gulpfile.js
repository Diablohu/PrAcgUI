"use strict";

/**
 * 动漫百科gulp配置
 */
var gulp = require('gulp'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),
    concat = require("gulp-concat"),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    rename = require("gulp-rename"),
    rimraf= require('gulp-rimraf'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    sourcemaps = require('gulp-sourcemaps'),
    spritesmith = require('gulp.spritesmith'),
    fs = require('fs'),
    path = require('path'),
    babel = require('gulp-babel'),
    postcss = require('gulp-postcss'),
    watchLess = require('gulp-watch-less2'),
    nano = require('gulp-cssnano'),
    perfectionist = require('perfectionist'),
    foreach = require('gulp-foreach');

/**
 * 自定义部署目录
 */
var config = {
    devDeployPath: "./dist",
    qaDeployPath: "",
    stageDeplyPath: ""
};

var DEPLOY_PATH = config.devDeployPath;

/**
 * 清理发布目录
 */
gulp.task('clean', function() {
    return gulp.src(DEPLOY_PATH, {
            read: false
        })
        .pipe(rimraf());
});


/*less 压缩*/
gulp.task("less",function(){
        gulp.src("./assets/less/**/*.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({cascade:false,browsers:['> 1%', 'Firefox >= 10', 'Opera >= 10', 'ie >= 9', 'iOS >= 4', 'Chrome >= 10']}))
        .pipe(gulp.dest("./assets/css"));
    });

/**
 *公共处理压缩
 */
gulp.task("minify-js-common", function() {
    return gulp.src([
            "./assets/js/jquery-1.11.3.min.js",
            "./assets/js/script.js"
        ])
        .pipe(concat("lib.js"))
        .pipe(sourcemaps.init())
         //.pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename("lib.min.js"))
        .pipe(gulp.dest(DEPLOY_PATH+"/js"));
});
gulp.task("minify-css-common", function() {
    return gulp.src([
            "./assets/css/reset.css",
            "./assets/css/common.css"
        ])
        .pipe(concat("lib.min.css"))
        .pipe(minifycss())
        .pipe(gulp.dest(DEPLOY_PATH+"/css"));
});


/*动画首页*/
gulp.task("minify-js-animatitem", function() {
    return gulp.src([
            "./assets/js/animateitem/script.js"
        ])
        .pipe(sourcemaps.init())
        .pipe(concat("m.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEPLOY_PATH + "/js/animateitem"));
});
gulp.task("minify-css-animatitem", function() {
    return gulp.src([
            
            "./assets/css/animateitem/style.css"
        ])
        .pipe(concat("m.min.css"))
        .pipe(minifycss())
        .pipe(gulp.dest(DEPLOY_PATH + "/css/animateitem"));
});


/**
 * 压缩图片
 */
gulp.task('min-img', [], function() {
    return gulp.src('assets/img/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/assets/img'));
});

/**
 * 图片合并 
 * 把assets/img/sprite/* 目录下的jpg,png,gif,svg合并成sprite.png
 */
gulp.task('sprite', ['clean-sprite'], function() {
    return gulp.src('assets/img/sprite/*.{jpg,png,gif,svg}')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }))
        .pipe(gulp.dest('assets/img/sprite/result'));
});
gulp.task('clean-sprite', function() {
    return gulp.src('assets/img/sprite/result', {
            read: false
        })
        .pipe(rimraf());
});


/**
 * 配置默认gulp任务
 */

// ------------------------------------------------------------
//gulp.task("default", ["minify-common", "watch"]);
//gulp.task("default", ["minify-animatitem", "watch"]);

gulp.task("default-v1",['less','auto-less']);

//创建任务
//gulp.task("minify-common", ["minify-js-common", "minify-css-common"]);
//gulp.task("minify-animatitem", ["minify-js-animatitem", "minify-css-animatitem"]);
gulp.task("auto-less",function(){
   gulp.watch("./assets/less/**/*.less",["less"]);
});
//监视任务
//gulp.task("watch", function() {
//    gulp.watch([
//        "./assets/js/jquery-1.11.3.min.js",
//        "./assets/js/script.js",
//        "./assets/css/reset.css",
//        "./assets/css/common.css",
//         "./assets/js/**/script.js",
//         "./assets/css/**/style.css"
//
//    ], ["minify-animatitem"]);
//});


















// v2
var DEPLOY_PATH_V2 = "./dist/v2";
var PATH_SOURCE = "./source/v2";

/**
 * FUNCTION: 编译LESS
 */
function lessCompile( file, outputPath, options ){
    options = options || {}
    
    function log(){
        console.log(`Compiled LESS ${file}`)
    }

    return gulp.src(file)
        .pipe(less())
        .pipe(nano( options.nano ))
        .pipe(postcss([
            perfectionist(),
            require('postcss-object-fit-images')
        ]))
        .pipe(rename(function(path){
            // 如果文件名以 css- 开头，移除这一部分
            if( path.basename.indexOf('css-') === 0 )
                path.basename = path.basename.substr(4)
            return path
        }))
        .pipe(gulp.dest( outputPath ))
        .on('end', log)
        .on('error', log);
}

/**
 * TASK: 实时监测 source 根目录并实时输出CSS
 */
gulp.task('less-watch', function(){
    let f = path.join( PATH_SOURCE, '*.less' );
    return gulp.src(f)
        .pipe(watchLess(f, {verbose: true}, function(File){
            lessCompile(File.history[0], DEPLOY_PATH_V2 + '/css', {
                nano: {
                    autoprefixer: {
                        'browsers': [
                            'Android >= 2',
                            'Chrome >= 20',
                            'Firefox >= 20',
                            'ie >= 8',
                            'Edge >= 12',
                            'iOS >= 5',
                            'ChromeAndroid >= 20',
                            'ExplorerMobile >= 11'
                        ],
                        add: true
                    },
                    reduceIdents: {
                        keyframes: false
                    }
                }
            })
        }))
});

/**
 * TASK: 实时监测 source 根目录并实时输出JS
 */
var folders_pack = [
    'libs',
    'libs-old'
]
var folders_single = [
    'pages'
]
var folders_exlude = folders_pack.concat(folders_single)
gulp.task('js-output', function(){
    return gulp.src( path.join( PATH_SOURCE, '*.js' ) )
        .pipe(foreach(function(stream, masterFile) {
            let filelist = fs.readFileSync( masterFile.history[0], 'utf-8')
                    .replace(/\r?\n|\r/g, '')
                    .split('//= require ')
                    .filter(function(value){
                        return value
                    })
                    .map(function(value){
                        if( value )
                            return path.join(PATH_SOURCE, value.replace(/^\"(.+)\"$/g, '$1') )
                    });
            return gulp.src( filelist )
		        .pipe(concat(masterFile.relative))
                .pipe(babel({
                    'highlightCode':	false,
                    'comments':			false,
                    'compact':			false,
                    'ast':				false,
                    "presets": 			[
                        "es2015",
                        "stage-0"
                    ],
                    "plugins":			[
                        "transform-minify-booleans"
                    ]
                }))
                .pipe(rename(function(path){
                    // 如果文件名以 js- 开头，移除这一部分
                    if( path.basename.indexOf('js-') === 0 )
                        path.basename = path.basename.substr(3)
                    return path
                }))
                .pipe(gulp.dest(DEPLOY_PATH_V2 + '/js'))
                .on('error', console.log)
                .on('end', function(){
                    console.log(`Compiled JS ${masterFile.history[0]}`)
                });
        }))
        .pipe(gulp.dest(DEPLOY_PATH_V2 + '/js'));
});
folders_pack.forEach(function(v){
    gulp.task('js-' + v + '-output', function(){
        return gulp.src( path.join( PATH_SOURCE, '**/' + v + '/*.js' ) )
            .pipe(concat( v + '.js'))
            .on('error', console.log)
            .on('end', function(){
                console.log(`Compiled JS ${v}.js`)
            })
            .pipe(gulp.dest(DEPLOY_PATH_V2 + '/js'));
    });
})
folders_single.forEach(function(v){
    gulp.task('js-' + v + '-output', function(){
        return gulp.src( path.join( PATH_SOURCE, '**/' + v + '/*.js' ) )
            .pipe(foreach(function(stream, masterFile) {
                return gulp.src( masterFile.history[0] )
                    .pipe(babel({
                        'highlightCode':	false,
                        'comments':			false,
                        'compact':			false,
                        'ast':				false,
                        "presets": 			[
                            "es2015",
                            "stage-0"
                        ],
                        "plugins":			[
                            "transform-minify-booleans"
                        ]
                    }))
                    //.pipe(gulp.dest(DEPLOY_PATH_V2 + '/js'))
                    .pipe(rename({
                        'prefix': 'page-'
                    }))
                    .on('error', console.log)
                    .on('end', function(){
                        console.log(`Compiled JS ${masterFile.history[0]}`)
                    });
            }))
            .pipe(gulp.dest(DEPLOY_PATH_V2 + '/js'));
    });
})

gulp.task('js-watch', function(){
    folders_exlude.forEach(function(v){
        gulp.watch(
                path.join( path.join( PATH_SOURCE, '**/' + v + '/*.js' ) ),
                ['js-' + v + '-output']
            );
    })
    gulp.watch(
            path.join( path.join( PATH_SOURCE, '**/!(' + folders_exlude.join('|') + ')/*.js' ) ),
            ['js-output']
        );
    gulp.watch(
            path.join( path.join( PATH_SOURCE, '*.js' ) ),
            ['js-output']
        );
});

gulp.task('default',[
    'js-output',
    'js-libs-output',
    'js-libs-old-output',
    'js-watch',
    'less-watch'
].concat( folders_exlude.map(function(v){
    return 'js-' + v + '-output'
} )));