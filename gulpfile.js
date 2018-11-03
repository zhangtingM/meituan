var gulp = require('gulp');

var sass = require('gulp-sass');

var server = require('gulp-webserver');

var url = require('url');

var fs = require('fs');

var path = require('path')

var list = require('./mock/list.json');
var swiper = require('./mock/swiperData.json')

gulp.task('server', function() {
    return gulp.src('src')
        .pipe(server({
            port: 8989,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;

                if (pathname === '/favicon.ico') {
                    res.end('')
                    return false;
                }
                if (pathname === '/api/list') { //请求接口

                    res.end(JSON.stringify({ code: 0, msg: list }))

                } else if (pathname === '/api/swiper') {
                    var ind = url.parse(req.url, true).query.index;
                    res.end(JSON.stringify({ code: 0, msg: swiper[ind] }))
                } else {
                    pathname = pathname === '/' ? 'index.html' : pathname;
                    res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
                }
            }
        }))

})

//编译sass
gulp.task('sass', function() {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
});

//watch
gulp.task('watch', function() {
    return gulp.watch('./src/scss/*.scss', gulp.series('sass'))
});
//dev

gulp.task('dev', gulp.series('sass', 'server', 'watch'))