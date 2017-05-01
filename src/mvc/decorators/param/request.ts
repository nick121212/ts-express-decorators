/**
 * @module mvc
 */
/** */
import {Type} from "../../../core/interfaces/Type";
import {EXPRESS_REQUEST} from "../../constants/index";
import {ParamsRegistry} from "../../registries/ParamsRegistry";
/**
 * Request service.
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Request(): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            ParamsRegistry.useService(EXPRESS_REQUEST, {
                target,
                propertyKey,
                parameterIndex
            });

        }
    };
}