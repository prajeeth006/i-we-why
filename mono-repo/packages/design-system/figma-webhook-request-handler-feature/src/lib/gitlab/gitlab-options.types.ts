export type GitlabOptions = {
    /** The url/host of the gitlab server*/
    host: string;
    /** The private token to interact with gitlab*/
    token: string;
    /** The id of the project (repository) in gitlab to push the changes, can be found in gitlab */
    projectId: number;
};
