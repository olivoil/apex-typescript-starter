
const gulp = require("gulp");
const gutil = require("gulp-util");
const usage = require("gulp-help-doc");
const requireDir = require("require-dir");
const path = require("path");
const argv = require("yargs").argv;

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

/**
 * build function
 * @task {build}
 * @arg {env, -e} environment
 * @arg {function, -f} function name
 */
gulp.task("build", ["apex:build"]);

/**
 * clean built files
 * @task {clean}
 * @arg {env, -e} environment
 * @arg {function, -f} function name
 */
gulp.task("clean", ["apex:clean", "ts:clean"]);

/**
 * lint and test
 * @task {test}
 * @arg {function, -f} function name
 */
gulp.task("test", ["ts:lint", "ts:test"]);

/**
 * watch function and test on save
 * 
 * @task {watch}
 * @arg {function, -f} function name
 */
gulp.task("watch", ["ts:lint", "ts:test"], () => {
  const functionName = argv.f || argv.function;
  if (functionName) {
		process.chdir(path.join(__dirname, "functions", path.basename(functionName)));
  }
  gulp.watch("**/*.ts", ["ts:lint", "ts:test"]);
});
