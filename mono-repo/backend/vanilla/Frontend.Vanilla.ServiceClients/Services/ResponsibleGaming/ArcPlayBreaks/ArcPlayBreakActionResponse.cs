namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;

/// <summary>
/// The API response for ArcPlayBreakActionRequest.
/// </summary>
public class ArcPlayBreakActionResponse
{
    /// <summary>
    /// The response code of the operation, if 0 success otherwise failure.The response code and messages are listed in Table 7.
    /// </summary>
    public ArcPlayBreakActionResponseCode? ResponseCode { get; set; }

    /// <summary>
    /// The response message of the operation.
    /// </summary>
    public string ResponseMessage { get; set; }
}

/// <summary>
/// Play Break Action Acknowledgement Response Codes.
/// </summary>
public enum ArcPlayBreakActionResponseCode
{
    /// <summary>
    /// Failure.
    /// </summary>
    Failure = -1,

    /// <summary>
    /// Technical Error.
    /// </summary>
    TechnicalError = -2,

    /// <summary>
    /// Service Unavailable.
    /// </summary>
    ServiceUnavailable = -3,

    /// <summary>
    /// Unexpected Error.
    /// </summary>
    UnexpectedError = 101,
}
