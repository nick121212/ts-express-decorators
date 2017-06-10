import * as Proxyquire from "proxyquire";
import {Sinon} from "../../tools";
import {ServerSettings} from "../../../src/server/decorators/serverSettings";
const {ServerLoader} = Proxyquire("../../../src/server/components/ServerLoader", {
    "http": {},
    "https": {}
});


describe("ServerLoader", () => {
    before(() => {
        class TestServer extends ServerLoader {

        }
        this.getMetadataStub = Sinon.stub(ServerSettings, "getMetadata");
        this.getMetadataStub.returns({});

        this.server = new TestServer();
    });
    after(() => {
        this.getMetadataStub.restore();
    });

    it("start()", () => {

    });
});


// import {assert, expect} from "chai";
// import {ServerLoader, ServerSettingsService} from "../../../src";
// import {FakeServer} from "../../helper";
// import {$log} from "ts-log-debug";
//
// xdescribe("ServerLoader()", () => {
//
//     describe("ServerLoader.start", () => {
//
//         it("should start", (done) => {
//
//             const server: any = new FakeServer();
//
//             server.createHttpServer(8000);
//             server.setHttpPort(8000);
//
//             server.startServers = function () {
//             };
//
//             server.$onReady = function () {
//                 expect(this.expressApp).to.be.an("function");
//             };
//             server.$onInit = function () {
//             };
//
//             const promise = server.start();
//
//             // console.log('Promise', typeof promise);
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 done();
//             });
//
//         });
//
//         it("should errored", (done) => {
//
//             const server: any = new FakeServer();
//
//             // server.createHttpServer(8000);
//             // server.setHttpPort(8000);
//
//             $log.setRepporting({
//                 error: false
//             });
//
//             server.startServers = function () {
//                 throw new Error();
//             };
//
//             const promise = server.start();
//
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 $log.setRepporting({
//                     error: true
//                 });
//                 done();
//             });
//
//         });
//
//         it("should errored (2)", (done) => {
//
//             const server: any = new FakeServer();
//
//             server.createHttpServer(8000);
//             server.setHttpPort(8000);
//             server.startServers = function () {
//                 throw new Error();
//             };
//             server.$onServerInitError = function () {
//             };
//             const promise = server.start();
//
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 done();
//             });
//
//         });
//
//
//         it("should start httpServer", (done) => {
//
//             const server: any = new FakeServer();
//
//             server.createHttpServer(8000);
//
//             server.setHttpPort(8000);
//
//             const promise = server.startServers();
//
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 done();
//             });
//
//             server.httpServer.fire("listening");
//
//         });
//
//         it("should start and catch error", (done) => {
//
//             const server: any = new FakeServer();
//
//             server.createHttpServer(8000);
//
//             server.setHttpPort(8000);
//
//             const promise = server.startServers();
//
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 assert.ok(false);
//             }, () => {
//                 done();
//             });
//
//             server.httpServer.fire("error");
//
//         });
//
//         it("should start httpsServer", (done) => {
//
//             const server: any = new FakeServer();
//
//             server.createHttpsServer(8000);
//
//             server.setHttpsPort(8000);
//
//             const promise = server.startServers();
//
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 done();
//             });
//
//             server.httpsServer.fire("listening");
//
//         });
//
//         it("should start and catch error", (done) => {
//
//             const server: any = new FakeServer();
//
//             server.createHttpsServer(8000);
//
//             server.setHttpsPort(8000);
//
//             const promise = server.startServers();
//
//             expect(typeof promise).to.equal("object");
//             expect(promise.then).to.be.an("function");
//
//             promise.then(() => {
//                 assert.ok(false);
//             }, () => {
//                 done();
//             });
//
//             server.httpsServer.fire("error");
//
//         });
//
//     });
//
//     describe("ServerLoader.set()", () => {
//         it("should set a value", () => {
//             const settings = {};
//             const serverLoader = new FakeServer();
//
//             (serverLoader as any)._expressApp = {
//                 set: (k, v) => {
//                     settings[k] = v;
//                 }
//             };
//
//             serverLoader.set("view engine", "html");
//
//             expect(settings["view engine"]).to.equal("html");
//         });
//     });
//
//     describe("ServerLoader.engine()", () => {
//         it("should set a value", () => {
//             const settings = {};
//             const serverLoader = new FakeServer();
//
//             (serverLoader as any)._expressApp = {
//                 engine: (k, v) => {
//                     settings[k] = v;
//                 }
//             };
//
//             serverLoader.engine("view engine", () => {
//             });
//
//             expect(settings["view engine"]).to.be.a("function");
//         });
//     });
//
//     describe("ServerSettingsService.buildAddressAndPort()", () => {
//
//         it("should build default address and use port given as parameters", () => {
//
//             const {address, port} = (ServerSettingsService as any).buildAddressAndPort(8080);
//
//             expect(address).to.equal("0.0.0.0");
//             expect(port).to.equal(8080);
//
//         });
//
//         it("should build address and port", () => {
//
//             const {address, port} = (ServerSettingsService as any).buildAddressAndPort("127.0.0.1:8080");
//
//             expect(address).to.equal("127.0.0.1");
//             expect(port).to.equal(8080);
//
//         });
//
//     });
//
//     describe("ServerSettingsService.setEndpoint()", () => {
//         it("should set the default endpoint", () => {
//
//             const serverLoader = new FakeServer();
//             serverLoader.setEndpoint("/rest");
//
//             expect((serverLoader as any)._settings.map.get("endpointUrl")).to.equals("/rest");
//
//         });
//     });
// });