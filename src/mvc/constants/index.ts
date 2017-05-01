/**
 * @module mvc
 */ /** */

/**
 * Metadata key
 * @private
 * @type {string}
 */
export const ENDPOINT_USE = "tsed:endpoint:use";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const ENDPOINT_USE_BEFORE = "tsed:endpoint:use:before";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const ENDPOINT_USE_AFTER = "tsed:endpoint:use:after";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const ENDPOINT_INJECT_PARAMS = "tsed:inject:params";
/**
 * Express methods
 * @private
 * @type {string}
 */
export const ENDPOINT_METHODS = [
    "all", "checkout", "connect",
    "copy", "delete", "get",
    "head", "lock", "merge",
    "mkactivity", "mkcol", "move",
    "m-search", "notify", "options",
    "param", "patch", "post",
    "propfind", "propatch", "purge",
    "put", "report", "search",
    "subscribe", "trace", "unlock",
    "unsuscribe"
];

/**
 * Metadata key
 * @private
 * @type {string}
 */
export const CONTROLLER_URL = "tsed:controller:url";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const CONTROLLER_DEPEDENCIES = "ted:controller:dependencies";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const CONTROLLER_SCOPE = "ted:controller:scope";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const CONTROLLER_ROUTER_OPTIONS = "ted:controller:router:options";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const CONTROLLER_MOUNT_ENDPOINTS = "ted:controller:endpoints";
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_NEXT_FN = Symbol("next");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_ERR = Symbol("err");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_REQUEST = Symbol("request");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const EXPRESS_RESPONSE = Symbol("response");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const RESPONSE_DATA = Symbol("responseData");
/**
 * Metadata key
 * @private
 * @type {string}
 */
export const ENDPOINT_INFO = Symbol("endpointInfo");
