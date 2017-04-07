
import { handler } from "./main";

describe("hello handler", () => {

	it("returns a hello world proxy response", async () => {
		const fn = jest.fn();
		await handler(null, null, fn);

		const call = fn.mock.calls[0];
		expect(call[0]).toBeUndefined();
		expect(call[1]).toBeDefined();
		expect(call[1].statusCode).toEqual(200);

		const body = JSON.parse(call[1].body);
		expect(body.hello).toEqual("from typescript!");
	});

});
