using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Json;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.ClientConfig;

/// <summary>
/// Unified execution and merging logic for <see cref="IClientConfigProvider" />-s.
/// </summary>
internal interface IClientConfigMergeExecutor
{
    Task<IReadOnlyDictionary<string, object>> ExecuteAsync(IEnumerable<IClientConfigProvider> providers, CancellationToken cancellationToken);
}

internal sealed class ClientConfigMergeExecutor(
    IClientConfigConfiguration mergerConfig,
    IJsonSerializerFactory jsonSerializerFactory,
    ILogger<ClientConfigMergeExecutor> log,
    IHttpContextAccessor contextAccessor,
    IDynaConParameterExtractor dynaConParameterExtractor)
    : IClientConfigMergeExecutor
{
    private readonly JsonSerializer jsonSerializer = jsonSerializerFactory.CreateSerializer();

    public async Task<IReadOnlyDictionary<string, object>> ExecuteAsync(IEnumerable<IClientConfigProvider> providers, CancellationToken cancellationToken)
    {
        var start = Stopwatch.GetTimestamp();
        var results = await Task.WhenAll(providers.Select(p => ExecuteProviderAsync(p, cancellationToken)));
        var mergedConfig = results.ToDictionary(r => r.Name.Value, r => r.Config);

        var valueTuples = results.Append(($"total_configs_{dynaConParameterExtractor.Product}", "(no config)", Stopwatch.GetElapsedTime(start)));

        var timingValues = valueTuples.OrderByDescending(r => r.Item3).Select(r => $"{r.Item1.Value};dur={r.Item3.FormatDuration()}");
        contextAccessor.HttpContext?.Response.Headers.Append(HttpHeaders.ServerTiming, timingValues.Join(","));

        return mergedConfig;
    }

    private async Task<(TrimmedRequiredString Name, object Config, TimeSpan Duration)> ExecuteProviderAsync(IClientConfigProvider provider,
        CancellationToken cancellationToken)
    {
        var start = Stopwatch.GetTimestamp();
        (Identifier name, JRaw configJson, TimeSpan timeElapsed) result = (provider.Name, new JRaw(string.Empty), TimeSpan.Zero);

        try
        {
            var config = await provider.GetClientConfigAsync(cancellationToken)
                         ?? throw new Exception(
                             $"Client config provider {provider.Name} returned null, which is invalid. Please always return at least an empty object/dictionary.");

            // Include serialization in duration measurement
            var strWriter = new StringWriter();
            jsonSerializer.Serialize(strWriter, config);

            result.configJson.Value = strWriter.ToString();
        }
        catch (Exception ex)
        {
            result.configJson.Value = @"{""isEnabled"":false,""isFailed"":true}";
            log.LogCritical("Evaluation of client config from {provider} with {name} failed to load with: {exception}",
                provider.ToString(),
                provider.Name,
                ex.GetMessageIncludingInner());
        }

        var elapsed = Stopwatch.GetElapsedTime(start);
        if (elapsed > mergerConfig.ProviderLongExecutionWarningTime)
            log.LogWarning(
                "Evaluation of client config from {provider} with {name} took {elapsedMs} which is longer than configured {threshold}."
                + " If this happens regularly especially on page reloads then it's a candidate for performance optimization e.g. caching underlying values",
                provider.ToString(),
                provider.Name,
                elapsed.TotalMilliseconds,
                mergerConfig.ProviderLongExecutionWarningTime);

        result.timeElapsed = elapsed;

        return result;
    }
}
