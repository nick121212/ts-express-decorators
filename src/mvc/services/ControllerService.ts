/**
 * @module mvc
 */
/** */
import * as Express from "express";
import {Service} from "../../di/decorators/service";
import {ExpressApplication} from "../../core/services/ExpressApplication";
import {Inject} from "../../di";
import {ControllerProvider} from "../class/ControllerProvider";
import {Type} from "../../core/interfaces/Type";
import {ControllerRegistry, ProxyControllerRegistry} from "../registries/ControllerRegistry";
import {ControllerBuilder} from "../class/ControllerBuilder";
import {InjectorService} from "../../di/services/InjectorService";
import {RouterController} from "./RouterController";

/**
 * ControllerService manage all controllers declared with `@ControllerProvider` decorators.
 */
@Service()
export class ControllerService extends ProxyControllerRegistry {

    /**
     *
     * @param expressApplication
     * @param injectorService
     */
    constructor(private injectorService: InjectorService, @Inject(ExpressApplication) private expressApplication: ExpressApplication) {
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
     * @param designParamTypes
     * @returns {T}
     */
    public invoke<T>(target: any, locals: Map<Type<any>, any> = new Map<Type<any>, any>(), designParamTypes?: any[]): T {

        if (!locals.has(RouterController)) {
            locals.set(RouterController, new RouterController(Express.Router()));
        }

        return this.injectorService.invoke<T>(target.provide || target, locals, designParamTypes);
    }


    /**
     * Load all controllers and mount routes to the ExpressApplication.
     * @param app
     */
    public load() {

        ControllerRegistry.forEach((provider: ControllerProvider) => {

            if (!provider.hasParent()) {
                new ControllerBuilder(provider).build();

                provider.routerPaths.forEach(path => {
                    this.expressApplication.use(provider.getEndpointUrl(path), provider.router);
                });

            }
        });

        return this;
    }

}