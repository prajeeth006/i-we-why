using System.Collections.Generic;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebUtilities;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebIntegration;

internal sealed class AspNetCoreEndpointMetadata(IHttpContextAccessor httpContextAccessor) : EndpointMetadataBase
{
    public override IReadOnlyList<T> GetOrdered<T>()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var endpoint = httpContext.GetEndpoint() ?? throw new NoRoutingExecutedException();

        return endpoint.Metadata.GetOrderedMetadata<T>();
    }
}
