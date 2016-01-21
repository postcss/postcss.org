var gulp = require('gulp');
var sketch = require('gulp-sketch');
var gutil  = require('gulp-util')
var which  = require('npm-which')(__dirname);
var svgmin = require('gulp-svgmin');

gulp.task('sketch', function(){
  try {
    which.sync('sketchtool');
  } catch(error){
    gutil.log(error); return;
  }

  return gulp.src('./src/*.sketch')
    .pipe(sketch({
      export: 'slices',
      formats: 'png'
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('minify', function () {
    return gulp.src('./dist/*')
        .pipe(svgmin())
        .pipe(gulp.dest('./dist'));
});

