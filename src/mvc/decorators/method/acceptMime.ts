import {UseBefore} from "./useBefore";
import {Endpoint} from "../../class/Endpoint";
import {AcceptMimesMiddleware} from "../../components/AcceptMimesMiddleware";
/**
 * Set a mime list as acceptable for a request on a specific endpoint.
 *
 * ```typescript
 * \@ControllerMetadata('/mypath')
 * class MyCtrl {
 *
 *   \@Get('/')
 *   \@AcceptMime('application/json')
 *   public getResource(){}
 * }
 * ```
 *
 * @param mimes
 * @returns {Function}
 * @constructor
 */
export function AcceptMime(...mimes: string[]): Function {

    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(AcceptMimesMiddleware, mimes, target, targetKey);

        return UseBefore(AcceptMimesMiddleware)(target, targetKey, descriptor);
    };
}