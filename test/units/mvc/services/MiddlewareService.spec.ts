// import {assert, expect} from "chai";
// import * as Sinon from "sinon";
// import * as Proxyquire from "proxyquire";
//
// import {
//     BodyParams, Controller, Get, IMiddleware, IMiddlewareError, Middleware, MiddlewareError, MiddlewareService, Next,
//     Request
// } from "../../../../src";
// import {inject} from "../../../../src/testing/inject";
// import {Done} from "../../../../src/testing/done";
// import {FakeRequest} from "../../../helper/FakeRequest";
// import {MiddlewareType} from "../../../../src/mvc/interfaces/Middleware";
// import {SendResponseMiddleware} from "../../../../src/mvc/components/SendResponseMiddleware";
// import {FakeResponse} from "../../../helper/FakeResponse";
//
// @Middleware()
// class MiddlewareTest implements IMiddleware {
//     use(request, response, next) {
//         request.test = "test";
//         next();
//     }
// }
//
// @Middleware()
// class MiddlewareInjTest implements IMiddleware {
//     use(@Request() request, @Next() next) {
//         request.test = "test";
//         next();
//     }
// }
//
// @Middleware()
// class MiddlewareTest2 implements IMiddleware {
//     use(request, response) {
//         request.test = "test";
//     }
// }
//
// @MiddlewareError()
// class MiddlewareTestError implements IMiddlewareError {
//     use(err, request, response, next) {
//         request.test = "test";
//         next();
//     }
// }
//
// @MiddlewareError()
// class MiddlewareTestError2 implements IMiddlewareError {
//     use(err, request, response) {
//         request.test = "test";
//     }
// }
//
// @Controller("/test")
// class EndpointCtrl implements IMiddlewareError {
//
//     @Get("/")
//     get(@Request() request) {
//         request.test = "test";
//     }
//
//     @Get("/test")
//     getByExpr(@BodyParams("test") test: string) {
//         return Promise.resolve("test");
//     }
// }
//
// xdescribe("MiddlewareService", () => {
//
//     before(inject([MiddlewareService], (middlewareService) => {
//         this.middlewareService = middlewareService;
//         this.nextSpy = Sinon.spy();
//         this.response = new FakeResponse();
//         this.request = new FakeRequest();
//     }));
//
//     after(() => {
//         delete this.middlewareService;
//         delete this.nextStub;
//         delete this.response;
//         delete this.request;
//     });
//
//     describe("bindMiddleware()", () => {
//
//         describe("when middleware is notInjectable", () => {
//
//             it("should bind a middleware not injectable (3 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 function mdlw(request, response, next) {
//                     expect(request).to.be.an("object");
//                     request.test = "test";
//
//                     next();
//                 }
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
//                 const settings = middlewareService.createSettings(mdlw);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//
//             }));
//
//             it("should bind a middleware not injectable and catch error (3 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(e.message).to.equal("test");
//                     done();
//                 };
//
//                 function mdlw(request, response, next) {
//                     throw new Error("test");
//                 }
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
//                 const settings = middlewareService.createSettings(mdlw);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.hasNextFn).to.equal(true);
//                 expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//             }));
//
//             it("should bind a middlewareError not injectable (4 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 function mdlw(err, request, response, next) {
//                     expect(err.message).to.equal("test");
//                     expect(request).to.be.an("object");
//                     request.test = "test";
//
//                     next();
//                 }
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
//                 const settings = middlewareService.createSettings(mdlw);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.hasNextFn).to.equal(true);
//                 expect(settings.type).to.equal(MiddlewareType.ERROR);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(new Error("test"), request, response, next);
//             }));
//
//             it("should bind a middlewareError not injectable and catch error (4 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(e.message).to.equal("test");
//                     done();
//                 };
//
//                 function mdlw(err, request, response, next) {
//                     expect(err.message).to.equal("test");
//                     throw new Error("test");
//                 }
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
//                 const settings = middlewareService.createSettings(mdlw);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.hasNextFn).to.equal(true);
//                 expect(settings.type).to.equal(MiddlewareType.ERROR);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(new Error("test"), request, response, next);
//             }));
//
//             it("should bind a middleware not injectable (2 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 function mdlw(request, response) {
//                     expect(request).to.be.an("object");
//                     request.test = "test";
//                 }
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(mdlw);
//                 const settings = middlewareService.createSettings(mdlw);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.hasNextFn).to.equal(false);
//                 expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//             }));
//
//
//             /// MIDDLEWARE
//
//             it("should bind a middleware decorated, (3 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTest);
//                 const settings = middlewareService.createSettings(MiddlewareTest);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//
//             }));
//
//             it("should bind a middleware decorated, (2 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     try {
//                         expect(request).to.be.an("object");
//                         expect(request.test).to.equal("test");
//                     } catch (er) {
//                         console.warn(er);
//                     }
//
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTest2);
//                 const settings = middlewareService.createSettings(MiddlewareTest2);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//
//             }));
//
//             it("should bind a middlewareError decorated, (4 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     try {
//                         expect(request).to.be.an("object");
//                         expect(request.test).to.equal("test");
//                     } catch (er) {
//                         console.error(er);
//                     }
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTestError);
//                 const settings = middlewareService.createSettings(MiddlewareTestError);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.type).to.equal(MiddlewareType.ERROR);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(new Error("test"), request, response, next);
//
//             }));
//
//             it("should bind a middlewareError decorated, (3 params)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "less"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareTestError2);
//                 const settings = middlewareService.createSettings(MiddlewareTestError2);
//
//                 expect(settings.injectable).to.equal(false);
//                 expect(settings.type).to.equal(MiddlewareType.ERROR);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(new Error("test"), request, response, next);
//
//             }));
//
//
//         });
//
//
//         describe("injectable", () => {
//
//             it("should bind a middleware decorated", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "test"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(MiddlewareInjTest);
//                 const settings = middlewareService.createSettings(MiddlewareInjTest);
//
//
//                 expect(settings.injectable).to.equal(true);
//                 expect(settings.type).to.equal(MiddlewareType.MIDDLEWARE);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next)
//                     .catch(err => console.error(err));
//
//             }));
//
//             it("should bind an endpoint decorated", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = {test: "test"}, response: any = {};
//
//                 const next = (e) => {
//                     expect(request).to.be.an("object");
//                     expect(request.test).to.equal("test");
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(EndpointCtrl, "get");
//                 const settings = middlewareService.createSettings(EndpointCtrl, "get");
//
//                 expect(settings.injectable).to.equal(true);
//                 expect(settings.type).to.equal(MiddlewareType.ENDPOINT);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//
//             }));
//
//             it("should bind an endpoint decorated (2)", inject([MiddlewareService, Done], (middlewareService, done) => {
//
//                 const request: any = new FakeRequest(), response: any = {};
//
//                 const next = (e) => {
//                     try {
//                         expect(request).to.be.an("object");
//                         expect(request.getStoredData()).to.equal("test");
//                     } catch (er) {
//                         console.warn(er);
//                     }
//                     done();
//                 };
//
//                 const wrappedMdlw = middlewareService.bindMiddleware(EndpointCtrl, "getByExpr");
//                 const settings = middlewareService.createSettings(EndpointCtrl, "getByExpr");
//
//                 expect(settings.injectable).to.equal(true);
//                 expect(settings.type).to.equal(MiddlewareType.ENDPOINT);
//                 expect(wrappedMdlw).to.be.a("function");
//
//                 wrappedMdlw(request, response, next);
//
//             }));
//
//
//         });
//
//
//         it("should invoke middleware", () => {
//
//             expect(MiddlewareService.invoke<any>(SendResponseMiddleware)).not.to.be.undefined;
//
//         });
//     });
//
// });