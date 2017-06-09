import {IConverter} from "../interfaces";
import {Converter} from "../decorators/class/converter";

@Converter(Symbol)
export class SymbolConverter implements IConverter {

    deserialize(data: string, target: any): symbol {
        return Symbol(data);
    }

    serialize(object: Symbol): any {
        return object.toString().replace("Symbol(", "").replace(")", "");
    }
}