/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EndpointParam} from "../../class/EndpointParam";
import {EXPRESS_ERR} from "../../constants/index";
/**
 *
 * @returns {Function}
 * @decorator
 */
export function Err(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useService(EXPRESS_ERR, {
                propertyKey,
                parameterIndex,
                target
            });

        }
    };
}
