import {assert, expect} from "chai";

import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {inject} from "../../../../src/testing/inject";
import {GlobalAcceptMimesMiddleware} from "../../../../src/mvc/components/GlobalAcceptMimesMiddleware";
import {FakeRequest} from "../../../helper/FakeRequest";
import {ServerSettingsService} from "../../../../src";

describe("GlobalAcceptMimesMiddleware :", () => {

    it("should accept mime", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const map = new Map<string, any>();
        map.set("acceptMimes", ["application/json"]);

        const middleware = new GlobalAcceptMimesMiddleware(new ServerSettingsService(map));
        const request = new FakeRequest();

        request.mime = "application/json";

        middleware.use(request);

    }));

    /*it('should accept mime', inject([MiddlewareService], (middlewareService: MiddlewareService) => {

     const middleware = middlewareService.invoke<AcceptMimeMiddleware>(AcceptMimeMiddleware);
     const request = new FakeRequest();

     request.mime = "application/json";

     middleware.use({
     getMetadata: () => {
     return undefined
     }
     } as any, request as any);

     }));*/

    it("should not accept mime", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        try {

            const map = new Map<string, any>();
            map.set("acceptMimes", ["application/xml"]);

            const middleware = new GlobalAcceptMimesMiddleware(new ServerSettingsService(map));
            const request = new FakeRequest();

            request.mime = "text/html";

            middleware.use(request);

        } catch (er) {
            expect(er.message).contains("You must accept content-type application/xml");
        }


    }));

});
