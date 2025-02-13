using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.ClientConfig;

internal class FilterUnwantedForCorsClientConfigMergerExecutorDecorator : IClientConfigMergeExecutor
{
    private readonly IClientConfigMergeExecutor inner;
    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly IDynaConParameterExtractor dynaConParameterExtractor;
    private readonly HashSet<string> providerAssembliesIgnoredForCors = new HashSet<string>();

    public FilterUnwantedForCorsClientConfigMergerExecutorDecorator(IClientConfigMergeExecutor inner, IHttpContextAccessor httpContextAccessor, IDynaConParameterExtractor dynaConParameterExtractor)
    {
        this.inner = inner;
        this.httpContextAccessor = httpContextAccessor;
        this.dynaConParameterExtractor = dynaConParameterExtractor;

        IgnoreProvidersFromAssemblyForCorsRequests("Frontend.Vanilla.Features");
    }

    internal void IgnoreProvidersFromAssemblyForCorsRequests(string assemblyName)
    {
        providerAssembliesIgnoredForCors.Add(assemblyName);
    }

    public Task<IReadOnlyDictionary<string, object>> ExecuteAsync(IEnumerable<IClientConfigProvider> providers, CancellationToken cancellationToken)
    {
        // HACK: dont send vanilla client configs in products of single domain app
        if (IsCorsRequest() && dynaConParameterExtractor.Product != "shared-features-api")
            providers = providers.Where(p => p.Type == ClientConfigType.Lazy || !providerAssembliesIgnoredForCors.Contains(p.GetType().Assembly.GetName().Name!));

        return inner.ExecuteAsync(providers, cancellationToken);
    }

    private bool IsCorsRequest()
    {
        var httpContext = httpContextAccessor.GetRequiredHttpContext();
        var rawOrigin = httpContext.Request.Headers[HttpHeaders.Origin];

        return Uri.TryCreate(rawOrigin, UriKind.Absolute, out var originUrl)
               && originUrl.Host != httpContext.Request.Host.Host;
    }
}
