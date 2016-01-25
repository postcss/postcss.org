var gulp = require('gulp');
var sketch = require('gulp-sketch');
var getutil  = require('gulp-util')
var which  = require('npm-which')(__dirname);
var svgmin = require('gulp-svgmin');

gulp.task('sketch', function(){

  try {
    which.sync('sketchtool');
  } catch(error){
    getutil.log(error); return;
  }

  return gulp.src('./src/sketch/*.sketch')
    .pipe(sketch({
      export: 'slices',
      formats: 'png'
    }))
    .pipe(gulp.dest('./src/template/'));
});

gulp.task('minify', function () {
    return gulp.src('./src/images/*.svg')
        .pipe(svgmin())
        .pipe(gulp.dest('./src/images/'));
});
