/**
 * @module server
 */
/** */
import * as Express from "express";
import * as Http from "http";
import * as Https from "https";
import {$log} from "ts-log-debug";

import {Deprecated, ExpressApplication} from "../../core";
import {ServerSettingsProvider, ServerSettingsService} from "../services/ServerSettings";
import {InjectorService} from "../../di";

import {ControllerService, GlobalErrorHandlerMiddleware, MiddlewareService} from "../../mvc";

import {IServerMountDirectories, IServerSettings} from "../interfaces/ServerSettings";
import {IServerLifecycle} from "../interfaces/ServerLifeCycle";
import {IHTTPSServerOptions} from "../interfaces/HTTPSServerOptions";
import {HandlerBuilder} from "../../mvc/class/HandlerBuilder";
import {RouteService} from "../../mvc/services/RouteService";

/**
 * ServerLoader provider all method to instantiate an ExpressServer.
 *
 * It provide some features :
 *
 * * Middleware importation,
 * * Scan directory. You can specify controllers and services directory in your project,
 * * Error management (GlobalErrorHandler),
 * * Authentication strategy.
 *
 */
export abstract class ServerLoader implements IServerLifecycle {
    protected serverCodeName = "[TSED]";
    /**
     * Application express.
     * @type {core.Express}
     */
    private _expressApp: Express.Application = Express();
    /**
     *
     */
    private _settings: ServerSettingsProvider;
    private _settingsService: ServerSettingsService;
    /**
     * Instance of httpServer.
     */
    private _httpServer: Http.Server;
    /**
     * Instance of HttpsServer.
     */
    private _httpsServer: Https.Server;
    /**
     *
     */
    private _injectorService: InjectorService;

    /**
     *
     * @constructor
     */
    constructor() {

        // Configure the ExpressApplication factory.
        InjectorService.factory(ExpressApplication, this.expressApp);

        this._settings = new ServerSettingsProvider();
        this._settings.authentification = ((<any>this).isAuthenticated || (<any>this).$onAuth || new Function()).bind(this);

        const settings = ServerSettingsProvider.getMetadata(this);

        if (settings) {
            $log.debug(this.serverCodeName, "Autoload configuration from metadata");
            this.setSettings(settings);
        }
    }

    /**
     * Create a new HTTP server.
     * @returns {ServerLoader}
     */
    public createHttpServer(port: string | number): ServerLoader {
        this._httpServer = Http.createServer(<any> this._expressApp);
        this._settings.httpPort = port;
        return this;
    }

    /**
     * Create a new HTTPs server.
     * @param options
     * @returns {ServerLoader}
     */
    public createHttpsServer(options: IHTTPSServerOptions): ServerLoader {
        this._httpsServer = Https.createServer(options, this._expressApp);
        this._settings.httpsPort = options.port;
        return this;
    }

    /**
     * Mounts the specified middleware function or functions at the specified path. If path is not specified, it defaults to “/”.
     * @param args
     * @returns {ServerLoader}
     */
    public use(...args: any[]): ServerLoader {


        /* istanbul ignore else */
        if (this.injectorService) { // Needed to use middlewareInjector

            const middlewareService = this.injectorService.get<MiddlewareService>(MiddlewareService);

            args = args.map((arg) => {

                if (typeof arg === "function") {
                    arg = HandlerBuilder.from(arg).build();
                }

                return arg;
            });
        }

        this.expressApp.use(...args);

        return this;
    }

    /**
     * Proxy to express set
     * @param setting
     * @param val
     * @returns {ServerLoader}
     */
    public set(setting: string, val: any): ServerLoader {

        this.expressApp.set(setting, val);

        return this;
    }

    /**
     * Proxy to express engine
     * @param ext
     * @param fn
     * @returns {ServerLoader}
     */
    public engine(ext: string, fn: Function): ServerLoader {

        this.expressApp.engine(ext, fn);

        return this;
    }

    /**
     *
     * @returns {Promise<void>}
     */
    protected async loadSettingsAndInjector() {
        $log.setRepporting({debug: this.settings.get("debug")});

        $log.debug(this.serverCodeName, "Initialize settings");
        this._settingsService = this.getSettingsService();

        this._settingsService
            .forEach((value, key, map) => {
                $log.info(this.serverCodeName, `settings.${key} =>`, value);
            });

        $log.info(this.serverCodeName, "Build services");
        InjectorService.load();
        this._injectorService = InjectorService.get<InjectorService>(InjectorService);
    }

    /**
     * Initialize configuration of the express app.
     */
    protected async loadMiddlewares(): Promise<any> {

        await this.callHook("$onMountingMiddlewares", undefined, this.expressApp);

        const controllerService = this.injectorService.get<ControllerService>(ControllerService);
        const routeService = this.injectorService.get<RouteService>(RouteService);

        $log.info(this.serverCodeName, "Build controllers");
        controllerService.load();

        $log.info(this.serverCodeName, "Routes mounted :");
        routeService.printRoutes($log);

        this.mountStaticDirectories(this._settingsService.serveStatic);

        await this.callHook("$afterRoutesInit", undefined, this.expressApp);

        // Import the globalErrorHandler

        /* istanbul ignore next */
        if (this.hasHook("$onError")) {
            this.use(this["$onError"].bind(this));
        }

        this.use(GlobalErrorHandlerMiddleware);
    }

    /**
     *
     */
    protected getSettingsService(): ServerSettingsService {
        InjectorService.factory(ServerSettingsService, this.settings.$get());
        return InjectorService.get<ServerSettingsService>(ServerSettingsService);
    }

    /**
     *
     */
    protected setSettings(settings: IServerSettings) {

        this._settings.set(settings);

        const settingsService = this.getSettingsService();

        const bind = (property, value, map) => {

            switch (property) {
                case "mount":
                    Object.keys(settingsService.mount).forEach((key) => this.mount(key, value[key]));
                    break;

                case "componentsScan":
                    settingsService.componentsScan.forEach(componentDir => this.scan(componentDir));
                    break;

                case "httpPort":
                    /* istanbul ignore else */
                    if (this._httpServer === undefined) {
                        this.createHttpServer(value);
                    }

                    break;

                case "httpsPort":

                    /* istanbul ignore else */
                    if (this._httpsServer === undefined) {
                        this.createHttpsServer(Object.assign(map.get("httpsOptions") || {}, {port: value}));
                    }

                    break;
            }
        };


        settingsService
            .forEach((value, key, map) => {

                /* istanbul ignore else */
                if (value) {
                    bind(key, value, map);
                }
            });


    }

    /**
     * Binds and listen all ports (Http and/or Https). Run server.
     * @returns {Promise<any>|Promise}
     */
    public async start(): Promise<any> {
        const start = new Date();
        try {
            await this.callHook("$onInit");
            await this.loadSettingsAndInjector();
            await this.loadMiddlewares();
            await this.startServers();
            await this.callHook("$onReady");

            $log.info(this.serverCodeName, `Started in ${new Date().getTime() - start.getTime()} ms`);

        } catch (err) {
            return this.callHook("$onServerInitError", () => {
                $log.error(this.serverCodeName, "HTTP Server error", err);
            }, err);
        }
    }

    protected startServer(http, settings) {
        const {address, port} = settings;
        http.listen(+port, address);
        $log.debug(this.serverCodeName, `Start HTTP server on ${settings.address}:${settings.port}`);
        return new Promise((resolve, reject) =>
            http
                .on("listening", resolve)
                .on("error", reject)
        )
            .then(() => {
                $log.info(this.serverCodeName, `HTTP Server listen on ${settings.address}:${settings.port}`);
            });
    }

    /**
     * Initiliaze all servers.
     * @returns {Bluebird<U>}
     */
    private async startServers(): Promise<any> {
        const promises: Promise<any>[] = [];

        if (this.httpServer) {
            const settings = this._settingsService.getHttpPort();
            promises.push(this.startServer(
                this.httpServer,
                {https: false, ...settings}
            ));
        }

        if (this.httpsServer) {
            const settings = this._settingsService.getHttpsPort();
            promises.push(this.startServer(
                this.httpsServer,
                {https: false, ...settings}
            ));
        }

        return Promise.all<any>(promises);
    }

    /**
     * Set the port for http server.
     * @param port
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setHttpPort() is deprecated. Use ServerLoader.settings.port instead of.")
    /* istanbul ignore next */
    public setHttpPort(port: number | string): ServerLoader {

        this._settings.httpPort = port;

        return this;
    }

    /**
     * Set the port for https server.
     * @param port
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setHttpsPort() is deprecated. Use ServerLoader.settings.httpsPort instead of.")
    /* istanbul ignore next */
    public setHttpsPort(port: number | string): ServerLoader {

        this._settings.httpsPort = port;

        return this;
    }

    /**
     * Change the global endpoint path.
     * @param endpoint
     * @returns {ServerLoader}
     */
    @Deprecated("ServerLoader.setEndpoint() is deprecated. Use ServerLoader.mount() instead of.")
    /* istanbul ignore next */
    public setEndpoint(endpoint: string): ServerLoader {

        this._settings.endpoint = endpoint;

        return this;
    }

    /**
     * Configure and the directory to find controllers. All controller are mounted on the global endpoint.
     * @param path
     * @param endpoint
     * @returns {ServerLoader}
     */
    public scan(path: string, endpoint: string = this._settings.endpoint): ServerLoader {

        let files: string[] = require("glob").sync(path.replace(/\\/gi, "/"));
        let nbFiles = 0;

        $log.info(this.serverCodeName, `Scan files : ${path}`);


        files
            .forEach(file => {
                nbFiles++;

                try {

                    $log.debug(this.serverCodeName, `Import file ${endpoint}:`, file);
                    ControllerService
                        .require(file)
                        .mapTo(endpoint);

                } catch (er) {
                    /* istanbul ignore next */
                    $log.error(er);
                }

            });


        return this;
    }

    @Deprecated("ServerLoader.onError() is deprecated. Use your own middleware instead of.")
    /* istanbul ignore next */
    public onError() {

    }

    /**
     * Mount all controllers under the `path` parameters to the specified `endpoint`.
     * @param endpoint
     * @param path
     * @returns {ServerLoader}
     */
    public mount(endpoint: string, path: string): ServerLoader {

        this.scan(path, endpoint);

        return this;
    }

    /**
     * Mount statics files in a directories.
     * @param mountDirectories
     * @returns {ServerLoader}
     */
    public mountStaticDirectories(mountDirectories: IServerMountDirectories): ServerLoader {

        /* istanbul ignore else */

        if (mountDirectories) {
            if (require.resolve("serve-static")) {
                const serveStatic = require("serve-static");

                Object.keys(mountDirectories).forEach(key => {
                    this.use(key, (request, response, next) => {
                        /* istanbul ignore next */
                        if (!response.headersSent) {
                            serveStatic(mountDirectories[key])(request, response, next);
                        } else {
                            next();
                        }
                    });
                });

            }
        }


        return this;
    }

    /**
     *
     * @param key
     * @param elseFn
     * @param args
     * @returns {any}
     */
    private callHook = (key, elseFn = new Function, ...args) => {

        if (key in this) {
            $log.debug(this.serverCodeName, `Call hook ${key}()`);
            return this[key](...args);
        }

        return elseFn();
    };
    /**
     *
     * @param key
     */
    private hasHook = (key) => !!this[key];

    /**
     * Return the settings provider.
     * @returns {ServerSettingsProvider}
     */
    get settings(): ServerSettingsProvider {
        return this._settings;
    }

    /**
     * Return Express Application instance.
     * @returns {core.Express}
     */
    get expressApp(): Express.Application {
        return this._expressApp;
    }

    /**
     * Return the injectorService initialized by the server.
     * @returns {InjectorService}
     */
    get injectorService(): InjectorService {
        return this._injectorService;
    }

    /**
     * Return Http.Server instance.
     * @returns {Http.Server}
     */
    get httpServer(): Http.Server {
        return this._httpServer;
    }

    /**
     * Return Https.Server instance.
     * @returns {Https.Server}
     */
    get httpsServer(): Https.Server {
        return this._httpsServer;
    }
}