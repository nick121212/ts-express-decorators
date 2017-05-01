/**
 * @module mvc
 */
/** */
import {MiddlewareService} from "../../services/MiddlewareService";
import {MiddlewareType} from "../../interfaces/index";
/**
 *
 * @returns {(target:any)=>void}
 * @decorator
 */
export function Middleware(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.MIDDLEWARE);

        return target;
    };
}