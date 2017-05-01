/**
 * @module mvc
 */
/** */
import * as Express from "express";
import {Endpoint} from "./Endpoint";
import {getClassName, Metadata} from "../../core";
import {CONTROLLER_MOUNT_ENDPOINTS, CONTROLLER_ROUTER_OPTIONS} from "../constants/index";
/**
 *
 */
export class ControllerMetadata {

    /**
     * Endpoints controller.
     * @type {Array}
     */
    private _endpoints: Endpoint[] = [];

    /**
     *
     */
    private _parent: ControllerMetadata;

    /**
     * The express router instance for the controller.
     */
    private _router: Express.Router;
    /**
     *
     */
    public instance: any;

    /**
     * Build a new ControllerMetadata metadata.
     * @param _targetClass
     * @param _endpointUrl
     * @param _dependencies
     * @param _createInstancePerRequest
     */
    constructor (
        private _targetClass: any,
        private _endpointUrl: string,
        private _dependencies: (string | Function | ControllerMetadata)[] = [],
        private _createInstancePerRequest: boolean = false
    ) {

        this._router = Express.Router(Metadata.get(CONTROLLER_ROUTER_OPTIONS, _targetClass));

        this.metadataToEndpoints();
    }

    /**
     * Return the class name.
     */
    public getName = () => getClassName(this._targetClass);

    /**
     * Resolve final endpoint url.
     */
    public getEndpointUrl = (endpoint: string = ""): string =>
        endpoint === this.endpointUrl ? this.endpointUrl : endpoint + this.endpointUrl;

    /**
     *
     */
    public hasEndpointUrl() {
        return !!this.endpointUrl;
    }

    /**
     * Create all endpoint for a targetClass.
     */
    private metadataToEndpoints(): ControllerMetadata {

        this._endpoints = <Endpoint[]> Object
            .getOwnPropertyNames(this._targetClass.prototype)
            .map<Endpoint | boolean>((targetKey: string) => {

                if (!Endpoint.has(this._targetClass, targetKey)) {
                    return false;
                }

                return new Endpoint(this._targetClass, targetKey);
            })
            .filter(e => !!e);

        return this;
    }

    /**
     *
     */
    public getMountEndpoints = () => Metadata.get(CONTROLLER_MOUNT_ENDPOINTS, this._targetClass) || [];

    /**
     *
     * @returns {any}
     */
    get targetClass(): any {
        return this._targetClass;
    }

    /**
     *
     * @returns {Endpoint[]}
     */
    get endpoints(): Endpoint[] {
        return this._endpoints;
    }

    /**
     *
     * @returns {ControllerMetadata}
     */
    get parent(): ControllerMetadata {
        return this._parent;
    }

    /**
     *
     * @param parent
     */
    set parent(parent: ControllerMetadata) {
        this._parent = parent;
    }

    /**
     *
     * @returns {(string|Function|ControllerMetadata)[]}
     */
    get dependencies(): (string | Function | ControllerMetadata)[] {
        return this._dependencies;
    }

    /**
     *
     * @param dependencies
     */
    set dependencies(dependencies: (string | Function | ControllerMetadata)[]) {
        this._dependencies = dependencies;
    }

    /**
     *
     * @returns {string}
     */
    get endpointUrl(): string {
        return this._endpointUrl;
    }

    /**
     *
     * @returns {Express.Router}
     */
    get router(): Express.Router {
        return this._router;
    }

    /**
     * Create a new controler for each per incoming request.
     * @returns {boolean}
     */
    get createInstancePerRequest() {
        return this._createInstancePerRequest;
    }
}