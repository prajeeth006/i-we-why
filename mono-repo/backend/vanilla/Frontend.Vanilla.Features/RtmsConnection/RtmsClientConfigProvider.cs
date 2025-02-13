using System.Collections.Generic;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.RtmsConnection;

/// <summary>
/// Outputs client-side config for RTMS connection.
/// </summary>
internal sealed class RtmsClientConfigProvider(IRtmsConfiguration config, ITraceRecorder traceRecorder) : LambdaClientConfigProvider("vnRtms", async cancellationToken =>
{
    if (!config.IsEnabled)
        return new { isEnabled = false };

    var disableEvents = new Dictionary<string, ClientEvaluationResult<bool>>();

    foreach (var item in config.DisabledEvents)
    {
        disableEvents.Add(item.Key.ToLower(), await item.Value.Disabled.EvaluateForClientAsync(cancellationToken));
    }

    return new
    {
        isEnabled = true,
        config.Host,
        KeepAliveMilliseconds = (int)config.KeepAliveInterval.TotalMilliseconds,
        ReconnectMilliseconds = (int)config.ReconnectInterval.TotalMilliseconds,
        TracingEnabled = await config.TracingEnabledCondition.EvaluateAsync(cancellationToken) || traceRecorder.GetRecordingTrace() != null,
        TracingBlacklistPattern = config.TracingBlacklistPattern?.ToString(),
        DisabledEvents = disableEvents,
        config.RemoteLogLevels,
        config.BackgroundEvents,
        config.EstablishConnectionOnlyInLoginState,
        ConnectionDelayInMilliseconds = config.ConnectionDelay.TotalMilliseconds,
    };
}) { }
