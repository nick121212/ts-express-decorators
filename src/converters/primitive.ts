import {IConverter} from "../interfaces";
import {Converter} from "../decorators/class/converter";
import {BadRequest} from "ts-httpexceptions";

@Converter(String, Number, Boolean)
export class PrimitiveConverter implements IConverter {

    deserialize(data: string, target: any): String | Number | Boolean {

        switch (target) {
            case String:
                return "" + data;

            case Number:
                const n = +data;

                if (isNaN(n)) {
                    throw new BadRequest("Cast error. Expression value is not a number.");
                }

                return n;

            case Boolean:

                if (data === "true") return true;
                if (data === "false") return false;

                return !!data;

        }

    }

    serialize(object: String | Number | Boolean): any {
        return object;
    }
}