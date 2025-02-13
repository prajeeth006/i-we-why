using Frontend.Host.Features.HttpForwarding;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.WebIntegration;
using Frontend.Vanilla.Features.WebIntegration.Core.Labels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;

namespace Frontend.Host.Features.ClientConfig;

internal interface IEagerClientConfigService
{
    IReadOnlyDictionary<string, ClientConfigAppInfo> GetClientConfigEndpoints(HttpContext httpContext);
    Task<(IReadOnlyDictionary<string, object>, IEnumerable<string>)> GetConfigsAndServerTimingsAsync(HttpContext httpContext);
}

internal sealed class EagerClientConfigService(
    IClientConfigMerger clientConfigurationMerger,
    IProductApiHttpClient productApiHttpClient,
    ISingleDomainAppConfiguration singleDomainAppConfiguration,
    ISingleDomainHostPathResolver singleDomainHostPathResolver,
    IClientConfigConfiguration clientConfigConfiguration,
    ILogger<EagerClientConfigService> log)
    : IEagerClientConfigService
{
    private const string HostAppId = "host-app";
    private const string SfApiId = "sf";

    public async Task<(IReadOnlyDictionary<string, object>, IEnumerable<string>)> GetConfigsAndServerTimingsAsync(HttpContext httpContext)
    {
        var endpointTasks = GetClientConfigEndpoints(httpContext).Select(v => GetAppClientConfigAsync(v.Key, v.Value, httpContext));
        var endpointConfigs = await Task.WhenAll(endpointTasks);

        var eagerClientConfigs = new Dictionary<string, object>();

        foreach (var endpointConfig in endpointConfigs.SelectMany(e => e.Item1))
        {
            eagerClientConfigs[endpointConfig.Key] = endpointConfig.Value;
        }

        return (eagerClientConfigs, endpointConfigs.SelectMany(e => e.Item2));
    }

    private async Task<(IReadOnlyDictionary<string, object>, IEnumerable<string>)> GetAppClientConfigAsync(string product, ClientConfigAppInfo clientConfigAppInfo, HttpContext httpContext)
    {
        try
        {
            if (product == HostAppId)
            {
                var mergedConfigs = await clientConfigurationMerger.GetMergedConfigAsync(httpContext.RequestAborted);
                return (mergedConfigs, StringValues.Empty);
            }

            var productApiValue = $"{product}-api";
            if (!ProductApi.TryFromValue(productApiValue, out var productApi))
            {
                log.LogCritical("Failed to parse {product} into {productApi}.", productApiValue, nameof(ProductApi));
                return (EmptyDictionary<string, object>.Singleton, StringValues.Empty);
            }

            var response = await productApiHttpClient.GetEagerClientConfigAsync(productApi, httpContext.RequestAborted);

            var hasServerTiming = response.Headers.TryGetValues(HttpHeaders.ServerTiming, out var serverTimings);
            var content = await response.Content.ReadAsStringAsync(httpContext.RequestAborted);
            var data = JsonConvert.DeserializeObject<IReadOnlyDictionary<string, object>>(content);
            return data == null ? (EmptyDictionary<string, object>.Singleton, []) :
                // Return the data and server-timing value
                (data, hasServerTiming ? serverTimings! : []);
        }
        catch (Exception ex)
        {
            log.LogCritical(ex, "Failed to load client config for {product} using {header} and {url}.", product, clientConfigAppInfo.Header, clientConfigAppInfo.Url);
            return (EmptyDictionary<string, object>.Singleton, StringValues.Empty);
        }
    }

    public IReadOnlyDictionary<string, ClientConfigAppInfo> GetClientConfigEndpoints(HttpContext httpContext)
    {
        if (!singleDomainAppConfiguration.IsEnabled())
            return clientConfigConfiguration.Endpoints.Where(e => e.Value.Enabled)
                .ToDictionary(k => k.Value.KeyOverride ?? k.Key, v => v.Value);

        var hostAppConfig = clientConfigConfiguration.Endpoints.First(e => e.Key == HostAppId).Value;
        var sfAppConfig = clientConfigConfiguration.Endpoints.First(e => e.Key == SfApiId).Value;

        var configs = new Dictionary<string, ClientConfigAppInfo>
        {
            { HostAppId, hostAppConfig },
            { SfApiId, sfAppConfig },
        };

        var currentProduct = singleDomainHostPathResolver.ResolveProduct(httpContext);
        var currentProductConfig = clientConfigConfiguration.Endpoints.FirstOrDefault(e => e.Key == currentProduct).Value ??
                                   new ClientConfigAppInfo(true, hostAppConfig.Header, null, null);
        configs.Add(currentProduct, currentProductConfig);

        return configs;
    }
}
