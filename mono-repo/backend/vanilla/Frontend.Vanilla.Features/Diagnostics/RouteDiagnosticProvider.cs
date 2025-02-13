using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Diagnostics;
using Microsoft.AspNetCore.Routing;

namespace Frontend.Vanilla.Features.Diagnostics;

internal sealed class RouteDiagnosticProvider(IEnumerable<EndpointDataSource> endpointSources) : SyncDiagnosticInfoProvider
{
    public override DiagnosticInfoMetadata Metadata { get; } = new (
        name: "Routes",
        urlPath: "routes",
        shortDescription: "List of statically registered routes.");

    public override object GetDiagnosticInfo()
    {
        var endpoints = endpointSources.SelectMany(source => source.Endpoints).Select(e => (e as RouteEndpoint)!);
        var data = endpoints.Select(e =>
            new
            {
                e.DisplayName,
                e.RoutePattern,
                e.Order,
                Metadata = e.Metadata.Select(m => m.ToString()),
            }).ToList();

        return data;
    }
}
