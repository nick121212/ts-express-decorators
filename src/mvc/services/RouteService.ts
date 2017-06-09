/**
 * @module mvc
 */
/** */
import {Service} from "../../di/decorators/service";
import {$log} from "ts-log-debug";
import {ControllerService} from "./ControllerService";
import {IControllerRoute} from "../interfaces/ControllerRoute";
import {ControllerProvider} from "../class/ControllerProvider";
import {EndpointMetadata} from "../class/EndpointMetadata";
import {nameOf} from "../../core/utils/index";
import {ParamsRegistry} from "../registries/ParamsRegistry";

/**
 * `RouteService` is used to provide all routes collected by annotation `@ControllerProvider`.
 */
@Service()
export class RouteService {

    constructor(private controllerService: ControllerService) {

    }

    /**
     * Get all routes builded by TsExpressDecorators and mounted on Express application.
     * @returns {IControllerRoute[]}
     */
    public getRoutes(): IControllerRoute[] {

        let routes: IControllerRoute[] = [];

        this.controllerService.forEach((provider: ControllerProvider) => {
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
            .map(ctrl => this.controllerService.get(ctrl))
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

    /**
     * Return all Routes stored in ControllerProvider manager.
     * @returns {IControllerRoute[]}
     */
    getAll(): IControllerRoute[] {
        return this.getRoutes();
    }

    /**
     * Print routes in console.
     */
    /*printRoutes(logger: { info: (s) => void } = $log) {
     return this.controllerService.printRoutes(logger);
     }*/
}
