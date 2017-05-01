/**
 * @module mvc
 */ /** */

import {Type} from "../../../core/interfaces/Type";
import {Endpoint} from "../../class/Endpoint";
import {MultipartFileMiddleware} from "../../components/MultipartFileMiddleware";
import {UseBefore} from "../method/useBefore";
import {Metadata} from "../../../core/class/Metadata";
import {MultipartFileFilter, MultipartFilesFilter} from "../../../filters/components/MultipartFileFilter";
import {EndpointParam} from "../../class/EndpointParam";
/**
 *
 * @param options
 * @returns {(target:Type<T>, propertyKey:string, parameterIndex:number)=>void}
 * @decorator
 */
export function MultipartFile(options?: any): Function {

    return <T>(target: Type<T>, propertyKey: string, parameterIndex: number): void => {

        if (typeof parameterIndex === "number") {

            // create endpoint metadata
            Endpoint.setMetadata(MultipartFileMiddleware, options, target, propertyKey);

            UseBefore(MultipartFileMiddleware)(target, propertyKey, parameterIndex);

            // add filter
            const filter = Metadata.getParamTypes(target, propertyKey)[parameterIndex] === Array
                ? MultipartFilesFilter : MultipartFileFilter;

            EndpointParam.useFilter(filter, {
                propertyKey,
                parameterIndex,
                target,
                useConverter: false
            });

        }

    };
}