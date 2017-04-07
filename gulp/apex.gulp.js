
const argv = require("yargs").argv;
const exec = require("child_process").exec;
const gulp = require("gulp");
const gutil = require("gulp-util");
const del = require("del");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const commonjs = require("rollup-plugin-commonjs");
const nodeResolve = require("rollup-plugin-node-resolve");
const progress = require("rollup-plugin-progress");
const path = require("path");

const DEFAULT_ENV = "dev";

/**
 * build a function
 * 
 * @task {apex:build}
 * @arg {env, -e} apex environment, can also be specified via APEX_ENV or NODE_ENV
 * @arg {function, -f} function name
 */
gulp.task("apex:build", ["ts:compile"], () => {
	const env = process.env.APEX_ENV || process.env.NODE_ENV || argv.env || argv.e || DEFAULT_ENV;
	const functionName = path.basename(argv.f || argv.function || process.cwd());
	const projectRoot = path.join(__dirname, "..");
	gutil.log("__dirname %s", __dirname);
	gutil.log("projectRoot %s", projectRoot);
	gutil.log("cwd %s", process.cwd());
	process.chdir(projectRoot);

	return rollup.rollup({
		entry: path.join(process.cwd(), "functions", functionName, ".js", "main.js"),
		external: ["aws-sdk"],
		sourceMap: true,
		plugins: [
			progress(),
			nodeResolve({
				// module: true,
				// jsnext: true,
			}),
			commonjs({
				include: "node_modules/**"
			}),
			babel({
				exclude: "node_modules/**"
			}),
		]
	}).then(function(bundle) {
		return bundle.write({
			format: "cjs",
			dest: path.join(process.cwd(), "functions", functionName, `.${env}`, "index.js"),
		});
	});
});

/**
 * clean compiled scripts
 * 
 * @task {apex:clean}
 * @arg {env, -e} apex environment, can also be specified via APEX_ENV or NODE_ENV
 * @arg {function, -f} function name
 */
gulp.task("apex:clean", () => {
	const env = process.env.APEX_ENV || process.env.NODE_ENV || argv.env || argv.e || DEFAULT_ENV;
	const functionName = argv.f || argv.function;

	if (functionName) {
		process.chdir(path.join(__dirname, "..", "functions", functionName));
		return del([`.${env}`]);
	}

	return del([`functions/**/.${env}`]);
});

/**
 * Deploy lambda functions
 *
 * @task {apex:deploy}
 * @arg {env, -e} apex environment, can also be specified via APEX_ENV or NODE_ENV
 * @arg {function, -f} function name
 */
gulp.task("apex:deploy", (next) => {
	const env = process.env.APEX_ENV || process.env.NODE_ENV || argv.env || argv.e || DEFAULT_ENV;
	const functionName = argv.f || argv.function || "";

	const p = exec(`apex deploy --env=${env} ${functionName};`, next);
	p.stdout.on("data", (data) => { data.split("\n").forEach((line) => gutil.log(line)) });
	p.stderr.on("data", (data) => { data.split("\n").forEach((line) => gutil.log(gutil.colors.red(line))) });
});