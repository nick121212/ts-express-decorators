import {expect} from "chai";
import {FakeRequest} from "../../../helper";
import {inject} from "../../../../src/testing";
import {HeaderParamsFilter} from "../../../../src/filters/components/HeaderParamsFilter";
import {FakeResponse} from "../../../helper/FakeResponse";
import {FilterService} from "../../../../src";

describe("FilterService", () => {

    before(inject([FilterService], (filterService: FilterService) => {
        this.filterService = filterService;
    }));

    describe("invokeMethod()", () => {
        it("should invoke method from a filter", () => {
            expect(this.filterService.invokeMethod(
                HeaderParamsFilter,
                "x-token",
                new FakeRequest,
                new FakeResponse
            )).to.equal("headerValue");
        });

    });

    describe("forEach()", () => {
        it("should loop on registry", () => {
            const list = [];
            this.filterService.forEach((f) => list.push(f));
            expect(!!list.length).to.be.true;
        });
    });

    describe("set()", () => {
        it("should set a filter", () => {
            const headerFilter = new HeaderParamsFilter();
            this.filterService.set(HeaderParamsFilter, {instance: headerFilter});
            expect(this.filterService.get(HeaderParamsFilter).instance).to.equals(headerFilter);
        });

        xit("should set custom filter", () => {
            /*const instance = new HeaderParamsFilter();

             FilterService.set({
             provide: HeaderParamsFilter,
             useClass: HeaderParamsFilter,
             instance,
             type: "filter"
             });
             expect(this.filterService.get(HeaderParamsFilter).instance).to.equals(instance);*/
        });
    });

    describe("size()", () => {
        it("should return size", () => {
            expect(!!this.filterService.size).to.be.true;
        });
    });
});