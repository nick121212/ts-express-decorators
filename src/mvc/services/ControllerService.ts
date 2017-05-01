/**
 * @module mvc
 */
/** */
import {$log} from "ts-log-debug";

import {Service} from "../../di/decorators/service";
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {nameOf} from "../../core/utils";
import {Inject} from "../../di";
import {ControllerProvider} from "../class/ControllerProvider";
import {IControllerRoute} from "../interfaces/ControllerRoute";
import {Type} from "../../core/interfaces/Type";
import {ControllerRegistry, ProxyControllerRegistry} from "../registries/ControllerRegistry";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {ParamsRegistry} from "../registries/ParamsRegistry";

/**
 * ControllerService manage all controllers declared with `@ControllerProvider` decorators.
 */
@Service()
export class ControllerService extends ProxyControllerRegistry {

    /**
     *
     * @param expressApplication
     */
    constructor(@Inject(ExpressApplication) private expressApplication: ExpressApplication) {
        super();
    }

    /**
     *
     * @param file
     * @returns {(endpoint:any)=>undefined}
     */
    static require(file): { classes: any, mapTo: Function } {
        const exportedClasses = require(file);

        const classes = Object
            .keys(exportedClasses)
            .map(clazzName => exportedClasses[clazzName])
            .filter(clazz => ControllerRegistry.has(clazz));

        return {
            classes,
            mapTo: (routerPath) =>
                classes.map(clazz =>
                    ControllerRegistry.get(clazz).pushRouterPath(routerPath)
                )
        };

    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): ControllerProvider =>
        ControllerRegistry.get(target);
    /**
     *
     * @param target
     * @param provider
     */
    static set(target: Type<any>, provider: ControllerProvider) {
        ControllerRegistry.set(target, provider);
        return this;
    }

    /**
     *
     * @param target
     */
    static has = (target: Type<any>) =>
        ControllerRegistry.has(target);

    /**
     * Invoke a controller from his Class.
     * @param target
     * @param locals
     * @returns {T}
     */
    /*public invoke<T>(target: any, locals: Map<Type<any>, any> = new Map<Type<any>, any>()): T {
     target = target.provide || target;
     return new ControllerBuilder(ControllerRegistry.get(target)).invoke<T>(locals);
     }*/

    /**
     * Load all controllers and mount routes to the ExpressApplication.
     * @param app
     */
    public load() {

        ControllerRegistry.forEach((provider: ControllerProvider) => {

            // console.log("Load =>", ctrl.className, ctrl.hasParent());

            if (!provider.hasParent()) {
                new ControllerBuilder(provider).build();

                provider.routerPaths.forEach(path => {
                    // console.log("Mount router ", ctrl.className, "to", ctrl.getEndpointUrl(path));
                    this.expressApplication.use(provider.getEndpointUrl(path), provider.router);
                });

            }
        });

        return this;
    }


    /**
     * Get all routes builded by TsExpressDecorators and mounted on Express application.
     * @returns {IControllerRoute[]}
     */
    public getRoutes(): IControllerRoute[] {

        let routes: IControllerRoute[] = [];

        this.forEach((provider: ControllerProvider) => {
            if (!provider.hasParent()) {

                provider.routerPaths.forEach(path => {
                    this.buildRoutes(routes, provider, provider.getEndpointUrl(path));
                });


            }
        });

        // ControllerService
        //     .controllers
        //     .forEach((finalCtrl: ControllerProvider) => {
        //         if (!finalCtrl.parent) {
        //             finalCtrl
        //                 .getMountEndpoints()
        //                 .map(endpoint => finalCtrl.getEndpointUrl(endpoint))
        //                 .forEach(endpoint => buildRoutes(finalCtrl, endpoint));
        //         }
        //     });

        // Sorts routes befores prints
        // routes = routes.sort(this.sort);

        return routes;
    }

    /**
     * Sort controllers infos.
     * @param routeA
     * @param routeB
     * @returns {number}
     */
    private sort = (routeA: IControllerRoute, routeB: IControllerRoute) => {

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
    };
    /**
     *
     * @param routes
     * @param ctrl
     * @param endpointUrl
     */
    private buildRoutes = (routes: any[], ctrl: ControllerProvider, endpointUrl: string) => {

        // console.log("Build routes =>", ctrl.className, endpointUrl);

        ctrl.dependencies
            .map(ctrl => this.get(ctrl))
            .forEach((provider: ControllerProvider) =>
                this.buildRoutes(routes, provider, `${endpointUrl}${provider.path}`)
            );

        ctrl.endpoints.forEach((endpoint: EndpointMetadata) => {

            if (endpoint.hasHttpMethod()) {

                const className = nameOf(ctrl.provide),
                    methodClassName = endpoint.methodClassName,
                    parameters = ParamsRegistry.getParams(ctrl.provide, endpoint.methodClassName),
                    returnType = endpoint.returnType;

                routes.push({
                    method: endpoint.httpMethod,
                    name: `${className}.${methodClassName}()`,
                    url: `${endpointUrl}${endpoint.path || ""}`,
                    className,
                    methodClassName,
                    parameters,
                    returnType
                });

            }
        });
    };

    /**
     * Print all route mounted in express via Annotation.
     */
    public printRoutes(logger: { info: (s) => void } = $log): void {

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