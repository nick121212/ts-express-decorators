/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EndpointParam} from "../../class/EndpointParam";
import {ENDPOINT_INFO} from "../../constants/index";
/**
 *
 * @returns {Function}
 * @constructor
 */
export function EndpointInfo(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useService(ENDPOINT_INFO, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}