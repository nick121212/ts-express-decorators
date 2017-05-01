/**
 * @module mvc
 */
/** */
import {Endpoint} from "../../class/Endpoint";
/**
 * Mounts the specified middleware function or functions at the specified path: the middleware function is executed when
 * the base of the requested path matches `path.
 *
 * @returns {Function}
 * @param args
 * @decorator
 */
export function Use(...args: any[]): Function {

    return <T> (
        target: Function,
        targetKey: string,
        descriptor: TypedPropertyDescriptor<T>
    ) : TypedPropertyDescriptor<T> => {

        Endpoint.use(target, targetKey, args);

        return descriptor;
    };
}