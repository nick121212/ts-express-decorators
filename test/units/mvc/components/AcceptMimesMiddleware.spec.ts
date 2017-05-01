import {expect} from "chai";
import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {AcceptMimesMiddleware} from "../../../../src/mvc/components/AcceptMimesMiddleware";
import {FakeRequest} from "../../../helper/FakeRequest";
import {inject} from "../../../../src/testing/inject";

describe("AcceptMimesMiddleware :", () => {

    it("should accept mime", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use({
            getMetadata: () => {
                return ["application/json"];
            }
        } as any, request as any);

    }));

    it("should accept mime", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use({
            getMetadata: () => {
                return undefined;
            }
        } as any, request as any);

    }));

    it("should not accept mime", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        try {
            const middleware = middlewareService.invoke<AcceptMimesMiddleware>(AcceptMimesMiddleware);
            const request = new FakeRequest();

            request.mime = "application/json";

            middleware.use({
                getMetadata: () => {
                    return ["application/xml"];
                }
            } as any, request as any);
        } catch (er) {
            expect(er.message).contains("You must accept content-type application/xml");
        }


    }));

});