
const gulp = require("gulp");
const gutil = require("gulp-util");
const usage = require("gulp-help-doc");
const requireDir = require("require-dir");

process.env.AWS_PROFILE = process.env.AWS_PROFILE || "dev";

gulp.task("help", function() {
    return usage(gulp, {
        lineWidth: 120,
        keysColumnWidth: 30,
        logger: gutil,
    });
});
gulp.task("default", ["help"]);

requireDir("gulp", { recursive: true });
