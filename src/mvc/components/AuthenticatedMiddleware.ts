/**
 * @module middlewares
 */
import {Forbidden} from "ts-httpexceptions";
import {ServerSettingsService} from "../../server/services/ServerSettings";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces/index";
import {Endpoint} from "../class/Endpoint";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Next} from "../decorators/param/next";
import {Response} from "../decorators/param/response";
import {Request} from "../decorators/param/request";

@Middleware()
export class AuthenticatedMiddleware implements IMiddleware {

    constructor(private serverSettingsService: ServerSettingsService) {

    }

    public use (
        @EndpointInfo() endpoint: Endpoint,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ) {

        const options = endpoint.getMetadata(AuthenticatedMiddleware) || {};

        const callback = (result: boolean) => {
            if (result === false) {
                next(new Forbidden("Forbidden"));
                return;
            }
            next();
        };

        const fn = this.serverSettingsService.authentification;

        /* istanbul ignore else */
        if (fn) {
            const result = fn.call(this, request, response, <Express.NextFunction>callback, options);

            /* istanbul ignore else */
            if (result !== undefined) {
                callback(result);
            }

        } else {
            next();
        }

    }
}