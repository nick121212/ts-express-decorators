import {Metadata} from "../../../core/class/Metadata";
import {CONTROLLER_ROUTER_OPTIONS} from "../../constants/index";

export function RouterSettings(options: { caseSensitive?: boolean, mergeParams?: boolean, strict?: boolean }): Function {

    return (target: any): void => {

        Metadata.set(CONTROLLER_ROUTER_OPTIONS, Object.assign(options || {}, {}), target);

    };
}

export function MergeParams(mergeParams: boolean) {
    return RouterSettings({mergeParams});
}

export function CaseSensitive(caseSensitive: boolean) {
    return RouterSettings({caseSensitive});
}

export function Strict(strict: boolean) {
    return RouterSettings({strict});
}