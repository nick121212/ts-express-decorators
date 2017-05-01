/**
 * @module mvc
 */
/** */
import {getClassName} from "../../core/utils";
import {Metadata} from "../../core/class/Metadata";
import {ENDPOINT_METHODS, ENDPOINT_USE, ENDPOINT_USE_AFTER, ENDPOINT_USE_BEFORE} from "../constants/index";

/**
 * Endpoint class contains metadata about a targetClass and his method.
 * Each annotation (@Get, @Body...) attached to a method are stored in a endpoint.
 * Endpoint convert this metadata to an array which contain arguments to call an Express method.
 *
 * Example :
 *
 *    @Controller("/my-path")
 *    class MyClass {
 *
 *        @Get("/")
 *        @Authenticated()
 *        public myMethod(){}
 *    }
 *
 * Annotation on MyClass.myMethod create a new Endpoint with his route "/",
 * the HTTP method GET and require granted connection to be accessible.
 */
export class Endpoint {

    /**
     *
     * @type {Array}
     */
    private _middlewares: any[] = [];
    /**
     * HTTP method required.
     */
    private httpMethod: string;
    /**
     * Route strategy.
     */
    private route: string | RegExp;

    /**
     * Create an unique Endpoint manager for a targetClass and method.
     * @param _targetClass
     * @param _methodClassName
     */
    constructor(private _targetClass: any, private _methodClassName: string) {

        const args = Metadata.get(ENDPOINT_USE, _targetClass, _methodClassName) || [];
        this.push(args);

    }

    get middlewares(): any[] {
        return this._middlewares;
    }

    /**
     * Store all arguments collected via Annotation.
     * @param args
     */
    public push(args: any[]): void {

        let filteredArg = args
            .filter((arg: any) => {

                if (typeof arg === "string") {

                    if (ENDPOINT_METHODS.indexOf(arg) > -1) {
                        this.httpMethod = arg;
                    } else {
                        this.route = arg;
                    }

                    return false;
                }

                return !!arg;
            });

        this._middlewares = this._middlewares.concat(filteredArg);
    }

    /**
     * Endpoint has a HTTP method configured.
     * @returns {boolean}
     */
    public hasMethod(): boolean {
        return !!this.httpMethod;
    }

    /**
     * Return the http METHOD choosen for this endpoint.
     * @returns {string}
     */
    public getMethod(): string {
        return this.httpMethod;
    }

    /**
     *
     * @returns {string|RegExp}
     */
    public getRoute(): string | RegExp {
        return this.getMethod() ? (this.route || "/") : undefined;
    }

    /**
     *
     */
    public get methodClassName(): string {
        return this._methodClassName;
    }

    /**
     *
     * @returns {any}
     */
    public get targetClass(): string {
        return this._targetClass;
    }

    /**
     *
     * @param target
     * @param method
     */
    static has = (target: any, method: string): boolean => Metadata.has(ENDPOINT_USE, target, method);

    /**
     * Append mvc in the pool (before).
     * @param target
     * @param targetKey
     * @param args
     */
    static useBefore(target: any, targetKey: string, args: any[]) {
        const middlewares = Metadata.get(ENDPOINT_USE_BEFORE, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE_BEFORE, args.concat(middlewares), target, targetKey);
        return this;
    };

    /**
     * Add middleware and configuration for the endpoint.
     * @param target
     * @param targetKey
     * @param args
     * @returns {Endpoint}
     */
    static use(target: any, targetKey: string, args: any[]) {
        const middlewares = Metadata.get(ENDPOINT_USE, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE, args.concat(middlewares), target, targetKey);
        return this;
    }

    /**
     * Append mvc in the pool (after).
     * @param target
     * @param targetKey
     * @param args
     */
    static useAfter(target: any, targetKey: string, args: any[]) {
        const middlewares = Metadata.get(ENDPOINT_USE_AFTER, target, targetKey) || [];

        Metadata.set(ENDPOINT_USE_AFTER, args.concat(middlewares), target, targetKey);
        return this;
    };

    /**
     * Return the list of mvc that will be applied before all mvc.
     */
    public getBeforeMiddlewares = () =>
    Metadata.get(ENDPOINT_USE_BEFORE, this._targetClass, this._methodClassName) || [];

    /**
     * Return the list of mvc that will be applied after all mvc.
     */
    public getAfterMiddlewares = () =>
    Metadata.get(ENDPOINT_USE_AFTER, this._targetClass, this._methodClassName) || [];

    /**
     * Get value for an endpoint method.
     * @param key
     */
    public getMetadata = (key: any) =>
        Metadata.get(typeof key === "string" ? key : getClassName(key), this.targetClass, this.methodClassName);

    /**
     * Store value for an endpoint method.
     * @param key
     * @param value
     * @param targetClass
     * @param methodClassName
     */
    static setMetadata = (key: any, value: any, targetClass: any, methodClassName: any) =>
        Metadata.set(typeof key === "string" ? key : getClassName(key), value, targetClass, methodClassName);

    /**
     * Return the stored value for an endpoint method.
     * @param key
     * @param targetClass
     * @param methodClassName
     */
    static getMetadata = (key: any, targetClass: any, methodClassName: any) =>
        Metadata.get(typeof key === "string" ? key : getClassName(key), targetClass, methodClassName);

}