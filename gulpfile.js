var gulp = require('gulp');
var svgSymbol = require('gulp-svg-symbols');

gulp.task('sprites', function(){
  return gulp.src('assets/svg/*.svg').pipe(svgSymbol()).pipe(gulp.dest('assets'));
});
