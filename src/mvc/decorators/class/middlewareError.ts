/**
 * @module mvc
 */
/** */
import {MiddlewareType} from "../../interfaces";
import {MiddlewareService} from "../../services/MiddlewareService";
/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
export function MiddlewareError(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.ERROR);

        return target;
    };
}