/**
 * @module mvc
 */ /** */

import {Endpoint} from "../../class/Endpoint";
/**
 * Use decorators.
 * @returns {function(any, any, any): *}
 * @param args
 * @decorator
 */
export function UseBefore(...args: any[]): Function {

    return <T> (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        Endpoint.useBefore(target, targetKey, args);

        return descriptor;
    };
}