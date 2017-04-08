const appRoot = require("app-root-path");
const ts = require("typescript");
const babelJest = require("babel-jest");

const tsConfig = require(`${appRoot.path}/tsconfig.json`);

module.exports = {
	process(src, path) {
		const isTypeScript = path.endsWith(".ts") || path.endsWith(".tsx");
		const isJavaScript = path.endsWith(".js") || path.endsWith(".jsx");

		if (isTypeScript) {
			const res = ts.transpileModule(src, {
				compilerOptions: tsConfig.compilerOptions,
				fileName: path,
			    reportDiagnostics: true
			});
			
			if (res.diagnostics && res.diagnostics.length) {
	            collectErrorMessages(res.diagnostics).forEach(console.log);
	            throw new Error(`${res.diagnostics.length} typescript errors in ${path}`);
			} else {
				src = res.outputText;
			}
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

function collectErrorMessages(diagnostics) {
    const errorMessages = [];

	diagnostics.forEach(diagnostic => {
        let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            errorMessages.push(`  Error ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        }
        else {
        	errorMessages.push(`  Error: ${message}`);
        }
    });
    
    return errorMessages;
}
