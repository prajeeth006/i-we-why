using Microsoft.AspNetCore.Http;
using Yarp.ReverseProxy.Forwarder;

namespace Frontend.Host.Features.HttpForwarding;

/// <summary>Represents YARP's http forwarding provider details.</summary>
internal interface IHttpForwarderProvider
{
    /// <summary>Indicates order in which this forwarder is activated.</summary>
    int Order { get; }

    /// <summary>Indicates path pattern on which this forwarder operates.</summary>
    string PathPattern { get; }

    /// <summary>Provides destination url. If null, forwarding is skipped.</summary>
    string? GetDestinationUrl(HttpContext httpContext);

    /// <summary>Indicates transformer used during forwarding.</summary>
    HttpTransformer Transformer { get; }
}
