using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;

namespace Frontend.Vanilla.Features.EntryWeb.DataLayer;

internal sealed class DataLayerTrackingClientConfigProvider : LambdaClientConfigProvider
{
    public override ClientConfigType Type => ClientConfigType.Lazy;

    public DataLayerTrackingClientConfigProvider(ITrackingConfiguration config, IEnumerable<ITagManager> tagManagerRenderers)
        : base("vnTracking", () =>
        {
            var enabledRenderers = tagManagerRenderers.Where(r => r.IsEnabled).ToList();

            if (enabledRenderers.Count == 0)
                return new { IsEnabled = false };

            return new
            {
                IsEnabled = true,
                config.DataLayerName,
                config.NotTrackedQueryStrings,
                TagManagerRenderers = enabledRenderers.ConvertAll(r => r.Name),
                EventCallbackTimeoutInMilliseconds = (int)config.EventCallbackTimeout.TotalMilliseconds,
                DataLayerUpdateTimeoutInMilliseconds = (int)config.DataLayerUpdateTimeout.TotalMilliseconds,
                config.PageViewDataProviderTimeout,
                config.ClientInjectionExcludes,
                ClientTagManagers = enabledRenderers.Where(r => r.ClientInjectionEnabled).Select(r => new
                {
                    r.Name,
                    Script = r.GetClientScript(),
                }).ToList(),
                config.EnableLogging,
                config.EnableOmitting,
                config.DeviceConcurrency,
                config.DeviceMemory,
                config.BenchmarkThreshold,
                config.TrackingDelay,
                config.DeviceBlockEnabled,
                config.SchedulerEnabled,
                config.OmitAll,
                config.OmitPercentage,
                config.Blocklist,
                config.Allowlist,
            };
        })
        => tagManagerRenderers = tagManagerRenderers.ToArray();
}
