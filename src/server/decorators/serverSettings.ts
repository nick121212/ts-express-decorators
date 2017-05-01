/**
 * @module server
 */ /** */

import {IServerSettings} from "../interfaces/ServerSettings";
import {Metadata} from "../../core/class/Metadata";
import {SERVER_SETTINGS} from "../constants/index";
/**
 *
 * @param settings
 * @returns {(target:any)=>any}
 * @decorator
 */
export function ServerSettings(settings: IServerSettings): Function {

    return (target: any) => {

        Metadata.set(SERVER_SETTINGS, settings, target);

    };

}