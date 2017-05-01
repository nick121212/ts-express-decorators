/**
 * @module mvc
 */
/** */
import {Metadata} from "../../../core/class/Metadata";
import {CONTROLLER_SCOPE} from "../../constants/index";
/**
 *
 * @param target
 * @decorator
 */
export function Scope(target: any): void {

    /* istanbul ignore next */
    Metadata.set(CONTROLLER_SCOPE, true, target);
}