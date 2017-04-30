/**
 * @module middlewares
 */
import {MiddlewareService} from "../../services/MiddlewareService";
import {MiddlewareType} from "../../interfaces/index";

export function Middleware(): Function {

    return (target: any): void => {

        MiddlewareService.set(target, MiddlewareType.MIDDLEWARE);

        return target;
    };
}