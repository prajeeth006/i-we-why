#nullable enable

using Frontend.Vanilla.Core.Rest;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Central extensible point for building all <see cref="RestRequest" />-s based on <see cref="PosApiRestRequest" />-s.
/// </summary>
public interface IPosApiRestRequestBuilder
{
    /// <summary>Prepares the request.</summary>
    void PrepareRestRequest(RestRequest restRequest, PosApiRestRequest posApiRequest);
}
