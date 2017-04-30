import {expect} from "chai";
import {EndpointParam} from "../../../src";
import {EXPRESS_REQUEST} from "src/mvc/constants";

class TestEndpointParam {
    method(arg1, arg2) {
    }
}

describe("EndpointParam :", () => {

    it("should get instance of injectParams", () => {

        const injectParams = EndpointParam.get(TestEndpointParam, "method", 0);

        expect(injectParams).to.be.instanceOf(EndpointParam);

    });

    it("should set info", () => {

        const injectParams = EndpointParam.get(TestEndpointParam, "method", 0);

        expect(injectParams).to.be.instanceOf(EndpointParam);

        injectParams.expression = "test";
        injectParams.service = EXPRESS_REQUEST;

        EndpointParam.set(TestEndpointParam, "method", 0, injectParams);


        const injectParamsStored = EndpointParam.get(TestEndpointParam, "method", 0);

        expect(injectParamsStored.service).to.equal(injectParams.service);
        expect(injectParamsStored.expression).to.equal(injectParams.expression);

    });

});