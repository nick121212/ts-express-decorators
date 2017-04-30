/**
 * @module mvc
 */

import {Type} from "../../core/interfaces/Type";
import {EndpointParam} from "../class/EndpointParam";
/**
 * Add required annotation for a function argument .
 * @returns {Function}
 */
export function Required(): any {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.required(target, propertyKey, parameterIndex);

        }

    };

}