/**
 * @whatItDoes Specifies options that can be used as Route.data
 *
 * @stable
 */
export interface RouteDataOptions {
    /** User has to be authenticated for this route. */
    authorized?: boolean;

    /** Route allows anonymous users in case anonymous access is restricted (e.g. premium labels). */
    allowAnonymous?: boolean;

    /** Route also allows authorized users (used for workflow routes that are also used as normal pages outside of workflow). */
    allowAuthorized?: boolean;

    /** Route requires an anonymous user. */
    onlyUnauthenticated?: boolean;

    /** Workflow type associated with this route. */
    workflowType?: number | number[] | 'any' | (number | 'any')[];

    /** Indicates if route can be accessed with any workflow ID. */
    allowAllWorkflowTypes?: boolean;

    /** List of routes that are allowed to transition to this route. */
    allowedFrom?: string[];
}
/**
 * @stable
 */
export function routeData(options: RouteDataOptions) {
    return options;
}
