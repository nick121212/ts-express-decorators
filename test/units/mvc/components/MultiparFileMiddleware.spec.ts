import {expect} from "chai";
import {MiddlewareService} from "../../../../src/mvc/services/MiddlewareService";
import {inject} from "../../../../src/testing/inject";
import {MultipartFileMiddleware} from "../../../../src/mvc/components/MultipartFileMiddleware";
import {FakeRequest} from "../../../helper/FakeRequest";
import {FakeResponse} from "../../../helper/FakeResponse";

describe("MultipartFileMiddleware :", () => {

    it("should use multer", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<MultipartFileMiddleware>(MultipartFileMiddleware);

        (middleware as any).multer = () => ({
            any: () => {
                return () => {
                    return "test";
                };
            }
        });

        const request = new FakeRequest();
        const response = new FakeResponse();
        const fakeEndpoint = {
            getMetadata: () => {
            }
        };

        const result = middleware.use(fakeEndpoint as any, request as any, response, () => {
        });

        expect(result).to.equal("test");
    }));

    it("should do nothing", inject([MiddlewareService], (middlewareService: MiddlewareService) => {

        const middleware = middlewareService.invoke<MultipartFileMiddleware>(MultipartFileMiddleware);
        delete (middleware as any).multer;

        const request = new FakeRequest();
        const response = new FakeResponse();
        const fakeEndpoint = {
            getMetadata: () => {
            }
        };

        const result = middleware.use(fakeEndpoint as any, request as any, response, () => {
        });

        expect(!!result).to.be.false;
    }));


});

