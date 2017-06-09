/**
 * @module filters
 */
/** */

import {IFilter} from "../interfaces";
import {Filter} from "../decorators/filter";
import {ParseService} from "../services/ParseService";
/**
 * @private
 */
@Filter()
export class CookiesFilter implements IFilter {
    constructor(private parseService: ParseService) {

    }

    transform(expression: string, request, response) {
        return this.parseService.eval(expression, request["cookies"]);
    }
}