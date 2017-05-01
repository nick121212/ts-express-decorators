/**
 * @module mvc
 */
/** */
import {Service} from "../../di/decorators/service";
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {$log} from "ts-log-debug";
import {getClassName} from "../../core/utils";
import {InjectorService} from "../../di/services/InjectorService";
import {CYCLIC_REF, UNKNOW_CONTROLLER} from "../../core/constants/errors-msgs";
import {Inject} from "../../di/decorators/inject";
import {RouterController} from "./RouterController";
import {Metadata} from "../../core/class/Metadata";
import {ControllerMetadata} from "../class/ControllerMetadata";
import {Endpoint} from "../class/Endpoint";
import {MiddlewareService} from "./MiddlewareService";
import {SendResponseMiddleware} from "../components/SendResponseMiddleware";
import {IControllerRoute} from "../interfaces/ControllerRoute";
import {EndpointParam} from "../class/EndpointParam";
import {CONTROLLER_DEPEDENCIES, CONTROLLER_SCOPE, CONTROLLER_URL} from "../constants";

/**
 * ControllerService manage all controllers declared with `@ControllerMetadata` decorators.
 */
@Service()
export class ControllerService {

    /**
     * Controllers registry.
     * @type {Array}
     */
    static controllers: Map<any, ControllerMetadata> = new Map<any, ControllerMetadata>();

    /**
     *
     * @param expressApplication
     */
    constructor (
        @Inject(ExpressApplication) private expressApplication: ExpressApplication
    ) {

    }

    /**
     *
     * @param target
     * @returns {ControllerMetadata}
     */
    static get(target: string | Function): ControllerMetadata {
        return this.controllers.get(target);
    }

    /**
     * Add new controller.
     * @param target
     * @param endpoint
     * @param dependencies
     * @param createInstancePerRequest
     * @returns {ControllerService}
     */
    static set(target: any, endpoint: string, dependencies: any[], createInstancePerRequest: boolean = false) {

        const ctrl = new ControllerMetadata(
            target,
            endpoint,
            dependencies,
            createInstancePerRequest
        );

        this.controllers.set(
            target,
            ctrl
        );

        return this;
    }

    /**
     * Load all controllers and mount routes to the ExpressApplication.
     * @param app
     */
    public load() {

        ControllerService
            .controllersFromMetadatas()
            .controllers
            .forEach(ctrl => ControllerService.resolveDependencies(ctrl));

        ControllerService
            .controllers
            .forEach(ctrl => ControllerService.mapEndpointsToRouters(ctrl));

        this.mountControllers();

        return this;
    }

    /**
     * Map all controllers collected by @ControllerMetadata annotation.
     */
    static controllersFromMetadatas() {

        const controllers = Metadata.getTargetsFromPropertyKey(CONTROLLER_URL);

        controllers
            .forEach((target: any) => {

                ControllerService.set(
                    target,
                    Metadata.get(CONTROLLER_URL, target),
                    Metadata.get(CONTROLLER_DEPEDENCIES, target),
                    Metadata.get(CONTROLLER_SCOPE, target)
                );


            });

        return ControllerService;
    }

    /**
     * Map all endpoints generated to his class Router.
     */
    static mapEndpointsToRouters(ctrl: ControllerMetadata) {

        ctrl.endpoints
            .forEach((endpoint: Endpoint) => {

                const middlewares = ControllerService.getMiddlewares(endpoint);

                if (endpoint.hasMethod() && ctrl.router[endpoint.getMethod()]) {

                    ctrl.router[endpoint.getMethod()](endpoint.getRoute(), ...middlewares);

                } else {
                    ctrl.router.use(...middlewares);
                }

            });

        ctrl.dependencies
            .forEach((ctrl: ControllerMetadata) => {
                ctrl.router.use(ctrl.endpointUrl, ctrl.router);
            });

        return ControllerService;
    }

    /**
     *
     * @param endpoint
     */
    static onRequest = (endpoint) =>
        (request, response, next) => {

            if (!response.headersSent) {
                response.setHeader("X-Managed-By", "TS-Express-Decorators");
            }

            request.getEndpoint = () => endpoint;

            request.storeData = function (data) {
                this._responseData = data;
                return this;
            };

            request.getStoredData = function (data) {
                return this._responseData;
            };

            next();
        };

    /**
     *
     * @returns {any[]}
     */
    static getMiddlewares(endpoint: Endpoint): any[] {

        const middlewareService = InjectorService.get<MiddlewareService>(MiddlewareService);
        const middlewaresBefore = endpoint.getBeforeMiddlewares();
        const middlewaresAfter = endpoint.getAfterMiddlewares();

        let middlewares: any[] = [];

        middlewares.push(this.onRequest(endpoint));

        /* BEFORE */
        middlewares = middlewares
            .concat(middlewaresBefore.map(middleware => middlewareService.bindMiddleware(middleware)))
            .concat(endpoint.middlewares.map(middleware => middlewareService.bindMiddleware(middleware)));

        /* METHOD */
        middlewares.push(middlewareService.bindMiddleware(
            endpoint.targetClass,
            endpoint.methodClassName,

            () => {
                const instance = InjectorService.get<ControllerService>(ControllerService).invoke(endpoint.targetClass);
                return instance[endpoint.methodClassName].bind(instance);
            }
        ));

        /* AFTER */
        middlewares = middlewares
            .concat(middlewaresAfter.map(middleware => middlewareService.bindMiddleware(middleware)));

        /* SEND */
        middlewares.push(middlewareService.bindMiddleware(SendResponseMiddleware));

        return middlewares.filter((item) => (!!item));
    }


    /**
     * Resolve all dependencies for each controllers
     * @param currentCtrl
     * @returns {ControllerMetadata}
     */
    static resolveDependencies(currentCtrl: ControllerMetadata): ControllerMetadata {

        currentCtrl.dependencies = currentCtrl
            .dependencies
            .map((dep: string | Function) => {

                const ctrl = ControllerService.get(<string | Function>dep);

                if (ctrl === undefined) {
                    throw new Error(UNKNOW_CONTROLLER(
                        typeof dep === "string" ? dep : getClassName(dep)
                    ));
                }

                ctrl.parent = currentCtrl;

                // PREVENT CYCLIC REFERENCES
                /* istanbul ignore next */
                if (ctrl.parent === currentCtrl && currentCtrl.parent === ctrl) {
                    throw new Error(CYCLIC_REF(
                        ctrl.getName(),
                        currentCtrl.getName()
                    ));
                }

                return ctrl;
            });


        return currentCtrl;
    }

    /**
     * Bind all root router ControllerMetadata to express Application instance.
     */
    private mountControllers() {

        ControllerService
            .controllers
            .forEach(finalCtrl => {

                if (!finalCtrl.parent) {

                    finalCtrl
                        .getMountEndpoints()
                        .forEach(endpoint => {
                            this.expressApplication.use(finalCtrl.getEndpointUrl(endpoint), finalCtrl.router);
                        });
                }

            });

        return this;
    }

    /**
     *
     * @param target
     * @returns {ControllerMetadata}
     */
    public get = (target: string | Function): ControllerMetadata => ControllerService.get(target);


    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @returns {T}
     */
    public invoke<T>(target: any, locals: Map<string | Function, any> = new Map<string | Function, any>()): T {
        return ControllerService.invoke<T>(target);
    }

    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @returns {T}
     */
    static invoke<T>(target: any, locals: Map<string | Function, any> = new Map<string | Function, any>()): T {

        target = target.targetClass || target;

        const controller: ControllerMetadata = this.get(target);

        if (controller.createInstancePerRequest || controller.instance === undefined) {
            locals.set(RouterController, new RouterController(controller.router));

            controller.instance = InjectorService.invoke<T>(target, locals);
        }

        return controller.instance;
    }

    /**
     *
     * @returns {IControllerRoute[]}
     */
    public getRoutes(): IControllerRoute[] {

        let routes: IControllerRoute[] = [];

        const buildRoutes = (ctrl: ControllerMetadata, endpointUrl: string) => {

            ctrl.dependencies.forEach((ctrl: ControllerMetadata) => buildRoutes(ctrl, `${endpointUrl}${ctrl.endpointUrl}`));

            ctrl.endpoints.forEach((endpoint: Endpoint) => {

                if (endpoint.hasMethod()) {

                    const className = getClassName(ctrl.targetClass),
                        methodClassName = endpoint.methodClassName,
                        parameters = EndpointParam.getParams(ctrl.targetClass, endpoint.methodClassName),
                        returnType = Metadata.getReturnType(ctrl.targetClass, endpoint.methodClassName);

                    routes.push({
                        method: endpoint.getMethod(),
                        name: `${className}.${methodClassName}()`,
                        url: `${endpointUrl}${endpoint.getRoute() || ""}`,
                        className,
                        methodClassName,
                        parameters,
                        returnType
                    });

                }
            });

        };

        ControllerService
            .controllers
            .forEach((finalCtrl: ControllerMetadata) => {

                if (!finalCtrl.parent) {
                    finalCtrl
                        .getMountEndpoints()
                        .map(endpoint => finalCtrl.getEndpointUrl(endpoint))
                        .forEach(endpoint => buildRoutes(finalCtrl, endpoint));
                }


            });


        routes = routes.sort((routeA: IControllerRoute, routeB: IControllerRoute) => {

            /* istanbul ignore next */
            if (routeA.url > routeB.url) {
                return 1;
            }

            /* istanbul ignore next */
            if (routeA.url < routeB.url) {
                return -1;
            }
            /* istanbul ignore next */
            return 0;
        });

        return routes;
    }

    /**
     * Print all route mounted in express via Annotation.
     */
    public printRoutes(logger: {info: (s) => void} = $log): void {

        const mapColor = {
            GET: (<any>"GET").green,
            POST: (<any>"POST").yellow,
            PUT: (<any>"PUT").blue,
            DELETE: (<any>"DELETE").red,
            PATCH: (<any>"PATCH").magenta,
            ALL: (<any>"ALL").cyan
        };

        const routes = this
            .getRoutes()
            .map(route => {

                const method = route.method.toUpperCase();

                route.method = <any>{length: method.length, toString: () => mapColor[method] || method};

                return route;
            });

        let str = $log.drawTable(routes, {
            padding: 1,
            header: {
                method: "Method",
                url: "Endpoint",
                name: "Class method"
            }
        });

        logger.info("\n" + str.trim());

    }
}