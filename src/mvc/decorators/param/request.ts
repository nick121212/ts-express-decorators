/**
 * @module mvc
 */

import {Type} from "../../../core/interfaces/Type";
import {EndpointParam} from "../../class/EndpointParam";
import {EXPRESS_REQUEST} from "../../constants/index";
/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @constructor
 */
export function Request(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useService(EXPRESS_REQUEST, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}