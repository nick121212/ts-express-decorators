import {IFilter} from "../interfaces";
import ParseService from "../services/parse";
import {Filter} from "../decorators/class/filter";

@Filter()
export class PathParamsFilter implements IFilter {
    constructor(private parseService: ParseService) {

    }

    transform(expression: string, request, response) {
        console.log("Parse path params");
        return this.parseService.eval(expression, request["params"]);
    }
}