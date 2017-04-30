/**
 * @module filters
 */

import {IFilter} from "../interfaces";
import {Filter} from "../decorators/filter";
import {ParseService} from "../services/ParseService";

@Filter()
export class HeaderFilter implements IFilter {

    constructor(private parseService: ParseService) {
    }

    transform(expression: string, request: any, response: any) {
        return request.get(expression);
    }
}