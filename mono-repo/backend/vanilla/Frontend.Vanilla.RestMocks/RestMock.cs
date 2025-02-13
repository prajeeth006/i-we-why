using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.RestMocks;

/// <summary>
/// Rule for mocking REST request.
/// </summary>
internal sealed class RestMock
{
    /// <summary>
    /// Condition to match incoming request to this app.
    /// </summary>
    public MatchIncomingRequestToThisAppHandler MatchIncomingRequestToThisApp { get; }

    /// <summary>
    /// Condition to match out outgoing request from this app.
    /// </summary>
    public MatchOutgoingRequestFromThisAppHandler MatchOutgoingRequestFromThisApp { get; }

    /// <summary>
    /// Delegate to get the response to be used if conditions are met.
    /// </summary>
    public GetMockedResponseHandler GetMockedResponse { get; }

    /// <summary>
    /// Creates a new instance.
    /// </summary>
    public RestMock(
        MatchIncomingRequestToThisAppHandler matchIncomingRequestToThisApp,
        MatchOutgoingRequestFromThisAppHandler matchOutgoingRestRequestFromThisApp,
        GetMockedResponseHandler getMockedResponse)
    {
        MatchIncomingRequestToThisApp = Guard.NotNull(matchIncomingRequestToThisApp, nameof(matchIncomingRequestToThisApp));
        MatchOutgoingRequestFromThisApp = Guard.NotNull(matchOutgoingRestRequestFromThisApp, nameof(matchOutgoingRestRequestFromThisApp));
        GetMockedResponse = Guard.NotNull(getMockedResponse, nameof(getMockedResponse));
    }
}
