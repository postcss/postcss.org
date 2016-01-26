const gulp = require("gulp")
const sketch = require("gulp-sketch")
const getutil = require("gulp-util")
const which = require("npm-which")(__dirname)
const svgmin = require("gulp-svgmin")

gulp.task("sketch", function() {
  try {
    which.sync("sketchtool")
  }
  catch (error) {
    getutil.log(error); return
  }

  return gulp.src("./src/sketch/*.sketch")
    .pipe(sketch({
      export: "slices",
      formats: "png",
    }))
    .pipe(gulp.dest("./src/template/"))
})

gulp.task("minify", function() {
  return gulp.src("./src/images/*.svg")
    .pipe(svgmin())
    .pipe(gulp.dest("./src/images/"))
})
