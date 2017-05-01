/**
 * @module filters
 */
/** */
import {Service} from "../../di/decorators/service";
import {ServerSettingsService} from "../../server/services/ServerSettings";
import {$log} from "ts-log-debug";
import {IFilter} from "../interfaces";
import {Type} from "../../core/interfaces/Type";
import {EnvTypes} from "../../core/interfaces/Env";
import {FilterRegistry, ProxyFilterRegistry} from "../registries/FilterRegistry";
import {FilterProvider} from "../class/FilterProvider";
import {InjectorService} from "../../di/services/InjectorService";
import {IProvider} from "../../di/interfaces/Provider";
/**
 *
 */
@Service()
export class FilterService extends ProxyFilterRegistry {

    constructor(private serverSettings: ServerSettingsService) {
        super();
    }

    /**
     *
     */
    $afterServicesInit() {

        /* istanbul ignore next */
        if (this.serverSettings.env !== EnvTypes.TEST) {
            $log.info("[TSED] Import mvc");
        }

        InjectorService.buildRegistry(FilterRegistry);
    }
    /**
     *
     * @param target
     * @returns {ControllerProvider}
     */
    static get = (target: Type<any>): FilterProvider =>
        FilterRegistry.get(target);
    /**
     *
     * @param target
     * @param provider
     */
    static set = (target: Type<any>, provider: IProvider<any>) =>
        FilterRegistry.merge(target, provider);

    /**
     *
     * @param target
     */
    static has = (target: Type<any>): boolean =>
        FilterRegistry.has(target);

    /**
     *
     * @param target
     * @returns {T}
     */
    invoke<T extends IFilter>(target: Type<T>): T {
        return this.get(target).instance;
    }

    /**
     *
     * @param target
     * @param expression
     * @param request
     * @param response
     * @returns {any}
     */
    invokeMethod<T extends IFilter>(target: Type<T>, expression, request, response) {
        return this.invoke<T>(target).transform(expression, request, response);
    }

}