/**
 * @module middlewares
 */
import {MiddlewareType} from "../../interfaces";
import {MiddlewareService} from "../../services/MiddlewareService";

export function MiddlewareError(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.ERROR);

        return target;
    };
}