/**
 * @module di
 */ /** */
/**
 * @private
 */
export class InjectionError extends Error {

    name: "INJECTION_ERROR";

    constructor(message) {
        super(`Service ${message} not found.`);
    }
}