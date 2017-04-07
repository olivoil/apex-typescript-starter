const appRoot = require("app-root-path");
const typescript = require("typescript");
const babelJest = require("babel-jest");

const tsConfig = require(`${appRoot.path}/tsconfig.json`);

module.exports = {
	process(src, path) {
		const isTypeScript = path.endsWith(".ts") || path.endsWith(".tsx");
		const isJavaScript = path.endsWith(".js") || path.endsWith(".jsx");

		if (isTypeScript) {
			src = typescript.transpile(
				src,
				tsConfig.compilerOptions,
				path, []
			);
		}

		if (isJavaScript || isTypeScript) {
			// babel-jest hack for transpile src without file
			const fileName = isJavaScript ? path : "file.js";

			// apply a custom babel config, as the one in .babelrc is for use with rollup
			const transformer = babelJest.createTransformer({
				"plugins": ["transform-runtime"],
				"presets": [
					["env", {
						"modules": "commonjs",
						"targets": {
							"node": ["6.10"]
						}
					}]
				]
			});

			src = transformer.process(src, fileName);
		}

		return src;
	},
};
