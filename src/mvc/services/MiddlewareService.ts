/**
 * @module mvc
 */ /** */

import {$log} from "ts-log-debug";

import {EnvTypes, Type} from "../../core";

import {ServerSettingsService} from "../../server/services/ServerSettings";
import {Service} from "../../di/decorators/service";
import {IMiddleware} from "../interfaces";

import {MiddlewareRegistry, ProxyMiddlewareRegistry} from "../registries/MiddlewareRegistry";
import {MiddlewareProvider} from "../class/MiddlewareProvider";
import {InjectorService} from "../../di/services/InjectorService";


/**
 *
 */
@Service()
export class MiddlewareService extends ProxyMiddlewareRegistry {

    constructor(private serverSettings: ServerSettingsService) {
        super();
    }

    /**
     *
     */
    $afterServicesInit() {

        if (this.serverSettings.env !== EnvTypes.TEST) {
            $log.info("[TSED] Import mvc");
        }
        InjectorService.buildRegistry(MiddlewareRegistry);
    }

    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): MiddlewareProvider =>
        MiddlewareRegistry.get(target);

    /**
     *
     * @param target
     * @param provider
     */
    static set(target: Type<any>, provider: MiddlewareProvider) {
        MiddlewareRegistry.set(target, provider);
        return this;
    }

    /**
     *
     * @param target
     */
    static has = (target: Type<any>): boolean =>
        MiddlewareRegistry.has(target);

    /**
     *
     * @param target
     * @returns {T}
     */
    static invoke<T extends IMiddleware>(target: Type<T>): T {
        const provider = MiddlewareRegistry.get(target);
        provider.instance = InjectorService.invoke(provider.useClass);
        return provider.instance;
    }

    /**
     *
     * @param target
     * @returns {T}
     */
    invoke<T extends IMiddleware>(target: Type<T>): T {
        return MiddlewareService.invoke<T>(target);
    }
}