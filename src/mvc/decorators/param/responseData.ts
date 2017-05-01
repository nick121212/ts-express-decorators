/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EndpointParam} from "../../class/EndpointParam";
import {RESPONSE_DATA} from "../../constants/index";
/**
 *
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function ResponseData(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        /* istanbul ignore else */
        if (parameterIndex !== undefined) {

            EndpointParam.useService(RESPONSE_DATA, {
                propertyKey,
                parameterIndex,
                target
            });

        }

    };
}