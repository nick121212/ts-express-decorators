/**
 * ServerLoader lifecycle let you intercept a phase.
 */
export interface IServerLifecycle {
    /**
     * This method is called when the server starting his lifecycle.
     */
    $onInit?(): void | Promise<any>;

    $onMountingMiddlewares?: Function;
    $afterRoutesInit?: Function;
    $onReady?: Function;

    $onServerInitError?(error): any;
    $onError?(error: any, request: Express.Request, response: Express.Response, next: Express.NextFunction): void;
    $onAuth?(request: Express.Request, response: Express.Response, next?: Express.NextFunction, authorization?: any): boolean
        | void;
}
