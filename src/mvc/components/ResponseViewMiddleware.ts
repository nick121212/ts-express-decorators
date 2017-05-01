/**
 * @module mvc
 */ /** */

import * as Express from "express";
import {Middleware} from "../decorators/class/middleware";
import {InternalServerError} from "ts-httpexceptions";
import {getClassName} from "../../core/utils";
import {TEMPLATE_RENDERING_ERROR} from "../../core/constants/errors-msgs";
import {IMiddleware} from "../interfaces/index";
import {ResponseData} from "../decorators/param/responseData";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Response} from "../decorators/param/response";
import {Endpoint} from "../class/Endpoint";
/**
 * @private
 */
@Middleware()
export class ResponseViewMiddleware implements IMiddleware {

    public use(
        @ResponseData() data: any,
        @EndpointInfo() endpoint: Endpoint,
        @Response() response: Express.Response
    ) {

        if (response.headersSent) {
           return;
        }

        return new Promise((resolve, reject) => {

            const {viewPath, viewOptions} = endpoint.getMetadata(ResponseViewMiddleware);

            if (viewPath !== undefined) {

                if (viewOptions !== undefined ) {
                    data = Object.assign({}, data, viewOptions);
                }

                response.render(viewPath, data, (err, html) => {

                    /* istanbul ignore next */
                    if (err) {

                        reject(new InternalServerError(TEMPLATE_RENDERING_ERROR(
                            getClassName(endpoint.targetClass),
                            endpoint.methodClassName,
                            err
                        )));

                    } else {
                        // request.storeData(html);
                        resolve(html);
                    }

                });
            } else {
                resolve();
            }
        });

    }
}