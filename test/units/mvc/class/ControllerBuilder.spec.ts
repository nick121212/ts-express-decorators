import {expect, Sinon} from "./../../../tools";
import * as Proxyquire from "proxyquire";
import {ControllerProvider} from "../../../../src/mvc/class/ControllerProvider";

import {EndpointRegistry} from "../../../../src/mvc/registries/EndpointRegistry";
import {EndpointBuilder} from "../../../../src/mvc/class/EndpointBuilder";
import {inject} from "../../../../src/testing/inject";

class Test {
}

class ChildrenTest {
}

const EndpointBuilderStub = Sinon.spy(function () {
    return Sinon.createStubInstance(EndpointBuilder);
});

const ControllerRegistryStub = {
    get: Sinon.stub().returns(new ControllerProvider(ChildrenTest))
};

const {ControllerBuilder} = Proxyquire("../../../../src/mvc/class/ControllerBuilder", {
    "./EndpointBuilder": {EndpointBuilder: EndpointBuilderStub},
    "../registries/ControllerRegistry": {ControllerRegistry: ControllerRegistryStub}
});

describe("ControllerBuilder", () => {

    describe("without dependencies", () => {
        before(inject([], () => {
            this.controllerMetadata = new ControllerProvider(Test);
            this.controllerMetadata.path = "/test";
            this.controllerBuilder = new ControllerBuilder(this.controllerMetadata);

            EndpointRegistry.use(Test, "test", ["get", "/"]);

            Sinon.stub(this.controllerMetadata.router, "use");
            Sinon.stub(this.controllerMetadata.router, "get");

            this.controllerBuilder.build();
        }));

        after(() => {
            delete this.controllerMetadata;
            delete this.controllerBuilder;
        });

        it("should do something", () => {
            expect(!!this.controllerBuilder).to.be.true;
        });

        it("should build controller (get)", () => {
            this.controllerMetadata.router.get.calledWith("/");
        });

        it("should create new EndpointBuilder", () => {
            expect(EndpointBuilderStub).to.have.been.calledWithNew;
        });

    });

    describe("with dependencies", () => {
        before(inject([], () => {
            this.controllerMetadata = new ControllerProvider(Test);
            this.controllerMetadata.path = "/test";
            this.controllerMetadata.dependencies = [ChildrenTest];
            this.controllerBuilder = new ControllerBuilder(this.controllerMetadata);

            EndpointRegistry.use(Test, "test", ["get", "/"]);

            Sinon.stub(this.controllerMetadata.router, "use");
            Sinon.stub(this.controllerMetadata.router, "get");

            this.controllerBuilder.build();
        }));

        after(() => {
            delete this.controllerMetadata;
            delete this.controllerBuilder;
        });

        it("should do something", () => {
            expect(!!this.controllerBuilder).to.be.true;
        });

        it("should build controller (get)", () => {
            this.controllerMetadata.router.get.calledWith("/");
        });

        it("should create new EndpointBuilder", () => {
            expect(EndpointBuilderStub).to.have.been.calledWithNew;
        });

    });

});