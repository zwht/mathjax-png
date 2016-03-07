var gulp=require("gulp");
var source = require("vinyl-source-stream");
var buffer = require('vinyl-buffer');
var watchify = require('gulp-watchify');
var browserSync = require("browser-sync").create();
var cached = require("gulp-cached");
var less = require("gulp-less");
var jade = require("gulp-jade");
var csso=require("gulp-csso");
var iconfont = require("gulp-iconfont");
var fontcss = require("gulp-iconfont-css");
// var fontmin=require("gulp-fontmin");
// var doc = require("smartdoc");
var bowerfiles = require("main-bower-files");
var plumber=require("gulp-plumber");
var streamify = require('gulp-streamify');
var uglify=require("gulp-uglify");
var gulpif=require("gulp-if");
var babelify = require("babelify");
var jshint=require("gulp-jshint");
var prefixer=require("gulp-autoprefixer");
var sourcemaps=require("gulp-sourcemaps");
var fe=require("gulp-foreach");
var path = require('path');
var replace =require("gulp-replace");   //inject string into file
var collapse = require('bundle-collapser/plugin');   //reduce module path string;
var del=require("del");
var seq=require("gulp-sequence");
var proxyMiddleware = require('http-proxy-middleware');

var TMP_FOLDER="tmp/";


var DEPLOY_FOLDER="build/";

var FOLDER=TMP_FOLDER;
var TYPE="DEV";
var ENTRIES=["src/app/entries/*.js"];
var JSS=["src/app/**/*.js"];
var CSSMAIN=["src/assets/style/entries/*.less"];
var CSSDIR=["src/assets/style/**/*.less"];
var VIEWS=["src/views/**/*.jade"];
var IMAGES=["src/assets/image/**/*"];
var ICONS=["src/assets/icon/**/*.svg"];


var SERVER_PORT=7099;
var SERVER="";
var LOGSERVER="http://log.iclassedu.com/";
var SERVER_PROXY = "http://www.iclassedu.com/";
var SERVER_PROXY = "http://172.16.3.37/";
var SERVER_PROXY = "http://172.16.40.51:8080/tem-rest-frontend/";
var SERVER_PROXY = "http://172.16.8.5/";



// var bundlex=browserify({entries:ENTRIES,cache: {}, packageCache: {}}).transform("bulkify");
// var bundleWatch=watchify(bundlex);
var config={
    watch:true,
    cache:{},
    packageCache: {},
    setup:function(bundle){
        bundle.transform('bulkify');
        bundle.transform(babelify);
    }
};

var proxy = proxyMiddleware("/rest", {
    target: SERVER_PROXY,
    changeOrigin: true
});

gulp.task("clear",function(cb){
    del([FOLDER],cb);
});

gulp.task("bundle",watchify(function(wf){
  // if(TYPE=="DEV")LOGSERVER="";
  return gulp.src(ENTRIES)
    .pipe(plumber())
    .pipe(wf(config))
    .on("error",function(error){console.dir(error);this.emit('close');this.emit('end');})
    .pipe(buffer()) //fixed browserify update too early.
    .pipe(replace("#SERVER#",SERVER))
    .pipe(replace("#LOGSERVER#",LOGSERVER))
    .pipe(gulpif(TYPE=="DEPLOY",sourcemaps.init()))
    .pipe(gulpif(TYPE=="DEPLOY",uglify())) 
    .pipe(gulpif(TYPE=="DEPLOY",sourcemaps.write("./")))
    .pipe(gulp.dest(FOLDER+"scripts"));
}));

gulp.task("compile-lib",function(){
    return gulp.src(["libs/**/*"])
        .pipe(gulp.dest(FOLDER+"libs"));
});

gulp.task("compile-views",function(){
    var config=(TYPE=='DEV')?{time:""}:{time:"?v="+new Date().getTime()};
    config.type=TYPE;
    return gulp.src(VIEWS)
        .pipe(cached("debug",{optimizeMemory:true}))
        .pipe(jade({locals:config}))
        .on("error",function(error){console.dir(error);this.emit('end');})
        .pipe(gulp.dest(FOLDER));
});

gulp.task("compile-style",function(){
    return gulp.src(CSSMAIN,{base:"src/assets/style/entries"})
        .pipe(less())
        .on("error",function(error){console.dir(error);this.emit('end');})
        .pipe(prefixer())
        .pipe(gulp.dest(FOLDER+"assets/style"));
});

gulp.task("compile-image",function(){
    return gulp.src(IMAGES,{base:"src"})
        .pipe(cached("debug",{optimizeMemory:true}))
        .pipe(gulp.dest(FOLDER));
});

gulp.task("compile-font",function(){
    
})

//compile icon to demo
gulp.task("create-demo",function(){
    var files=[];
    return gulp.src(ICONS)
        .pipe(fe(function(stream,file){
            var name=path.basename(file.path)
            files.push(name.replace(".svg",""));
            return stream;
        }))
        .on("finish",function(){
            gulp.src("src/views/page/demo/icon.jade")
            .pipe(jade({locals:{icons:files}}))
            .pipe(gulp.dest(FOLDER+"page/demo/"));
        });
})
gulp.task("compile-icon",function(){

    return gulp.src(ICONS,{base:"src"})
        .pipe(fontcss({
            fontName: "icon", path:"src/config/iconfont.css.tpl", targetPath: "icon.css"
        }))
        .pipe(iconfont({fontName: "icon",normalize:true}))
        .pipe(gulp.dest(FOLDER+"assets/icon"));
});

gulp.task("compile-faq",function(){
    return gulp.src(["faq/**/*"])
        .pipe(gulp.dest(FOLDER+"faq"));

})

//    "smartdoc": "git://github.com/zhh77/smartDoc",

// gulp.task("compile-doc",function(){
//   var config=require("./src/config/docConfig.js");
//   doc.build(config);
// });


/**
 * Karma Test
 */

// gulp.task("run-test",["default"],function(){

//     var files=[TMP_FOLDER+"/scripts/main.js"];
//     files=bowerfiles().concat(files).concat("est/spec/*.js");
//     gulp.src(files)
//     .pipe(karma({ configFile:"src/config/karmaConfig.js",run:true,singleRun:true}))
//     .on("error",function(){});

// });

gulp.task("watch",function(){
    gulp.watch(VIEWS,["compile-views"]);
    gulp.watch(CSSDIR,["compile-style"]);
    gulp.watch(IMAGES,["compile-image"]);
    gulp.watch(ICONS,["compile-icon","create-demo"]);
    //gulp.watch(JSS,["bundle"]);
    gulp.watch(FOLDER+"/**/*",{read:false}).on('change', function(event){
        browserSync.reload();
    });
});

gulp.task("default",["bundle","compile-views","compile-lib","compile-style","compile-image","compile-icon","create-demo","compile-faq"]);

gulp.task("dev",["default"],function(){
    console.log("##Starting Server.......");
    browserSync.init({
        //proxy:'http://172.16.40.53:',
        port:SERVER_PORT,
        //startPath:"http://172.16.40.53:9002/",
        ghostMode:false,
        server:FOLDER,
        middleware: [proxy]
    });
    gulp.start("watch");
});

gulp.task("server",seq("clear","dev"));

gulp.task("deploy",["clear"],function(){

    FOLDER=DEPLOY_FOLDER;
    TYPE="DEPLOY";
    SERVER="";
    //replace browerify config
    config={ watch:false, cache:{},packageCache: {},
        setup:function(bundle){
            bundle.transform('bulkify');
            bundle.transform(babelify);
            bundle.plugin(collapse);
        }
    };
    gulp.start("default");

})

gulp.task("devx",function(){
    FOLDER=DEPLOY_FOLDER;
    TYPE="DEPLOY";
    //replace browerify config
    config={ watch:false, cache:{},packageCache: {},
        setup:function(bundle){
            bundle.transform('bulkify');
            bundle.transform(babelify);
        }
    };
    gulp.start("default");
})
