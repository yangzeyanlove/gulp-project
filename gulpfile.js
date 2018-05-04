'use strict';

var gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    minifycss  = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    uglify     = require('gulp-uglify'),
    webserver  = require('gulp-webserver'),
    opn        = require('opn'),
    concat     = require('gulp-concat'),
    clean      = require('gulp-clean'),
    rename     = require("gulp-rename"),
    imagemin   = require('gulp-imagemin'),
    pngquant   = require('imagemin-pngquant'),
    tinypng    = require('gulp-tinypng'),
    config     = require('./config.json');

//压缩javascript 文件，压缩后文件放入build/js下
gulp.task('minifyjs',function(){
  gulp.src('js/*.js')
    // .pipe(uglify())
    .pipe(gulp.dest('./build/js'))
});

//合并build/js文件夹下的所有javascript 文件为一个main.js放入build/js下
gulp.task('alljs', function() {
  return gulp.src('./build/js/*.js')
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./build/js/'));
});

//重命名project.md 文件
gulp.task('rename', function() {
  return gulp.src("./Project.md")
    .pipe(rename("README.md"))
    .pipe(gulp.dest("./build"));
});

//开启本地 Web 服务器功能
gulp.task('webserver', function() {
  gulp.src( './' )
    .pipe(webserver({
      host:             config.localserver.host,
      port:             config.localserver.port,
      livereload:       true,
      directoryListing: false,
      open: true
    }));
});

// 进行SASS 代码
gulp.task('sass', function () {
  return gulp.src('./sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 4 versions', 'Android >= 4.0'],
        cascade: true, //是否美化属性值 默认：true 像这样：
        //-webkit-transform: rotate(45deg);
        //        transform: rotate(45deg);
        remove:true //是否去掉不必要的前缀 默认：true
    }))
    // .pipe(uglify())
    // .pipe(minifycss())
    .pipe(gulp.dest('./css'));
});

//多余文件删除
gulp.task('clean', ['sass', 'imagemin', 'tinypng'], function () {
  // return gulp.src(['./.sass-cache', './.gulp'])
  return gulp.src(['./.sass-cache'])
    .pipe(clean())
});

//重命名project.md 文件
// gulp.task('rename', function() {
//   return gulp.src("./Project.md")
//       .pipe(rename("README.md"))
//       .pipe(gulp.dest("./build"));
// });

//压缩图片
gulp.task('imagemin', function () {
  return gulp.src('images/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('./build/images'));
});

//压缩图片 - tinypng
gulp.task('tinypng', function () {
  gulp.src('images/*.{png,jpg,jpeg}')
    .pipe(tinypng(config.tinypngapi))
    .pipe(gulp.dest('./build/images'));
});

//将相关项目文件复制到build 文件夹下
gulp.task('buildfiles', function() {
  //根目录文件
  // gulp.src('./*.{php,html,css,png}')
  gulp.src('./*.html').pipe(gulp.dest('./build'));
  //CSS文件
  gulp.src('./css/*').pipe(minifycss()).pipe(gulp.dest('./build/css'));
  //压缩后的js文件
  gulp.src('./js/min/*').pipe(gulp.dest('./build/js'));
});

//文件监控
gulp.task('watch', function () {
  gulp.watch('./sass/*.scss', function (e) {
    gulp.run('sass');
  });

  // 自动刷新
  gulp.watch(['./*.html','./*.css','./js/*.js','./images/*.*']).on('change', function(file) {
    livereload.changed(file.path);
  });

});

//默认任务
gulp.task('default', function(){
  console.log('Starting Gulp tasks, enjoy coding!');
  gulp.run('sass');
  gulp.run('watch');
  gulp.run('webserver');
  // gulp.run('openbrowser');
});

//项目完成提交任务
gulp.task('build', function(){
  gulp.run('imagemin');
  gulp.run('sass');
  gulp.run('minifyjs');
  gulp.run('alljs');
  gulp.run('buildfiles');
  // gulp.run('rename');
  gulp.run('clean');
});

//项目完成提交任务
gulp.task('build2', function(){
  gulp.run('tinypng');
  gulp.run('sass');
  gulp.run('minifyjs');
  gulp.run('alljs');
  gulp.run('buildfiles');
  // gulp.run('rename');
  gulp.run('clean');
});
