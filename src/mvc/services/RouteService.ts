/**
 * @module mvc
 */
import {Service} from "../../di/decorators/service";
import {$log} from "ts-log-debug";
import {ControllerService} from "./ControllerService";
import {IControllerRoute} from "../interfaces/ControllerRoute";

/**
 * `RouteService` is used to provide all routes collected by annotation `@ControllerMetadata`.
 */
@Service()
export class RouteService {

    constructor(private controllerService: ControllerService) {

    }

    /**
     * Return all Routes stored in ControllerMetadata manager.
     * @returns {IControllerRoute[]}
     */
    getAll(): IControllerRoute[] {
        return this.controllerService.getRoutes();
    }

    /**
     * Print routes in console.
     */
    printRoutes(logger: {info: (s) => void} = $log) {
        return this.controllerService.printRoutes(logger);
    }
}
