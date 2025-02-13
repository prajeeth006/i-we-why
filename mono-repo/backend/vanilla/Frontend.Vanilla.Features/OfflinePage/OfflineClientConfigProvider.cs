using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.OfflinePage;

internal class OfflinePageClientConfigProvider(IOfflinePageConfiguration offlinePageConfiguration) : LambdaClientConfigProvider("vnOfflinePage", () => new
{
    pollInterval = offlinePageConfiguration.PollInterval.TotalMilliseconds,
})
{
    public override ClientConfigType Type => ClientConfigType.Lazy;
}
