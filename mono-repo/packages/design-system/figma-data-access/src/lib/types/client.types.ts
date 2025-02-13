import * as figma from '@figma/rest-api-spec';

export type IFigmaClient = {
    /**
     * Returns the document referred to by :key as a JSON object. The file key can be parsed from any Figma file url: https://www.figma.com/file/:key/:title. The name, lastModified, thumbnailUrl, editorType, linkAccess, and version attributes are all metadata of the retrieved file. The document attribute contains a Node of type DOCUMENT.
     *
     * The components key contains a mapping from node IDs to component metadata. This is to help you determine which components each instance comes from.
     *
     * @param pathParams see GetFilePathParams.
     * @param queryParams see GetFileQueryParams
     */
    getFile: (pathParams: figma.GetFilePathParams, queryParams: figma.GetFileQueryParams) => Promise<figma.GetFileResponse>;

    /**
     * Returns the nodes referenced to by :ids as a JSON object. The nodes are retrieved from the Figma file referenced to by :key.
     *
     * The node Id and file key can be parsed from any Figma node url: https://www.figma.com/file/:key/:title?node-id=:id.
     *
     * The name, lastModified, thumbnailUrl, editorType, and version attributes are all metadata of the specified file.
     *
     * The linkAccess field describes the file link share permission level. There are 5 types of permissions a shared link can have: "inherit", "view", "edit", "org_view", and "org_edit". "inherit" is the default permission applied to files created in a team project, and will inherit the project's permissions. "org_view" and"org_edit" restrict the link to org users.
     *
     * The document attribute contains a Node of type DOCUMENT.
     *
     * The components key contains a mapping from node IDs to component metadata. This is to help you determine which components each instance comes from.
     *
     * By default, no vector data is returned. To return vector data, pass the geometry=paths parameter to the endpoint.
     * Each node can also inherit properties from applicable styles. The styles key contains a mapping from style IDs to style metadata.
     *
     * Important: the nodes map may contain values that are null . This may be due to the node id not existing within the specified file.
     *
     * @param pathParams see GetFileNodesPathParams.
     * @param queryParams see GetFileNodesQueryParams
     */
    getFileNodes: (pathParams: figma.GetFileNodesPathParams, queryParams: figma.GetFileNodesQueryParams) => Promise<figma.GetFileNodesResponse>;

    /**
     * Renders images from a file.
     *
     * If no error occurs, "images" will be populated with a map from node IDs to URLs of the rendered images, and "status" will be omitted. The image assets will expire after 30 days. Images up to 32 megapixels can be exported. Any images that are larger will be scaled down.
     *
     * Important: the image map may contain values that are null. This indicates that rendering of that specific node has failed. This may be due to the node id not existing, or other reasons such has the node having no renderable components. It is guaranteed that any node that was requested for rendering will be represented in this map whether or not the render succeeded.
     *
     * @param pathParams see GetImagesPathParams.
     * @param queryParams see GetImagesQueryParams
     */
    getImages: (pathParams: figma.GetImagesPathParams, queryParams: figma.GetImagesQueryParams) => Promise<figma.GetImagesResponse>;

    /**
     * Returns download links for all images present in image fills in a document. Image fills are how Figma represents any user supplied images. When you drag an image into Figma, we create a rectangle with a single fill that represents the image, and the user is able to transform the rectangle (and properties on the fill) as they wish.
     *
     * This endpoint returns a mapping from image references to the URLs at which the images may be download. Image URLs will expire after no more than 14 days. Image references are located in the output of the GET files endpoint under the imageRef attribute in a Paint.
     *
     * @param pathParams see GetImageFillsPathParams
     */
    getImageFills: (pathParams: figma.GetImageFillsPathParams) => Promise<figma.GetImageFillsResponse>;

    /**
     * Fetch the local variables created in the file and remote variables used in the file.
     *
     * This API is available to full members (Viewers or Editors) of Enterprise orgs.
     *
     * The GET /v1/files/:file_key/variables/local endpoint lets you enumerate local variables created in the file and remote variables used in the file. Remote variables are referenced by their subscribed_id.
     *
     * As a part of the Variables related API additions, the GET /v1/files/:file_key endpoint now returns a boundVariables property, containing the variableId of the bound variable. The GET /v1/files/:file_key/variables/local endpoint can be used to get the full variable or variable collection object.
     *
     * Note that GET /v1/files/:file_key/variables/published does not return modes. Instead, you will need to use the GET /v1/files/:file_key/variables/local endpoint, in the same file, to examine the mode values.
     *
     * @param pathParams see GetLocalVariablesPathParams
     */
    getLocalVariables: (pathParams: figma.GetLocalVariablesPathParams) => Promise<figma.GetLocalVariablesResponse>;

    /**
     * Fetch the variables published from this file.
     *
     * This API is available to full members (Viewers or Editors) of Enterprise orgs.
     *
     * The GET /v1/files/:file_key/variables/published endpoint returns the variables that are published from the given file.
     *
     * The response for this endpoint contains some key differences compared to the GET /v1/files/:file_key/variables/local endpoint:
     *
     * Each variable and variable collection contains a subscribed_id .
     * Modes are omitted for published variable collections
     * Published variables have two ids: an id that is assigned in the file where it is created (id), and an id that is used by subscribing files (subscribed_id). The id and key are stable over the lifetime of the variable. The subscribed_id changes every time the variable is modified and published. The same is true for variable collections.
     *
     * The updatedAt fields are ISO 8601 timestamps that indicate the last time that a change to a variable was published. For variable collections, this timestamp will change any time a variable in the collection is changed.
     *
     * @param pathParams see GetPublishedVariablesPathParams
     */
    getPublishedVariables: (pathParams: figma.GetPublishedVariablesPathParams) => Promise<figma.GetPublishedVariablesResponse>;

    /**
     * Bulk create, update, and delete local variables and variable collections.
     *
     * This API is available to full members of Enterprise orgs with Editor seats.
     *
     * The POST /v1/files/:file_key/variables endpoint lets you bulk create, update, and delete variables and variable collections.
     *
     * The request body supports the following 4 top-level arrays. Changes from these arrays will be applied in the below order, and within each array, by array order.
     *
     * variableCollections: For creating, updating, and deleting variable collections
     * variableModes: For creating, updating, and deleting modes within variable collections
     * Each collection can have a maximum of 40 modes
     * Mode names cannot be longer than 40 characters
     * variables: For creating, updating, and deleting variables
     * Each collection can have a maximum of 5000 variables
     * Variable names must be unique within a collection and cannot contain certain special characters such as .{}
     * variableModeValues: For setting a variable value under a specific mode.
     * When setting aliases, a variable cannot be aliased to itself or form an alias cycle
     *
     * This endpoint has the following key behaviors:
     *
     * The request body must be 4MB or less.
     * Must include an action property for collections, modes, and variables to tell the API whether to create, update, or delete the object.
     * When creating a collection, mode, or variable, you can include a temporary id that can be referenced in dependent objects in the same request. For example, you can create a new collection with the id "my_new_collection". You can then set variableCollectionId to "my_new_collection" in new modes or variables. Temporary ids must be unique in the request body.
     * New collections always come with one mode. You can reference this mode by setting initialModeId to a temporary id in the request body. This is useful if you want to set values for variables in the mode in the variableModeValues array.
     * The tempIdToRealId array returns a mapping of the temporary ids in the request, to the real ids of the newly created objects.
     * When adding new modes or variables, default variable values will be applied, consistent with what happens in the UI.
     * Everything to be created, updated, and deleted in the request body is treated as one atomic operation. If there is any validation failure, you will get a 400 status code response, and no changes will be persisted.
     * You will not be able to update remote variables or variable collections. You can only update variables in the file where they were originally created.
     * Beta Limitations
     *
     * We are actively working on the POST /v1/files/:file_key/variables endpoint and welcome any feedback. The endpoint has the following limitations in functionality:
     *
     * If a string variable is bound to a text node content in the same file, and the text node uses a shared font in the organization, that variable cannot be updated and will result in a 400 response.
     * @param pathParams see PostVariablesPathParams.
     * @param requestBody see PostVariablesRequestBody.
     */
    postVariables: (pathParams: figma.PostVariablesPathParams, requestBody: figma.PostVariablesRequestBody) => Promise<figma.PostVariablesResponse>;

    /**
     * Create a new webhook which will call the specified endpoint when the event triggers. By default, this webhook will automatically send a PING event to the endpoint when it is created. If this behavior is not desired, you can create the webhook and set the status to PAUSED and reactivate it later.
     * @param requestBody see PostWebhookRequestBody
     */
    postWebhook: (requestBody: figma.PostWebhookRequestBody) => Promise<figma.PostWebhookResponse>;

    /**
     * Returns the WebhookV2 corresponding to the ID provided, if it exists.
     * @param pathParams see GetWebhookPathParams
     */
    getWebhook: (pathParams: figma.GetWebhookPathParams) => Promise<figma.GetWebhookResponse>;

    /**
     * Updates the webhook with the specified properties.
     * @param pathParams see PutWebhookPathParams
     * @param requestBody see PutWebhookRequestBody
     */
    putWebhook: (pathParams: figma.PutWebhookPathParams, requestBody: figma.PutWebhookRequestBody) => Promise<figma.PutWebhookResponse>;

    /**
     * Deletes the specified webhook. This operation cannot be reversed.
     * @param pathParams see DeleteWebhookPathParams
     */
    deleteWebhook: (pathParams: figma.DeleteWebhookPathParams) => Promise<figma.DeleteWebhookResponse>;

    /**
     * Returns all webhooks registered under the specified team.
     * @param pathParams see GetTeamWebhooksPathParams
     */
    getTeamWebhooks: (pathParams: figma.GetTeamWebhooksPathParams) => Promise<figma.GetTeamWebhooksResponse>;

    /**
     * Returns all webhook requests sent within the last week. Useful for debugging.
     * @param pathParams see figma.GetWebhookRequestsPathParams
     */
    getWebhookRequests: (pathParams: figma.GetWebhookRequestsPathParams) => Promise<figma.GetWebhookRequestsResponse>;

    /**
     * Returns the list of published styles within a file library. The file key can be parsed from any Figma file url: https://www.figma.com/file/:key/:title.
     *
     *@param pathParams see GetFileStylesPathParams.
     */

    getFileStyles: (pathParams: figma.GetFileStylesPathParams) => Promise<figma.GetFileStylesResponse>;
};
