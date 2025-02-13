using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.RestService;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Dedicated endpoint which is same for all tenants compared to <see cref="IConfigurationRestService" />.
/// </summary>
internal interface IContextHierarchyRestService
{
    HttpUri Url { get; }
    VariationContextHierarchy Get();
}

internal sealed class ContextHierarchyRestService : IContextHierarchyRestService
{
    private readonly IConfigurationRestClient restClient;
    public HttpUri Url { get; }

    public ContextHierarchyRestService(DynaConEngineSettings settings, IConfigurationRestClient restClient)
    {
        this.restClient = restClient;

        Url = settings.Host.BuildNew(u => u
            .AppendPathSegment(settings.ApiVersion)
            .AppendPathSegment("configuration/variationhierarchy")
            .AddQueryParameters(settings.TenantBlueprint.Parameters
                .Where(p => p.Name.EqualsIgnoreCase(DynaConParameter.ServiceName))
                .Select(p => (p.Name, (string?)p.Value))));
    }

    public VariationContextHierarchy Get()
    {
        var dto = restClient.Execute<VariationHierarchyResponse>(new RestRequest(Url));

        return new VariationContextHierarchy(dto.Hierarchy, ConfigurationSource.Service);
    }
}
