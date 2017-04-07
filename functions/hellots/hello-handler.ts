
import debug from "debug";
const logInfo = debug("functions:hello");

export const handler: AWSLambda.ProxyHandler = async (
	event: AWSLambda.APIGatewayEvent,
	ctx: AWSLambda.Context,
	callback?: AWSLambda.ProxyCallback,
): Promise<void> => {
	const body: object = { hello: "from typescript!" };
	logInfo("body: %o", body);

	const headers = {
		"Content-Type": "application/json",
	};

	const res: AWSLambda.ProxyResult = {
		body: JSON.stringify(body),
		headers,
		statusCode: 200,
	};

	if (!callback) {
		ctx.succeed(res);
		return;
	}

	callback(undefined, res);
	return;
};
