/**
 * @module middlewares
 */
import {NotAcceptable} from "ts-httpexceptions";
import {Middleware} from "../decorators/class/middleware";
import {IMiddleware} from "../interfaces";
import {EndpointInfo} from "../decorators/param/endpointInfo";
import {Endpoint} from "../class/Endpoint";
import {Request} from "../decorators/param/request";

@Middleware()
export class AcceptMimesMiddleware implements IMiddleware {

    public use(@EndpointInfo() endpoint: Endpoint,
               @Request() request: any) {

        const mimes = endpoint.getMetadata(AcceptMimesMiddleware) || [];

        mimes.forEach((mime) => {
            if (!request.accepts(mime)) {
                throw new NotAcceptable(mime);
            }
        });

    }
}