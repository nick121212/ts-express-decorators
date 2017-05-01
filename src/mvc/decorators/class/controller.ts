/**
 * @module mvc
 */
/** */
import {Metadata} from "../../../core/class/Metadata";
import {CONTROLLER_DEPEDENCIES, CONTROLLER_URL} from "../../constants/index";
/**
 * Declare a new controller with his Rest path. His methods annotated will be collected to build the routing list.
 * This routing listing will be built with the `express.Router` object.
 *
 * ```typescript
 *  @Controller("/calendars")
 *  export class CalendarCtrl {
 *
 *    @Get("/:id")
 *    public get(
 *      @Request() request: Express.Request,
 *      @Response() response: Express.Response,
 *      @Next() next: Express.NextFunction
 *    ): void {
 *
 *    }
 *  }
 * ```
 *
 * @param ctrlUrl
 * @param ctlrDepedencies
 * @returns {Function}
 * @decorator
 */
export function Controller(ctrlUrl: string, ...ctlrDepedencies: any[]): Function {

    return (target: any): void => {

        /* istanbul ignore next */
        if (!Metadata.has(CONTROLLER_URL, target)) {
            Metadata.set(CONTROLLER_URL, ctrlUrl, target);
            Metadata.set(CONTROLLER_DEPEDENCIES, ctlrDepedencies, target);
        }

    };
}


