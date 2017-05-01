/**
 * @module mvc
 */
/** */
import {UseBefore} from "./useBefore";
import {Endpoint} from "../../class/Endpoint";
import {AuthenticatedMiddleware} from "../../components/AuthenticatedMiddleware";
/**
 * Set authentification strategy on your endpoint.
 *
 * ```typescript
 * \@ControllerMetadata('/mypath')
 * class MyCtrl {
 *
 *   \@Get('/')
 *   \@Authenticated({role: 'admin'})
 *   public getResource(){}
 * }
 * ```
 *
 * @param options
 * @returns {Function}
 * @decorator
 */
export function Authenticated(options?: any): Function {


    return <T> (target: Function, targetKey: string, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {

        Endpoint.setMetadata(AuthenticatedMiddleware, options, target, targetKey);

        return UseBefore(AuthenticatedMiddleware)(target, targetKey, descriptor);
    };

}