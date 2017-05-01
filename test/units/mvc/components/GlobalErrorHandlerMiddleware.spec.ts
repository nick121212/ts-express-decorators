import {expect} from "chai";
import {inject} from "../../../../src/testing/inject";
import {GlobalErrorHandlerMiddleware, MiddlewareService} from "../../../../src";
import {FakeResponse} from "../../../helper/FakeResponse";
import {FakeRequest} from "../../../helper/FakeRequest";
import {$log} from "ts-log-debug";


describe("GlobalErrorHandlerMiddleware :", () => {

    it("should do nothing if response is sent", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);

        const response = new FakeResponse();
        response["headersSent"] = true;

        middleware.use(
            new Error("test"),
            new FakeRequest() as any,
            response as any,
            () => ({})
        );

        expect(response._body).is.equal("");

    }));

    it("should respond error 404 with his message", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);
        const response = new FakeResponse();
        response["headersSent"] = false;

        middleware.use(
            "Message not found",
            new FakeRequest() as any,
            response as any,
            () => ({})
        );

        expect(response._body).is.equal("Message not found");
        expect(response._status).is.equal(404);

    }));

    it("should respond error 500 and Internal Error", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        $log.setRepporting({
            error: false
        });

        const middleware = middlewareService.invoke<GlobalErrorHandlerMiddleware>(GlobalErrorHandlerMiddleware);

        const response = new FakeResponse();
        response["headersSent"] = false;

        middleware.use(
            new Error(),
            new FakeRequest() as any,
            response as any,
            () => ({})
        );

        expect(response._body).is.equal("Internal Error");
        expect(response._status).is.equal(500);

        $log.setRepporting({
            error: true
        });

    }));
});
