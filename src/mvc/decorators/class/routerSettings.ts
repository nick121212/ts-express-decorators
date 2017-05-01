/**
 * @module mvc
 */
/** */
import {Metadata} from "../../../core/class/Metadata";
import {CONTROLLER_ROUTER_OPTIONS} from "../../constants/index";
/**
 *
 * @param options
 * @returns {(target:any)=>void}
 * @decorator
 */
export function RouterSettings(options: { caseSensitive?: boolean, mergeParams?: boolean, strict?: boolean }): Function {

    return (target: any): void => {

        Metadata.set(CONTROLLER_ROUTER_OPTIONS, Object.assign(options || {}, {}), target);

    };
}
/**
 *
 * @param mergeParams
 * @returns {Function}
 * @decorator
 */
export function MergeParams(mergeParams: boolean) {
    return RouterSettings({mergeParams});
}
/**
 *
 * @param caseSensitive
 * @returns {Function}
 * @decorator
 */
export function CaseSensitive(caseSensitive: boolean) {
    return RouterSettings({caseSensitive});
}
/**
 *
 * @param strict
 * @returns {Function}
 * @decorator
 */
export function Strict(strict: boolean) {
    return RouterSettings({strict});
}