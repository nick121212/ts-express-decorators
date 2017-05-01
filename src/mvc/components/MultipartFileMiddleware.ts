/**
 * @module mvc
 */ /** */

import {Middleware} from "../decorators/class/middleware";
import {ServerSettingsService} from "../../server/services/ServerSettings";
import {$log} from "ts-log-debug";
import {IMiddleware} from "../interfaces/index";
import {EndpointInfo, Next, Request, Response} from "../";
import {Endpoint} from "../class/Endpoint";
/**
 * @private
 */
@Middleware()
export class MultipartFileMiddleware implements IMiddleware {

    private multer;

    constructor(private serverSettingsService: ServerSettingsService) {
        /* istanbul ignore else */

        try {
            if (require.resolve("multer")) {
                this.multer = require("multer");
            }
        } catch (er) {

        }
    }

    /**
     *
     * @param endpoint
     * @param request
     * @param response
     * @param next
     * @returns {any}
     */
    use(
        @EndpointInfo() endpoint: Endpoint,
        @Request() request: Express.Request,
        @Response() response: Express.Response,
        @Next() next
    ) {

        if (this.multer) {
            const middleware = this.multer(Object.assign({
                dest: this.serverSettingsService.uploadDir,
            }, endpoint.getMetadata(MultipartFileMiddleware) || {}));

            return middleware.any()(request, response, next);
        } else {
            $log.warn("Multer isn't installed ! Run npm install --save multer before using Multipart decorators.");
        }

    }
}