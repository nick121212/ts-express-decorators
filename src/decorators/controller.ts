import Ctrl from "../controllers/controller";
import * as METADATA_KEYS from "../constants/metadata-keys";
import * as ERRORS_MSGS from "../constants/errors-msgs";
import {getClassName} from '../utils/class';

export function Controller(endpointUrl: string, ...ctlrDepedencies: any[]): Function {

    return (targetClass: any): void => {

        if (Ctrl.getController(targetClass).hasUrl() === true) {
            throw new Error(ERRORS_MSGS.DUPLICATED_CONTROLLER_DECORATOR(getClassName(targetClass)));
        }

        Ctrl.setUrl(targetClass, endpointUrl);
        Ctrl.setDepedencies(targetClass, ctlrDepedencies);

    };
}