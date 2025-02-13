#nullable enable

using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

internal sealed class DisabledPosApiRestClient(IServiceClientsConfiguration serviceClientsConfiguration, IPosApiRestClient inner, ILogger<DisabledPosApiRestClient> log)
    : PosApiRestClientBase
{
    public override Task ExecuteAsync(ExecutionMode mode, PosApiRestRequest request)
    {
        var (disabledEndpoint, _) = ShouldDisableEndpoint(request);

        return disabledEndpoint ? Task.CompletedTask : inner.ExecuteAsync(mode, request);
    }

    public override Task<T> ExecuteAsync<T>(ExecutionMode mode, PosApiRestRequest request)
    {
        var (disabledEndpoint, defaultValue) = ShouldDisableEndpoint(request);

        if (!disabledEndpoint) return inner.ExecuteAsync<T>(mode, request);

        try
        {
            if (defaultValue == null) return Task.FromResult(Activator.CreateInstance<T>());

            var jsonString = JsonConvert.SerializeObject(defaultValue);
            var result = JsonConvert.DeserializeObject<T>(jsonString, PosApiRestClient.GetJsonSettings())!;

            return Task.FromResult(result);
        }
        catch (Exception ex)
        {
            if (defaultValue != null)
                log.LogError(ex, "Failed to create {defaultValue} object from config for {endpoint}", defaultValue, request.Url.ToString());
            else
                log.LogError(ex, "Failed to create object from default constructor for {endpoint}", request.Url.ToString());

            throw;
        }
    }

    private (bool, object?) ShouldDisableEndpoint(PosApiRestRequest request)
    {
        var disabledConfig = serviceClientsConfiguration.EndpointsV2
            .FirstOrDefault(kvp => kvp.Key.IsMatch(request.Url.ToString()));

        return (disabledConfig.Key != null && disabledConfig.Value.Disabled, disabledConfig.Value?.DefaultValue);
    }
}
