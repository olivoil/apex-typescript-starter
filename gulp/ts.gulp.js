
const argv = require("yargs").argv;
const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const merge = require("merge2");
const sourcemaps = require("gulp-sourcemaps");
const path = require("path");
const jest = require("gulp-jest").default;
const debug = require("gulp-debug");
const del = require("del");

const tsProject = ts.createProject(path.join(__dirname, "../tsconfig.json"));

/**
 * run tests
 * 
 * @task {ts:test}
 * @arg {function, -f} function name
 */
gulp.task("ts:test", () => {
	const functionName = argv.f || argv.function;
	if (functionName) {
		process.chdir(path.join(__dirname, "..", "functions", path.basename(functionName)));
	}

	return gulp.src("**/*.test.ts")
		.pipe(debug({ title: "ts:test" }))
		.pipe(jest({
			config: {
				"rootDir": path.join(__dirname, ".."),
				"transform": {
					"^.+\\.tsx?$": "<rootDir>/jest/preprocessor.js",
					"^.+\\.jsx?$": "babel-jest"
				},
				"testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$",
				"moduleFileExtensions": ["ts", "tsx", "js", "jsx"],
				"testPathIgnorePatterns": ["/node_modules/", "/.c9/"]
			},
		}));
});

/**
 * compile a single function.
 * 
 * @task {ts:compile}
 * @arg {function, -f} function name
 */
gulp.task("ts:compile", () => {
  const functionName = argv.f || argv.function;
  if (functionName) {
		process.chdir(path.join(__dirname, "..", "functions", path.basename(functionName)));
  }
  
  const tsResult = gulp.src(["**/*.ts", "!**/*.test.ts"])
      .pipe(sourcemaps.init())
      .pipe(tsProject());

  return merge([
      tsResult.dts.pipe(gulp.dest(".types")),
      tsResult.js.pipe(sourcemaps.write()).pipe(gulp.dest(".js")),
  ]);
});

/**
 * run tslint on typescript code
 * waiting on this PR to fix gulp-tslint to upgrade tslint to v5
 * https://github.com/panuhorsmalahti/gulp-tslint/pull/113
 * 
 * @task {ts:lint}
 * @arg {function, -f} function name
 * @arg {no-fix, -F} do not fix errors automatically
 */
gulp.task("ts:lint", () => {
  const functionName = argv.f || argv.function;
  if (functionName) {
		process.chdir(path.join(__dirname, "..", "functions", path.basename(functionName)));
  }
  
  const config = {
    tslint: require("tslint"),
    configuration: path.join(__dirname, "..", "tslint.json"),
    fix: argv["no-fix"] || argv.F ? false : true,
    formatter: "stylish",
  };
  
  return gulp.src("**/*.ts")
  .pipe(tslint(config))
  .pipe(tslint.report({
    emitError: true,
    reportLimit: 15,
    summarizeFailureOutput: true,
  }));
});

/**
 * clean compiled scripts
 * 
 * @task {ts:clean}
 * @arg {function, -f} function name
 */
gulp.task("ts:clean", () => {
	const functionName = argv.f || argv.function;
	if (functionName) {
		process.chdir(path.join(__dirname, "..", "functions", path.basename(functionName)));
	}

	return del([`**/.js`]);
});