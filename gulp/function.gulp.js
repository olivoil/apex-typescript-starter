
const gulp = require("gulp");

/**
 * ---------------------------------------------------------------------------
 * @task {function}
 *
 * @order {4}
 */
gulp.task("function", ["function:create"]);

/**
 * sets up the basic files for a new function
 *
 * @task {function:create}
 * @arg {function, -f} function name
 */
gulp.task("function:create", (next) => {
	return Promise.reject("task not implemented yet");
});