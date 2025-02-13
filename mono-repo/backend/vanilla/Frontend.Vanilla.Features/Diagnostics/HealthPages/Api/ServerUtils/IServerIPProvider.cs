using System.Net;

namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api.ServerUtils;

/// <summary>
/// Retrieves server IP address for diagnostic purposes.
/// </summary>
internal interface IServerIPProvider
{
    IPAddress? IPAddress { get; }
}
