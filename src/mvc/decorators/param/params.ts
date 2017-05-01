/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {EndpointParam} from "../../class/EndpointParam";
import {CookiesParamsFilter} from "../../../filters/components/CookiesParamsFilter";
import {BodyParamsFilter} from "../../../filters/components/BodyParamsFilter";
import {PathParamsFilter} from "../../../filters/components/PathParamsFilter";
import {QueryParamsFilter} from "../../../filters/components/QueryParamsFilter";
import {LocalsFilter} from "../../../filters/components/LocalsFilter";
import {SessionFilter} from "../../../filters/components/SessionFilter";
import {HeaderFilter} from "../../../filters/components/HeaderFilter";

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function CookiesParams(expression?: string | any, useType?: any): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(CookiesParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function BodyParams(expression?: string | any, useType?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(BodyParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function PathParams(expression?: string | any, useType?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(PathParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function QueryParams(expression?: string | any, useType?: any): Function {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(QueryParamsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useType
            });

        }

    };
}

/**
 *
 * @param expression
 * @param useType
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @decorator
 */
export function Session(expression?: string | any, useType?: any) {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(SessionFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression
            });

        }

    };
}

/**
 *
 * @param expression
 * @returns {(target:any, propertyKey:(string|symbol), parameterIndex:number)=>void}
 * @decorator
 */
export function HeaderParams(expression: string) {

    return (target: any, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(HeaderFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression
            });

        }

    };
}

/**
 *
 * @param expression
 * @returns {function(Function, (string|symbol), number): void}
 * @decorator
 */
export function Locals(expression?: string | any): Function {

    return (target: Type<any>, propertyKey: string | symbol, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            EndpointParam.useFilter(LocalsFilter, {
                target,
                propertyKey,
                parameterIndex,
                expression,
                useConverter: false
            });

        }

    };
}